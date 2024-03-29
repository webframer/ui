import { __CLIENT__, debounce, Id, isEqual, isFunction, subscribeTo, unsubscribeFrom } from '@webframer/js'
import { cloneDeep, objChanges, update } from '@webframer/js/object.js'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { resizeWidth } from '../utils/element.js'
import { getUIState, saveUIState, setUIState } from '../utils/storage.js'
import { animateSize } from './animations.js'

// 'react-use' package has import issues in Node environment - do not use it
export const useIsomorphicLayoutEffect = __CLIENT__ ? useLayoutEffect : useEffect
export const useAnimatedHeight = hookAnimatedSize('height')
export const useAnimatedWidth = hookAnimatedSize('width')
const useAnimatedSize = {
  height: useAnimatedHeight,
  width: useAnimatedWidth,
}

/**
 * Create a React Hook for useAnimatedHeight/Width.
 * All height change scenarios involve layout measurement both at the start and end of animation,
 * if the height is not a pixel number. Layout prediction is only required for the end transition.
 * @see `animateSize` function for documentation
 *
 * @param {'width'|'height'} side - one of ['width', 'height']
 * @returns {function} react hook
 */
function hookAnimatedSize (side = 'height') {
  /**
   * Animate Height/Width Transitions without modifying the DOM markup.
   * @example:
   *    function Component ({open}) {
   *      const [ref, animating] = useAnimatedHeight(open ? 'auto' : 0)
   *      return <div ref={ref}>...</div>
   *    }
   * @param {number|string} size - css value for height/width
   * @param {{self?: object, duration?: number, forwards?: boolean}} - component instance to animate
   * @returns [ref: (node: HTMLElement) => void, animating: boolean, resetStyles: function]
   */
  function useAnimatedSize (size, {self, duration = 300, forwards} = {}) {
    const instance = useRef({[side]: size, timerById: {}})
    if (!self) {
      self = instance.current
    } else if (!self.node) {
      Object.assign(self, instance.current) // assign size initially
    }

    // useRef(null).current == null on initial useEffect with React.forwardRef => use function
    if (!self.ref) self.ref = node => self.node = node
    if (!self.resetStyles) self.resetStyles = () => self._resetStyles && self._resetStyles()

    // Skip logic for backend
    if (typeof window === 'undefined') return [self.ref, false, self.resetStyles]

    // Height change
    const [animating, setAnimating] = useState(false)
    useIsomorphicLayoutEffect(() => {
      if (self[side] === size) return

      // Set animating state explicitly in case of force update, and to force rerender at the end
      setAnimating(true)
      const [promise, resetStyles] = animateSize(self.node, self[side], size, side, duration, forwards)

      // Note: when user clicks too fast, Component may not finish expanding before it collapses,
      // setting `animating: false` before the collapse animation finishes, causing flicker.
      // This behavior can be tested with the Accordion example using slow animation duration.
      const timerId = Id()
      self.timerById[timerId] = true
      promise.then(() => {
        delete self.timerById[timerId]
        if (Object.keys(self.timerById).length === 0) setAnimating(false)
      })

      self._resetStyles = resetStyles
      self[side] = size
    }, [self, size, duration, forwards])

    // Mark state as animating as soon as there is size change, for Expand/Collapse render logic
    // because when closing element, the state is closed, but animating hasn't yet updated,
    // which causes bug for animation transitions when collapsing.
    return [self.ref, animating || self[side] !== size, self.resetStyles]
  }

  return useAnimatedSize
}

/**
 * Expand/Collapse Element with Animated Height.
 * @example:
 *    function Component ({list, ...props}) {
 *      const [{open, animating}, toggleOpen, setRef] = useExpandCollapse(props.open)
 *      const hasItems = list && list.length > 0
 *      return <>
 *        <button onClick={toggleOpen}>{open ? 'Collapse' : 'Expand'}</button>
 *        <div ref={setRef}>
 *          {(open || animating) && hasItems && list.map((item, i) => (...))}
 *        </div>
 *      </>
 *    }
 *
 * @param {boolean|null} [isOpen] - whether expanded initially, will update state if changes
 * @param {object} [options]:
 *  - {number} [duration] animation duration in milliseconds
 *  - {string} [direction] expand/collapse direction enum ('height' or 'width')
 *  - {number | string} [size] CSS style for open state, default is 'auto'
 * @returns [{open: boolean, animating: boolean}, toggleOpen: function, setRef: (node: HTMLElement) => void]
 */
export function useExpandCollapse (isOpen, {direction = 'height', size = 'auto', duration} = {}) {
  const [opened] = usePreviousProp(isOpen)
  const [self, state] = useInstance({open: isOpen})
  if (opened != null && isOpen != null && opened !== isOpen) state.open = isOpen // update prop changes

  if (!self.toggleOpen) self.toggleOpen = () => {
    if (self.animating) return
    self.setState({open: !self.state.open})
  }

  // Use cached open state while animating, to achieve the effect similar to throttle,
  // when `isOpen` prop changes too fast, so that it will always animate to the last prop
  const open = self.animating ? self.open : state.open
  const [setRef, animating, resetStyles] = useAnimatedSize[direction](open ? size : 0, {self, duration, forwards: true})
  useIsomorphicLayoutEffect(() => {
    // Started/in animation
    if (animating) {
      if (self.open == null) self.open = self.state.open // cache state initially
      return
    }

    // Finished animation
    resetStyles()
    if (self.open !== self.state.open) self.forceUpdate() // render with the latest prop if changed
    self.open = null // then reset cached state
  }, [animating, resetStyles])
  self.animating = animating
  return [{open, animating}, self.toggleOpen, setRef] // requires setRef function, not useRef()
}

/**
 * Get Current Element Height (with window resize event update).
 * @example:
 *    function Component () {
 *      const [height, setRef] = useElementHeight()
 *      return <div ref={setRef}>...</div>
 *    }
 *
 * @param {number} [delay] - milliseconds to debounce updates
 * @returns [height: number, setRef: (node: HTMLElement) => void]
 */
export function useElementHeight (delay = 16) {
  const [element, setRef] = useState(null)
  const [height, setHeight] = useState(0)

  // Prevent too many rendering using debounce
  const handleSize = useCallback(debounce(() => {
    if (element) setHeight(element.offsetHeight || 0)
  }, delay), [element, delay])

  useEventListener('resize', handleSize)

  useIsomorphicLayoutEffect(handleSize, [element])

  return [height, setRef]
}

/**
 * AddEventListener on mount and RemoveEventListener on unmount to ref element.
 * Automatically updates when eventName, ref element or event options change.
 * @example:
 *    const ref = useRef(null)
 *    useEventListener('click', (event) => alert(event), ref)
 *    return <div ref={ref}/>
 *
 * @param {string} eventName - to subscribe
 * @param {function} handler - event handler
 * @param {MutableRefObject<null>|{current}|*} [ref] - from React.useRef(null)
 * @param {object} [options] - event options
 */
export function useEventListener (eventName, handler, ref, options) {
  const self = useRef({}).current
  self.handler = handler
  if (!self.onEvent) self.onEvent = function () {self.handler.apply(this, arguments)}
  useEffect(() => {
    // Define the listening target
    let targetElement = (ref && ref.current) || window

    if (!(targetElement && targetElement.addEventListener)) return

    targetElement.addEventListener(eventName, self.onEvent, options)

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, self.onEvent, options)
      targetElement = null
    }
  }, [eventName, ref, options])
}

/**
 * Computed `compact` style object to apply to Element props
 * @param {boolean|number|null|void} compact - whether to use minimal width that fits content
 * @param {string|number} [content] - value to use for calculating compact width
 * @param {object|{placeholder: string}} [props] - Component props to mutate with compact `style`
 * @returns {{compact: boolean, props}} - props mutated with compact `style` if `compact` is defined
 */
export function useCompactStyle (compact, content, props = {}) {
  const {placeholder} = props
  const styleCompact = useMemo(() => {
    if (compact == null || compact === false) return
    let maxContent = content == null ? '' : String(content)
    if (placeholder && placeholder.length > maxContent.length) maxContent = placeholder
    return resizeWidth(maxContent, {}, compact)
  }, [compact, content, placeholder])
  compact = compact != null && compact !== false // convert to boolean for rendering
  if (compact) props.style = {...props.style, ...styleCompact}
  return {compact, props}
}

/**
 * Attach component mount lifecycle props to an object
 * @param {object} [self] - function Component instance to attach mount props
 * @returns {{didMount?: boolean, willUnmount?: boolean}} self with mount properties attached
 */
export function useMountCycle (self = useRef({}).current) {
  useEffect(() => (self.didMount = true) && (() => {self.willUnmount = true}), [])
  return self
}

/**
 * Check if the element with ref is being hovered directly (not including its children elements)
 * @param {MutableRefObject<null>|{current}|*} [ref] - from React.useRef(null)
 * @returns {[isHovered: boolean, ref]}
 */
export function useHovered (ref = useRef(null)) {
  const [isHovered, setValue] = useState(false)
  useEventListener('pointerenter', () => setValue(true), ref)
  useEventListener('pointerleave', () => setValue(false), ref)
  return [isHovered, ref]
}

/**
 * Resolve input `value` based on given `props` to be Controlled or Uncontrolled state,
 * this will mutate `props` to avoid duplicate value/defaultValue passed to `<input/>`,
 * and format the value, if `format` function exists, before updating the state by mutation.
 *
 * Notes:
 *  - if the `value` prop is undefined, the input becomes uncontrolled.
 *  - if `controlledValue` flag is true, input always use provided `value` prop.
 *
 * @example:
 * function MyComponent (_props) {
 *    const {noneInputProp1, noneInputProp2, controlledValue, format, ...props} = _props
 *    const [self] = useInstance()
 *    const [value, setValue, justSynced] = useInputValue(props, {controlledValue, format}, self)
 *
 *    >>> `value` will be the `defaultValue` initially, if `_props.value` is undefined
 *    >>> `value` is the formatted `_props.value` if `format` function exists
 *    >>> `value` === `self.state.value`
 *    >>> `value` === `props.value`
 *    >>> `setValue` === `self.setValue`
 *
 *    // ...later in the render
 *    <input {...props} />
 * }
 *
 * @param {object} props - input props containing `value` and/or `defaultValue`
 * @param {object} [modifiers] - such as `format` function or `controlledValue` flag
 * @param {object} [self] - Component instance from useInstance()
 * @returns [value: string, setValue: function, justSynced: boolean]
 *    value - to use as input value;
 *    setValue - function to change value state;
 *    justSynced - true if the new value prop just changed;
 *    with `props` mutated for passing to input, like this:
 *    <input {...props} />
 */
export function useInputValue (props, {controlledValue, format} = {}, self = useInstance()[0]) {
  const justSynced = usePreviousProp(props.value)[1]
  let {value = props.defaultValue, name} = props

  // Initialize value once
  if (!self.setValue && value !== void 0) {
    self.state.value = format ? format(value, name, self) : value
  }

  // Sync controlled state
  else if (controlledValue || justSynced) {
    self.state.value = format ? format(props.value, name, self) : props.value
  }

  // fix for React controlled value error
  if (self.state.value == null) self.state.value = ''

  // Mutate and cleanup unused props
  props.value = value = self.state.value
  delete props.defaultValue

  if (!self.setValue) self.setValue = (value) => self.setState({value})
  return [value, self.setValue, justSynced]
}

/**
 * Simulate React Class Component behaviors with `this` (self) Function Component instance.
 * @example:
 *    const [self, state] = useInstance({count: 0, length: 10})
 *
 *    // Declare instance method
 *    if (!self.method) self.method = () => {...} // more performant than useCallback pattern
 *
 *    // Set State similar to Class Component
 *    self.setState({count: 1})
 *    >>> self.state == {count: 1, length: 10}
 *
 *    // Force Component re-render
 *    self.forceUpdate()
 *
 * @param {object} [initialState]
 * @returns {[self: object, state: object]} [self, state] - that persists for the entire component existence
 */
export function useInstance (initialState = {}) {
  const {current: self} = useRef({})
  const [state, setState] = useState(initialState)
  self.state = state

  // Initial setup
  if (!self.setState) {
    self.forceUpdate = () => setState(state => ({...state}))
    self.setState = (newState, callback) => {
      if (isFunction(newState)) {
        if (callback) self.setStateCallbacks.push(callback)
        setState(state => newState(state, self.props || {}))
        return
      }
      if (isEqual({...self.state, ...newState}, self.state)) return
      if (callback) self.setStateCallbacks.push(callback)
      setState(state => ({...state, ...newState}))
    }
    self.setStateCallbacks = []
  }

  // Simulate callback after self.setState()
  if (self.setStateCallbacks.length) {
    self.setStateCallbacks.forEach(callback => callback())
    self.setStateCallbacks = []
  }

  return [self, self.state]
}

/**
 * Instagram/Pinterest Style Route as Modal.
 * Logic: changes route when Modal opens and goes back one route when Modal closes.
 *
 * @example:
 * function App (props) {
 *   const hasChangedRoutes = useRouteChange(props)
 *   const [children, modal] = useModalRoute(props, hasChangedRoutes)
 *   const [ref] = useScrollToElement(hasChangedRoutes[0])
 *    return (
 *     <View className='app'>
 *       <div ref={ref} />
 *       {children}
 *       {modal && renderModal(props)}
 *     </View>
 *   )
 * }
 *
 * // Change routes:
 *   // option 1:
 *     import { Link } from 'react-router'; // using CRA browser router
 *     // or
 *     import Link from '@webframer/kit/router/next/Link.jsx' // using Next.js
 *
 *     <Link to={{ pathname: '/login', state: { isModal: true, classModal: 'bg-transparent' } }}>
 *
 *   // option 2:
 *     import history from 'history' // using CRA browser router
 *     // or
 *     import history from '@webframer/kit/router/history.js' // using Next.js
 *
 *     history.push({ pathname: '/login', state: { isModal: true } })
 */
export function useModalRoute (
  props, [hasChangedRoute, prevChildren, prevLocation] = useRouteChange(props),
) {
  // re-render may cause the previous prop to change, while still in Modal state.
  // The logic should be:
  //  a) detect the first route transition => store previous children + cache isModal state
  //  b) when route changes again, re-calculate isModal state + clear/store previous children
  const {current: self} = useRef({})

  // Initial app load cannot have Modal because there is no previous children
  if (hasChangedRoute === void 0) return [props.children]

  // Return cached state if no route change detected
  if (hasChangedRoute === false) {
    // Only update current route children to the latest
    if (self.isModal) {
      self.modal = props.children
    } else {
      self.content = props.children
    }
    return [self.content, self.modal, self.previousLocation]
  }

  // Update cached state
  self.isModal = props.location.state && props.location.state.isModal

  // Save the previous children and location to display under
  if (self.isModal) {
    self.content = prevChildren
    self.modal = props.children
    self.previousLocation = prevLocation
  }
  // Reset to no Modal state
  else {
    self.content = props.children
    self.modal = null
    self.previousLocation = null
  }

  return [self.content, self.modal, self.previousLocation]
}

/**
 * Get previous prop of the Component, similar to class.componentWillReceiveProps
 * @param {any} value - to get from previous Component props
 * @param {boolean} [deep] - whether to use lodash isEqual() comparison
 * @returns [prevProp: any, justChanged: boolean]
 *    previous prop - undefined initially on the very first render;
 *    justChanged - whether the prop just changed value in this render cycle, true initially
 */
export function usePreviousProp (value, deep) {
  const self = useRef({}).current
  // Lodash isEqual() allows deep nesting of array/objects, and considers them to be equal
  // @example:
  //    const a = [new File([], 'test')]
  //    isEqual({a: [a]}, {a: [a]}))
  //    >>> true
  //    isEqual({a: [a]}, {a: [new File([], 'test')]}))
  //    >>> false
  self.justChanged = deep ? !isEqual(value, self.lastValue) : value !== self.lastValue

  // Set initial value once
  useEffect(() => {self.lastValue = value}, [])

  // Update cache value for the next render cycle if prop changed
  useEffect(() => {
    if (self.justChanged) {
      self.prevValue = self.lastValue // the cached value before the last value to restore
      self.lastValue = value
    }
  })

  // On initial render, prevValue is undefined
  return [self.justChanged ? self.lastValue : self.prevValue, self.justChanged]
}

/**
 * Get previous value of the Component during the last render.
 * (can be the same as current if forceUpdate - see usePreviousProp hook for changed props only).
 * @param {any} value - to get from previous render state
 * @returns {any|void} previous value - undefined initially
 */
export function usePreviousValue (value) {
  const instance = useRef()

  useEffect(() => {
    instance.current = value
  })

  return instance.current
}

/**
 * Check whether the app has just changed routes
 * @param {object} props - of the Component
 * @param {object} [self] - Component instance
 * @returns [hasChangedRoute?: boolean, previousChildren?, previousLocation?] true -
 *    if route changed, else false, void initially
 */
export function useRouteChange (props, self = useRef({}).current) {
  const prevProps = usePreviousValue(props)
  if (!prevProps) return []

  // Detect if route has just changed
  const {history, location, routes} = prevProps
  const hasChangedRoute = history && location && props.location && (
    /**
     * A next.js app may contain an SPA inside it using 'react-router'.
     * `routes` and  `location.key` are 'react-router' only specific implementation.
     * => A route has only changed if one of these conditions is met:
     *    1. It is not a browser router (!routes) and location.pathname changed
     *    2. It is a browser router and location.key changed (location.pathname may change
     *       even for the same route, so compare with location.key instead)
     */
    (!routes && props.location.pathname !== location.pathname) ||
    (!!routes && props.location.key !== location.key)
  )

  // Cache previous props, because Component may re-render without changing routes
  if (hasChangedRoute) {
    self.prevChildren = prevProps.children
    self.prevLocation = prevProps.location
  }

  return [hasChangedRoute, self.prevChildren, self.prevLocation]
}

/**
 * Scroll to the given ref element on render (example: scroll to top when route changes).
 *
 * @param {boolean} shouldScroll - whether to scroll to the ref element
 * @param {object} [options]
 * @param {MutableRefObject<null>|{current}|*} [ref] - from React.useRef(null)
 * @returns [ref: MutableRefObject<null>] ref - to assign to the element to scroll to
 */
export function useScrollToElement (shouldScroll, options = {behavior: 'auto'}, ref = useRef(null)) {
  if (ref.current && shouldScroll) ref.current.scrollIntoView(options)
  return [ref]
}

/**
 * Get the latest prop value when it changes, else the current state
 * @example:
 *    const [self] = useInstance()
 *    self.state.value = useSyncedProp(prop, self.state.value)[0]
 */
export function useSyncedProp (prop, stateValue = prop) {
  const justSynced = usePreviousProp(prop)[1]
  return [justSynced ? prop : stateValue, justSynced]
}

/**
 * Update Component state when props change, similar to class.componentWillReceiveProps
 * @example:
 *    const [self] = useInstance()
 *    const [state, justChanged] = useSyncedState({value}, self.state)
 *    self.state = state
 *    >>> state.value // syncs with `value` prop changes, but `self.setState` can update it
 *
 * @param {object} props - initial or new props to sync state with
 * @param {object} [state] - the current state
 * @returns {[state: object, justSynced: boolean, prevState: object, changedProps?: object]}
 *    - state: mutated with partially updated `props` that changed, or existing state if nothing changed
 *    - justSynced: if it has just changed to sync with props.
 *    - changedProps: properties that changed.
 *    - prevState: deep clone of the previous state just before syncing, same as state otherwise
 *    - If `props` has `null` attributes, they will override `state`.
 *    Attributes that do not exist in `props` but in `state` are kept (usually the desired behavior).
 */
export function useSyncedState (props, state = {}) {
  const [prevProps, justSynced] = usePreviousProp(props, true)
  let changedProps, prevState = state
  if (justSynced) {
    prevState = cloneDeep(state)
    // Keep `state` object the same
    update(state, changedProps = objChanges(prevProps, props, {ignoreDeleted: true}))
  }
  return [state, justSynced, prevState, changedProps]
}

/**
 * Create a globally unique ID string for the entire Component's lifetime.
 * For SSR rendering, use built-in `useId` method provided by React.
 *
 * @param {string} [id] - the unique ID to use, defaults to generating a new one on the first render
 * @returns {string} uid - globally unique ID
 */
export function useUId (id) {
  const {current: self} = useRef({id})
  if (!self.id) self.id = Id()
  return self.id
}

/**
 * UIContext state provider
 * @example:
 *   // App.js
 *   const [state] = useUIState()
 *   //...
 *   <UIContext.Provider value={state}>
 *     <View>...</View>
 *   </>
 * @param {object} [initialState]
 * @returns [state: {
 *       isMobile: boolean,
 *       isTablet: boolean,
 *       isDesktop: boolean,
 *       isLaptop: boolean,
 *       isFHD: boolean,
 *       is2K: boolean,
 *       is3K: boolean,
 *     }] state - for UIContext.Provider
 */
export function useUIContext (initialState = getUIContext()) {
  const [self, state] = useInstance(initialState)
  if (!self.resize) self.resize = debounce(() => self.setState(getUIContext()))
  useEffect(() => {
    subscribeTo('resize', self.resize)
    return () => {unsubscribeFrom('resize', self.resize)}
  }, [])
  return [state, self.setState]
}

/**
 * Persistent UI_STATE in Local Storage
 *
 * @param {String} storageKey - keyPath inside UI_STATE object to store state
 * @param {any} [initialState] - initial value to use when UI_STATE does not yet have `storageKey`
 * @returns [state: any, saveStorage(payload) => void, setStorage(state) => void]
 */
export function useUIStorage (storageKey, initialState) {
  const self = useRef({}).current
  const [cache, setCache] = useState(0)
  self.state = useMemo(() => __CLIENT__ ? getUIState(storageKey, initialState) : initialState, [cache])
  if (!self.update) {
    self.update = async function (payload, storageFunc) {
      const updated = await storageFunc(storageKey, payload)
      if (updated) setCache(Date.now())
    }
    self.setStorage = (payload) => self.update(payload, setUIState)
    self.saveStorage = (payload) => self.update(payload, saveUIState)
  }
  return [self.state, self.saveStorage, self.setStorage]
}

// HELPERS -----------------------------------------------------------------------------------------

// Get state for UIContext Provider
export function getUIContext () {
  if (typeof window !== 'undefined') {
    const {innerWidth} = window
    // https://gs.statcounter.com/screen-resolution-stats
    return { // only set booleans to reduce re-renders
      isMobile: innerWidth < 768,
      isTablet: innerWidth >= 768 && innerWidth < 1280,
      isDesktop: innerWidth >= 1280,
      isLaptop: innerWidth >= 1280 && innerWidth <= 1680,
      isFHD: innerWidth > 1680 && innerWidth <= 1920,
      is2K: innerWidth > 1920 && innerWidth <= 2560,
      is3K: innerWidth > 2560 && innerWidth <= 3840,
    }
  } else {
    return {}
  }
}

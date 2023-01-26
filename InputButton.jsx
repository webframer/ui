import { debounce, TIME_DURATION_INSTANT } from '@webframer/js'
import { isPureKeyPress } from '@webframer/js/keyboard.js'
import cn from 'classnames'
import React from 'react'
import { Button } from './Button.jsx'
import { Input } from './Input.jsx'
import Label from './Label.jsx'
import { useInputValue, useInstance } from './react/hooks.js'
import { renderProp } from './react/render.js'
import { type } from './types.js'
import { onEventHandler } from './utils/interaction.js'

/**
 * Button that turns into Input on single/double click, and back on Blur/Enter/Escape events:
 *
 *  - Input can be native or any custom input `type` defined by the `controls` prop.
 *  - Button state allows dragging to reorder, and single/double click to edit Input,
 *    whereas dragging Input becomes text selection (ie. highlight text).
 *  - Drag events do not fire `onClick`.
 *
 * Requirements:
 *  - Input component must have internal `value` state attached to `self.state.value` or
 *    `event.target.value` for `onBlur` and `onKeyUp` events.
 *    See `self.getStateValue` for reference.
 *
 * Logic:
 *    - `onChange` event only fires on Blur/Enter events from Input,
 *      => to subscribe to any Input value changes while typing, use `onInput` events
 *    - Escape key press will discard any changes made to Input, and simulate `onBlur` event
 *    - It's possible to pass both `onClick` and `onDoubleClick` handlers (see below).
 *    - `onClick` and `onDoubleClick` handlers are removed from Input.
 *
 * Notes:
 *    - React only has single or double click events.
 *    - The default React behavior, if both handlers are passed, is:
 *      1. the `onClick` fires twice,
 *      2. then `onDoubleClick` event fires after.
 *    - When `inputClicks >= 2` or `onDoubleClick` handler exists,
 *      this component skips `onClick` event when `onDoubleClick` fires with a delay,
 *      treating `onClick` as single or more than two clicks event.
 *    - `onClick` event can check the count of clicks with `event.detail: number`.
 */
export function InputButton (_props) {
  const [self, {isInput}] = useInstance()
  let Component = isInput ? _props.Input : _props.Button

  // onBlur event may send parsed value for backend, but input state stores formatted value.
  // This component should sync with input state to render correct value (ie. e.target.value)
  // See Input.md for how `format`/`parse` functions work.
  const {defaultValue, value} = _props
  useInputValue({defaultValue, value}, _props, self) // this mutates self.state.value

  // Event Handlers --------------------------------------------------------------------------------
  if (!self.props) {
    // Click event handlers
    self.onClick = function (e) {
      if (self.isDrag) return
      switch (e.detail) {
        case 2:
          const {onDoubleClick} = self.props
          if (onDoubleClick) onDoubleClick.call(this, arguments)
          break
        case 1:
        default:
          const {onClick} = self.props
          if (onClick) onClick.apply(this, arguments)
      }
      if (e.defaultPrevented) return

      if (e.detail === self.props.inputClicks)
        self.setState({isInput: true})
    }
    self.onClickDelayed = debounce(self.onClick, TIME_DURATION_INSTANT)

    // To differentiate `click` from `drag`, we monitor `pointermove` events on the Button
    self.onPointerDown = onEventHandler('onPointerDown', self, () => (self.isDrag = false))
    self.onPointerMove = onEventHandler('onPointerMove', self, () => (self.isDrag = true))

    // Input `onBlur` handler that fires `onChange` value
    self.onBlur = function (e) {
      const {onBlur, onChange} = self.props
      if (onBlur) onBlur.call(this, arguments)
      if (e.defaultPrevented) return
      const value = self.getStateValue.apply(this, arguments)
      if (onChange && value !== self.state.value) onChange.call(this, arguments)
      self.setState({isInput: false, value: e.defaultPrevented ? self.state.value : value})
    }

    // Do not use `onKeyPress` because its deprecated and does not capture Escape
    self.onKeyUp = onEventHandler('onKeyUp', self, function (e) {
      if (!isPureKeyPress(e)) return
      switch (e.key) {
        case 'Enter': // fires `onChange` without loosing focus
          self.change.apply(this, arguments)
          break
        case 'Escape': // switch back to Button without firing `onChange`
          self.blur.apply(this, arguments)
          break
      }
    })

    // Simulate `onBlur` event for consistency, without changing `value` (does not fire `self.onBlur`)
    self.blur = function (e) {
      const {onBlur, name} = self.props
      if (onBlur) onBlur.call(this, e, self.getParsedValue.call(this, e), name, self)
      if (e.defaultPrevented) return
      self.setState({isInput: false})
    }

    // Syncs with `useInputSetup` behavior ---------------------------------------------------------
    self.change = function (e) {
      const value = self.getStateValue.apply(this, arguments)
      const {onChange, name} = self.props
      if (onChange && value !== self.state.value)
        onChange.call(this, e, self.getParsedValue.call(this, e, value), name, self)
      if (e.defaultPrevented) return
      self.setState({value})
    }
    self.getParsedValue = function (e, value = self.state.value) {
      const {parse, name} = self.props
      if (parse) value = parse.call(this, value, name, self, e)
      return value
    }

    // Get `self.state.value` or `event.target.value` from event
    self.getStateValue = function (e, v, n, s) {
      const {state: {value = e.target.value} = {}} = s || {}
      return value
    }
  }
  self.props = _props

  // Render Props ----------------------------------------------------------------------------------
  let props
  // Button props
  if (!isInput) {
    let {childBefore, childAfter, inputClicks, onDoubleClick, ...btnProps} = _props
    inputOnlyProps.forEach(key => delete btnProps[key])
    btnProps.onClick = (inputClicks > 1 || onDoubleClick) ? self.onClickDelayed : self.onClick
    btnProps.onPointerDown = self.onPointerDown
    btnProps.onPointerMove = self.onPointerMove
    btnProps.children = renderProp(self.state.value, self) // wrap with Text for styling cursor indicator
    if (btnProps.label != null) {
      Component = ButtonWithLabel
      btnProps.self = self
    }
    props = btnProps
  }
  // Input props
  else {
    let {onClick, onChange, ...inputProps} = _props // remove onClick (for Button only)
    // todo: improvement 3 - set caret position on click
    // It's quite tricky to simulate click -> input does not get focused like when
    // the user clicks for real. The only way to focus on input programmatically, at the moment
    // of writing, is to call `input.focus()`, then `input.setSelectionRange()`,
    // which requires the `selectionStart` position that we do not have a way to compute.
    // => so using autofocus for now.
    inputProps.autoFocus = true
    if (inputProps.compact == null) inputProps.compact = 0
    inputProps.onKeyUp = self.onKeyUp
    inputProps.onBlur = self.onBlur
    inputProps.value = self.state.value
    props = inputProps
  }
  delete props.inputClicks
  delete props.onDoubleClick
  delete props.Button
  delete props.Input
  props.className = cn(props.className, 'input--btn')

  return <Component {...props} />
}

InputButton.defaultProps = {
  Button,
  Input,
  inputClicks: 1,
}
InputButton.propTypes = {
  // Button Component to use
  Button: type.JSXElementType.isRequired,
  // Input Component to use
  Input: type.JSXElementType.isRequired,
  // Number of clicks to turn into Input, set as 2 for Double Click, default is single click
  inputClicks: type.Enum([1, 2]),
  // ...other props to pass to Button or Input
}

export default React.memo(InputButton)

function ButtonWithLabel ({label, self, ...props}) {
  return (<>
    <Label className='input__label'>{renderProp(label, self)}</Label>
    <Button {...props} />
  </>)
}

const inputOnlyProps = [
  'controls', 'error', 'info', 'helpTransition', 'type',
  'compact', 'controlledValue', 'defaultValue', 'value', 'onRemove', 'format', 'parse',
  'prefix', 'suffix', 'stickyPlaceholder', 'noSpellCheck', 'childBefore', 'childAfter',
  'icon', 'iconEnd',
]
import { ips, isFunction, isObject, TIME_DURATION_INSTANT, toList, trimSpaces } from '@webframer/js'
import cn from 'classnames'
import * as React from 'react'
import { useCallback, useMemo } from 'react'
import { Row } from '../components/Row.js'
import Text from '../components/Text.js'
import { renderProp } from '../react/render.js'
import { type } from '../types.js'
import { onEventStopPropagation } from '../utils/interaction.js'

// Select Dropdown Option Item
export function SelectOption ({
  option, onClick, onBlur, onFocus, focused, selected, search, query,
  className, ...props
}) {
  // Event Handlers --------------------------------------------------------------------------------
  props.onClick = useCallback(function (e) {
    e.stopPropagation()
    // the `onClick` by default is selectOption,
    // but can be overridden by `optionProps.onClick` for custom behavior
    onClick.call(this, e, option)
  }, [option, onClick])
  props.onBlur = useCallback(function (e) {onBlur.call(this, e, option)}, [option, onBlur])
  props.onFocus = useCallback(function (e) {onFocus.call(this, e, option)}, [option, onFocus])

  // Option Text or Children Display ---------------------------------------------------------------
  let t, _props = {}
  if (isObject(option)) {
    // Removing private `_data` (used for search filters) from Option props before rendering
    const {value, text = String(value), key, _data, ...rest} = option
    _props = rest
    t = text
  } else {
    t = String(option)
  }

  // Highlight matched query -----------------------------------------------------------------------
  if (search && query) {
    let i, q = query.toLowerCase(), text = t.toLowerCase()
    // to keep the logic simple, for now only use exact match once, case-insensitive
    if (q === text) t = <b>{t}</b>
    else if ((i = text.indexOf(q)) > -1)
      t = <>{t.substring(0, i)}<b>{t.substring(i, i + q.length)}</b>{t.substring(i + q.length)}</>
  }

  // Custom Option children
  if (_props.children != null) _props.children = renderProp(_props.children, {
    text: t, props: {...props, className, option, focused, selected, search, query},
  })
  const {children = <Text>{t}</Text>, className: _className, ...rest} = _props

  return (
    <Row className={cn('select__option', className, _className, {focused, selected})}
         {...props} {...rest}>{children}</Row>
  )
}

SelectOption.propTypes = {
  option: type.Option.isRequired,
  // Handler(event, option) => void - when option is clicked
  onClick: type.Function.isRequired,
  // Handler(event, option) => void - on option blur event
  onBlur: type.Function.isRequired,
  // Handler(event, option) => void - on option focus event
  onFocus: type.Function.isRequired,
  // Whether the current option has focus
  focused: type.Boolean,
  // Whether the current option is selected
  selected: type.Boolean,
  // Whether Select has search enabled to highlight matched query
  search: type.Boolean,
  // Current Select search query to highlight matches
  query: type.String,
}

const SelectOptionMemo = React.memo(SelectOption)
SelectOptionMemo.name = SelectOption.name
SelectOptionMemo.propTypes = SelectOption.propTypes
SelectOptionMemo.defaultProps = SelectOption.defaultProps
export default SelectOptionMemo

// Tooltip Props for Select Option
export const optionTooltipProps = {
  // max width is required for proper calculation of the Tooltip position
  className: 'max-width-600', position: 'right', on: 'hover',
  // offset dropdown scrollbar to avoid loosing focus
  style: {marginInlineStart: '-0.5em', marginInlineEnd: '-0.5em'},
  // prevent clicks inside the Tooltip from firing onClick on the parent container
  onClick: onEventStopPropagation(), tabIndex: -1, delay: TIME_DURATION_INSTANT,
}

// Create Option props to work with Select Component
export function useSelectionOptionProps ({
  focusIndex, multiple, value, search, query, self, optionProps: optProps, // from Select props
  addOption, addOptionMsg, options, noOptionsMsg,
  forceRender, open,
}) {
  const shouldRender = forceRender || open

  // Generic Option Props that is common to all options
  const optionProps = useMemo(() => ({
    onClick: self.selectOption,
    onBlur: self.onBlurOption,
    onFocus: self.onFocusOption,
    tabIndex: -1, // tab moves to the next input + avoid focusIndex mismatch
    ...optProps,
  }), [optProps])

  const isSelected = useMemo(() => {
    return value != null ? (multiple ? (v => value.includes(v)) : (v => value === v)) : (v => false)
  }, [value, multiple])

  // Function(option, index) => props - memoized function to get option props
  const optionPropsGetter = useCallback(function (option, index) {
    let v, k
    if (isObject(option)) {
      const {value, key = String(value)} = option
      v = value
      k = key
    } else {
      v = option
      k = String(option)
    }
    return {
      key: k,
      option,
      focused: index === focusIndex,
      selected: isSelected(v),
      search, query,
      ...optionProps,
    }
  }, [focusIndex, isSelected, optionProps, search, query])

  // Function(option, index) => `<SelectOption/>` to render each option
  const renderOption = useCallback(function (option, index) {
    return <SelectOption {...optionPropsGetter.apply(this, arguments)} />
  }, [optionPropsGetter])

  // Convert `addOption` prop to an Option object for rendering
  addOption = useMemo(() => {
    if (search && query && shouldRender) {
      addOption = isFunction(addOption) ? addOption(query) : addOption
      if (addOption) return addOptionItem(addOption, addOptionMsg, options, query, value)
    }
  }, [addOption, addOptionMsg, options, search, query, shouldRender])
  if (addOption) addOption = renderOption(addOption, -1)

  // Convert noOptionsMsg to a component ready for rendering
  const hasNoOptions = !options.length
  const noOptions = useMemo(() => hasNoOptions && !!noOptionsMsg && shouldRender &&
      <Row className='select__option' children={renderProp(noOptionsMsg, self)} />,
    [hasNoOptions, noOptionsMsg, shouldRender])

  return {addOption, noOptions, optionPropsGetter, renderOption, shouldRender}
}

/**
 * Create `addOption` item for `<SelectOption>` component to render.
 * Logic to detect if addOption message should be shown:
 *  - query exists and does not match selected values or available options
 *
 * @param {boolean|object} addOption - optional props to add to resulting option object
 * @param {string} addOptionMsg - localised string with `term` placeholder to be replaced by `query`
 * @param {array<any>} options - all available options from the original Select props
 * @param {string} query - current search query
 * @param {any} value - Select component's selected value state
 * @returns {{text: string, value: string}|void} option - if query can be added
 */
function addOptionItem (addOption, addOptionMsg, options, query, value) {
  query = trimSpaces(query)
  if (!query) return
  let q = query.toLowerCase()
  if (value != null && toList(value).find(v => String(v).toLowerCase() === q)) return
  if (options.find(o => isObject(o)
    ? (o.text || String(o.value)).toLowerCase() === q
    : String(o).toLowerCase() === q,
  )) return
  return {text: ips(addOptionMsg, {term: query}), value: query, ...addOption}
}

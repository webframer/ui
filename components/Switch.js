import cn from 'classnames'
import React from 'react'
import { useExpandCollapse } from '../react.js'
import { renderProp } from '../react/render.js'
import { type } from '../types.js'
import checkbox from './Checkbox.js'
import Icon from './Icon.js'
import { renderInputLabel, useInputSetup } from './InputNative.js'
import Label from './Label.js'
import { Loader } from './Loader.js'
import { Row } from './Row.js'
import Spacer from './Spacer.js'
import { extractProps } from './View.js'

/**
 * Switch (Toggle) Input Component
 */
export function Switch ({
  className, error, label, checkedLabel, uncheckedLabel, title,
  ...props
}) {
  const viewProps = extractProps(props)
  const {
    active, disabled, loading, readonly, value,
    childBefore, childAfter, id, input, self,
  } = useInputSetup(props, switchEnabledOptions)

  // Event Handler ---------------------------------------------------------------------------------
  if (!self.changeChecked) self.changeChecked = function (e) {
    return self.onChange.call(this, e, e.target.checked) // extend the base pattern
  }
  input.onChange = self.changeChecked

  // Render Prop -----------------------------------------------------------------------------------
  const checked = input.checked = value
  input.type = 'checkbox'
  delete input.value

  return (
    <Row className={cn(className, 'switch', {active, disabled, readonly, loading, error, checked})}
         {...viewProps}>
      {label != null && renderInputLabel(label, self, {...input, className: 'switch__label'})}
      {childBefore}
      <input className='sr-only' {...input} />
      <Label className='switch__toggle' title={title} {...!disabled && !readonly && {htmlFor: id}}>
        <SwitchLabels {...{checked, checkedLabel, uncheckedLabel, loading, self}} />
      </Label>
      {childAfter}
    </Row>
  )
}

function ToggleLabels ({checked, checkedLabel, uncheckedLabel, loading, self}) {
  const [{open: oOn, animating: aOn}, _on, on] = useExpandCollapse(checked, {direction: 'width'})
  const [{open: oOff, animating: aOff}, _off, off] = useExpandCollapse(!checked, {direction: 'width'})
  return <>
    <div className={cn('switch__on', {open: oOn || aOn})} ref={on}
         children={(oOn || aOn) && (checkedLabel == null
           ? <Icon className='fade-in' name='checkmark' font />
           : renderProp(checkedLabel, self))} />
    <div className='switch__btn'>{loading && <Loader loading />}</div>
    <div className={cn('switch__off', {open: oOff || aOff})} ref={off}
         children={(oOff || aOff) && (uncheckedLabel == null
           ? <Spacer />
           : renderProp(uncheckedLabel, self))} />
  </>
}

const SwitchLabels = React.memo(ToggleLabels)

Switch.propTypes = {
  // Whether to lock input value when `value` prop is given
  controlledValue: type.Boolean,
  // Initial value for uncontrolled checked or unchecked state
  defaultValue: type.Any,
  // Label to show before the switch (or after Switch with `reverse` true)
  label: type.NodeOrFunction,
  // UI to show for checked state inside the Switch toggle, defaults to a checkmark icon
  checkedLabel: type.NodeOrFunction,
  // UI to show for unchecked state inside the Switch toggle, defaults to empty Spacer
  uncheckedLabel: type.NodeOrFunction,
  // Handler(event, value: any, name?: string, self) on input value changes
  onChange: type.Function,
  // Handler(event, value: any, name?: string, self) on input focus
  onFocus: type.Function,
  // Handler(event, value: any, name?: string, self) on input blur
  onBlur: type.Function,
  // Internal value for controlled checked or unchecked state
  value: type.Any,
  // Function(value, name?, event?, self) => boolean - Input value formatter for input.checked
  format: type.Function,
  // Function(value: boolean, name?, event, self) => any - value parser for onChange/onBlur/onFocus handlers
  parse: type.Function,
  // Unique identifier, default is string created from React.useId()
  id: type.String,
  // ...other native HTML `<input/>` props
}

const SwitchMemo = React.memo(Switch)
SwitchMemo.name = Switch.name
SwitchMemo.propTypes = Switch.propTypes
SwitchMemo.defaultProps = Switch.defaultProps
export default SwitchMemo

const switchEnabledOptions = {childBefore: true, childAfter: true}

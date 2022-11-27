import { FILE } from '@webframer/js'
import cn from 'classnames'
import React from 'react'
import { accessibilitySupport, isRef } from './react.js'
import { type } from './types.js'

function createIcon () {
  /**
   * Icon - Pure Component
   */
  function Icon ({name, className, font, path = FILE.PATH_ICONS, _ref, children, ...props}, ref) {
    props = accessibilitySupport(props) // ensures correct focus behavior on click
    if (isRef(ref)) props.ref = ref
    else if (_ref) props.ref = _ref

    let mask
    if (!font && name) {
      mask = `url(${path}${name}.svg) no-repeat center / contain`
      mask = {WebkitMask: mask, mask}
    }

    return (
      <i className={cn(`icon-${name}`, className, {mask, pointer: props.onClick && props.tabIndex !== -1})}
         aria-hidden='true' {...props}>{mask && <span className='icon__mask' style={mask} />}{children}</i>
    )
  }

  const IconRef = React.forwardRef(Icon)

  Icon.propTypes = IconRef.propTypes = {
    // Icon name, can be empty string to be styled with custom CSS
    name: type.Icon.isRequired,
    className: type.ClassName,
    style: type.Style,
    // If true, use Font Icon, instead of CSS Mask Icon - the default
    font: type.Boolean,
  }

  return [Icon, IconRef]
}

export const [Icon, IconRef] = createIcon()
export default React.memo(Icon)

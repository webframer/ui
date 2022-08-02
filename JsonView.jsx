import cn from 'classnames'
import React from 'react'
import JsonTree from 'react-json-tree' // do not use react-json-view because it breaks with recursive JSON and in Node.js
import defaultTheme from './JsonView.themes.js'
import { type } from './types.js'
import View from './View.jsx'

/**
 * Json nested Object Renderer - Pure Component.
 *
 * @param {Object|Array} data - collection to render
 * @param {Boolean} [dark] - whether to render inverse background color, default is false
 * @param {Boolean} [open] - whether to expand all nested nodes, default is false
 * @param {Object} [theme] - color definitions
 * @param {String} [className] - css class name
 * @param {Object} [style] - css styles
 * @param {Boolean} [fill] - css styles
 * @param {*} props - other attributes to pass to `<div></div>`
 * @returns {Object} - React Component
 */
export function JsonView ({data, dark, open, theme, className, style, fill, ...props}) {
  if (open) props.shouldExpandNode = expandNode
  return (
    <View className={cn('json-tree', className, {fill})} style={style}>
      <JsonTree hideRoot invertTheme={!dark} theme={theme} data={data} {...props} />
    </View>
  )
}

const expandNode = () => true

JsonView.propTypes = {
  // JSON data to show as JavaScript Object
  data: type.Collection.isRequired,
  // Color scheme
  theme: type.Object,
}

JsonView.defaultProps = {
  theme: defaultTheme,
}

export default React.memo(JsonView)
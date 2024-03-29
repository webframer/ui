import { isFileSrc, isFunction, toCamelCase, toCapCase } from '@webframer/js'

export const cssVendorPrefixPattern = /^(-webkit-|-moz-|-o-|-ms-).+$/
export const FONT = {
  FAMILY: { // Font family that has fallback in common operating systems for all glyphs
    UI: 'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,' +
      'Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
  },
}

/**
 * Apply CSS styles to Node element, with original styles extracted.
 * @example:
 *    const originalStyles = applyStyles(element.style, {border: '1px solid green'})
 *    // reset back to the original styles
 *    applyStyles(element.style, originalStyles)
 *
 * @param {object|CSSStyleDeclaration} style - HTMLElement.style, or React style object, to apply with css values
 * @param {object|null|undefined|boolean|number} values - css attributes (camelCase) with their values to apply
 * @returns {object|CSSStyleDeclaration} style - extracted old styles before new ones were applied
 */
export function applyStyles (style, values) {
  const extracted = {}
  for (const attr in values) {
    extracted[attr] = style[attr] || null // set as null to reapply back later without check
    style[attr] = isFunction(values[attr]) ? values[attr](style) : values[attr]
  }
  return extracted
}

/**
 * Compute CSS `background-image` property from given file data
 *
 * @param {String} src - URL or base64 encoded data
 * @returns {String} backgroundImage - for CSS style
 */
export function cssBgImageFrom (src) {
  // Since base64 encoded string is usually large, it's better to check if `src` is URL or Path.
  // If not, default to base64 format, because that is the only other format valid for use as css url.
  // This logic works, especially when `src` can be String object, which fails with isBase64() check.
  return `url('${isFileSrc(src) ? encodeURI(src) : src}')`
}

/**
 * Create Inline SVG data for use as CSS value
 * @note: the `#` string inside svg data will be converted to `%23`
 *
 * @param {String} svgString - svg file data as base64 string
 * @param {Number} [x] - coordinate of the hot spot, default is 0
 * @param {Number} [y] - coordinate of the hot spot, default is 0
 * @return {string} url - as inline css value (example: for use as cursor)
 */
export function inlineSvg (svgString, x = 0, y = 0) {
  return `url('data:image/svg+xml;utf8,${svgString.replace(/#/g, '%23')}') ${x} ${y}, auto`
}

/**
 * Convert DOM's inline `style` attribute value to style object (example: for use with React)
 * @param {string} string - example: 'color: red; border-width: 1px;'
 * @returns {object} style - example: `{color: 'red', borderWidth: '1px'}`
 */
export function styleObjFrom (string) {
  return toCamelCaseKeys(
    string.split(';').map(v => v.trim()).filter(v => v).reduce((acc, d) => {
      const [key, value] = d.split(':').map(v => v.trim()).filter(v => v)
      if (key && value) acc[key] = Number.isNaN(Number(value)) ? value : Number(value)
      return acc
    }, {}),
  )
}

/**
 * Convert CSS object to style object with camelCase key properties for rendering.
 * @param {object} css - to convert to style object with camelCase properties
 * @returns {object} style - ready for use as Component prop or `applyStyles()`
 */
export function toCamelCaseKeys (css) {
  const style = {}
  for (const key in css) {
    if (key.startsWith('--')) style[key] = css[key] // variables
    else if (cssVendorPrefixPattern.test(key)) style[toCapCase(key)] = css[key] // vendor prefix
    else style[toCamelCase(key)] = css[key] // other attributes
  }
  return style
}

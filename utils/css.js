import { CDN_URL, isFileSrc, isFunction } from '@webframer/utils'

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
 * Compute Preview Image src from dynamic `preview` attribute
 * @param {String|Object} preview - type.UrlOrBase64OrPreview
 * @param {String} [size] - one of thumb/medium/large/etc.
 * @param {String} [prefix] - url prefix (defaults to CDN url, if set in .env variable REACT_APP_CDN_URL)
 * @returns {String|Object} preview src ready for consumption by Components
 */
export function previewSize (preview, size = 'thumb',
  prefix = ((typeof preview === 'string' && (preview.indexOf('blob:') === 0 || preview.indexOf('http') === 0)) ? '' : CDN_URL)) {
  // typeof DOMString/ObjectURL === 'string' and typeof new String() === 'object'
  return preview && (prefix + (typeof preview === 'object' ? (preview[size] || preview) : preview))
}
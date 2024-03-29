import { current } from '@webframer/js/_envs.js'
import PropTypes from 'prop-types'
import * as React from 'react'

// This is needed for the `ts` compiler to resolve types in types.d.ts
export { React }

/**
 * PROPTYPES PROXY =================================================================================
 *
 * A PropType system for clear semantic meaning without documentation and cross-platform unified API.
 * All types should follow CapCase convention for readability and consistency.
 *
 * **Important**:
 *  - Do not use numeric keys for object types, because new form values will be generated as array.
 *    @see https://github.com/lodash/lodash/issues/1316
 *
 * =================================================================================================
 */
export const type = {}

// Define this custom type generators on initialisation to override `type` behaviors
const {defineCreator, defineBase, defineCommon, defineExtended, defineComponent} = current.type || {}

/**
 * Type Creators -----------------------------------------------------------------------------------
 */

/**
 * Enumerable value.
 * @example:
 *  type.Enum(['a', 5])
 *  >>> 'a' | 5
 *
 * @type {(...args: unknown[]) => typeof args[number]}
 */
type.Enum = PropTypes.oneOf

/**
 * Instance of a class. This uses JS instanceof operator.
 * @example:
 *  type.InstanceOf(Date),
 *  >>> Mon Jun 06 2022 03:33:33 GMT+0000 (London Standard Time)
 *
 * @type {(T) => T}
 */
type.InstanceOf = PropTypes.instanceOf

/**
 * Array of values.
 * @example:
 *  type.ListOf(type.Number)
 *  >>> number[]
 *
 * @type {(T) => T[]}
 */
type.ListOf = PropTypes.arrayOf

/**
 * Map of `key -> value` pairs, where `key` and `value` correspond to given `type`
 * @example:
 *  type.MapOf(new Map([
 *    [type.String, type.Number],
 *    [type.Number, type.Boolean],
 *  ])),
 *  >>> Map {'string': number, 4: boolean,...}
 */
type.MapOf = PropTypes.objectOf

/**
 * One of given types.
 * @example:
 *  type.OneOf([type.String, type.Number])
 *  >>> string | number
 *
 * @type {(...args: unknown[]) => typeof args[number]}
 */
type.OneOf = PropTypes.oneOfType

/**
 * Object containing a particular shape (`key -> value` pairs).
 * @example:
 *  type.Obj({
 *    key: type.Number
 *  })
 *  >>> {key: number}
 * @param {object} obj - the object shape with value being the type (e.g. `type.Number`)
 * @returns {function} type checker
 */
type.Obj = PropTypes.shape

/**
 * Object with the exact shape (`key -> value` pairs). Extra properties will raise warnings.
 * @example:
 *  type.ObjEqual({
 *    key: type.Number
 *  })
 *  >>> {key: number}
 *  >>> Warning {key: number, other: number} has extra property `other`
 */
type.ObjEqual = PropTypes.exact

/**
 * Object of `key -> value` pairs, where `key` is dynamic, and `value` is of given `type`
 * @example:
 *  type.ObjectOf(type.Number)
 *  >>> {key1: number, key2: number,...}
 */
type.ObjectOf = PropTypes.objectOf

// This can be used to make type creators automatically attach input controls for nested types
if (typeof defineCreator === 'function') defineCreator(type)

/**
 * Base Types --------------------------------------------------------------------------------------
 */

// Any value type
type.Any = PropTypes.any

/**
 * Big Integer value
 * @type {bigint}
 */
type.BigInt = PropTypes.number

/**
 * True or False value
 * @type {boolean}
 */
type.Boolean = PropTypes.bool

/**
 * Floating point number
 * @type {number}
 */
type.Float = PropTypes.number

/**
 * Function or Class method
 * @example:
 *  type.Function([
 *    type.Obj({
 *      // Whether the corresponding ExpandPanel is expanded
 *      open: type.Boolean,
 *    }),
 *  ], type.Node),
 *
 * @type {Function}
 */
type.Function = PropTypes.func

/**
 * React JSX element (eg. `<View/>`)
 * @type {JSX.Element}
 */
type.JSXElement = PropTypes.element

/**
 * React JSX element type (eg. `View`)
 * @type {ElementType}
 */
type.JSXElementType = PropTypes.elementType

/**
 * A whole number value
 * @type {number}
 */
type.Integer = PropTypes.number

/**
 * Array value
 * @type {array}
 */
type.List = PropTypes.array

// Map value
type.Map = PropTypes.object

/**
 * A `string`, `number`, `boolean`, `null`, `undefined`,
 * element or an array (or fragment) of elements (ie. `[type.JSXElement]`) that can be rendered.
 * @type {React.ReactNode}
 */
type.Node = PropTypes.node

/**
 * Number value (Integer or Float)
 * @type {number}
 */
type.Number = PropTypes.number

/**
 * Object value (eg. `{}`)
 * @type {object}
 */
type.Object = PropTypes.object

/**
 * A single type from React Component.propTypes object (eg. `type.Number`)
 * @type {Function}
 */
type.PropType = PropTypes.func

/**
 * Text value
 * @type {string}
 */
type.String = PropTypes.string

// String object (eg. `new String(value)`)
type.StringObject = PropTypes.object

// Javascript getter function (eg. `{get () {return ''}}`)
type.StringGetter = PropTypes.string

/**
 * Symbol value
 * @type {symbol}
 */
type.Symbol = PropTypes.symbol

/**
 * A positive whole number
 * @type {number}
 */
type.UnsignedInteger = PropTypes.number

/**
 * A dynamic type that can be any of the existing type in the project
 * @type {?}
 */
type.Unknown = PropTypes.any

// This can be used to attach input controls or custom validators to types defined above
if (typeof defineBase === 'function') defineBase(type)

/**
 * Common Types ------------------------------------------------------------------------------------
 */

// Base64 encoded string
type.Base64 = type.String

// Data size number equivalent to 8 Bits
type.Byte = type.UnsignedInteger

/**
 * CSS class names string, separated by space
 */
type.ClassName = type.String

// CSS length string, such as `10%`, `2em`, etc.
type.CSSLength = type.String

// Object or Array value
type.Collection = type.OneOf([type.Object, type.List])

// Any valid CSS color string, such as `red`, `rgb(0,0,0)`, `hsla(22, 7%, 6%, 1)`, `var(--color)`...
type.Color = type.String

// Precision decimal points number
type.Decimal = type.UnsignedInteger

// Rotation degree number
type.Degree = type.Number

// HTMLElement or native app Node Element object
type.Element = type.Obj({
  getBoundingClientRect: type.Function.isRequired,
})

// A fraction number in string format (eg. '1/2', '8/5', etc.)
type.Fraction = type.String

// One of `withForm()` HOC or `useForm` hook value getters
type.FormValueType = type.Enum(['changedValues', 'registeredValues', 'formValues'])

// Icon file name string (without file extension) relative to icons directory (ex. 'wf/search')
type.Icon = type.String

// Unique identifier string
type.Id = type.String

// Time duration number which is 1/1000th of a second
type.Millisecond = type.UnsignedInteger

// File MIME type string
type.MIME = type.String

// Millimeter unit number for measuring length
type.Mm = type.Number

// A floating number that is to be multiplied with
type.Multiplier = type.Number

/**
 * Anything that can be rendered: number, string, element, fragment, an array,
 * or function returning one of these types (to be called by `renderProp` function).
 * @type {ReactNode|((self: object) => ReactNode)}
 */
type.NodeOrFunction = type.OneOf([
  type.Node,
  type.Function,
])

// A float number between 0 and 1 inclusive (to be used with slider).
// For values outside the 0 and 1 range, use **type.Percentage**
type.Percent = type.Float

// Percentage number, where `1% = 0.01`, `200% = 2`, etc.
type.Percentage = type.Number

// File path string, or string object with paths for different sizes/versions of the same file
type.Preview = type.OneOf([type.String, type.StringObject])

// Javascript Promise object
type.Promise = type.Obj({
  then: type.Function.isRequired,
  catch: type.Function.isRequired,
})

// React Component.propTypes object
type.PropTypes = type.ObjectOf(type.PropType)

// Pixel unit number to represent a display dimension or location
// (uses Integer type to ensure valid numbers for use as Image dimension).
type.Px = type.Integer

// Component CSS class modifier (eg. 'spacer-large')
type.SizeModifier = type.Enum(['smallest', 'smaller', 'small', 'base', 'large', 'larger', 'largest'])

// UNIX Timestamp number in milliseconds
type.Timestamp = type.UnsignedInteger

// Uniform Resource Locator string
type.Url = type.String

// This can be used to attach input controls or custom validators to types defined above
if (typeof defineCommon === 'function') defineCommon(type)

/**
 * Extended Types ----------------------------------------------------------------------------------
 */

// CSS length string or Pixel number
type.CSSLengthOrPx = type.OneOf([type.CSSLength, type.Px])

// Localised definition object (example: `LANGUAGE.ENGLISH`)
type.Definition = type.Obj({
  // Internal value that is language agnostic
  _: type.Any.isRequired,
  // Displayed name string getter for the currently active Language
  name: type.StringGetter.isRequired,
  // Displayed name string in English (where `en` is an ISO 639-1 code)
  en: type.String,
  // 'ru': other displayed name strings by their language ISO 639-1 code
})

// Set of localised definitions object (example: `LANGUAGE`)
type.DefinitionMap = type.ObjectOf(type.Definition.isRequired)

// File object https://developer.mozilla.org/en-US/docs/Web/API/File
type.File = type.Obj({
  // File name with extension
  name: type.String.isRequired,
  // File size in bytes
  size: type.Byte.isRequired,
  // MIME type
  type: type.MIME.isRequired,
})

// Select option value
type.Option = type.OneOf([
  type.String,
  type.Number,
  type.Boolean,
  type.Obj({
    // Internal option value to store as selected value.
    // Since PropTypes.isRequired cannot be `null` (hardcoded logic),
    // `value` as `null` will throw error in development mode.
    // => just ignore this, because PropTypes does not run in production.
    //    and Select component logic checks using `value !== void 0`, which allows `null` as value.
    // `null` value is commonly used for an all-encompassing option, such as 'Any' option.
    value: type.Any.isRequired,
    // Searchable text as displayed label if `children` not defined (derived from `value` if undefined)
    text: type.String,
    // Required by React if String(value) does not result in unique `key` (derived from `value` if undefined)
    key: type.Any,
    // Option's displayed UI
    children: type.NodeOrFunction,
    // ...other props to pass to `<SelectOption/>`
  }),
])

// Select options array of option values
type.Options = type.ListOf(type.Option)

// Object `{current?: Element}` created by React.useRef() or React.createRef()
type.RefObject = type.Obj({current: type.Element})

// `Function(node) => void` or the Object created by React.useRef() or React.createRef()
type.Ref = type.OneOf([type.Function, type.RefObject])

// File source URL or directory path
type.Src = type.OneOf([type.Url, type.String])

// CSS style object with camelCase attribute keys
type.Style = type.ObjectOf(type.OneOf([
  type.CSSLength,
  type.Color,
  type.Px,
]))

// File `src` string in flexible data format
type.UrlOrBase64OrPreview = type.OneOf([type.Url, type.Base64, type.Preview])

// This can be used to attach input controls or custom validators to types defined above
if (typeof defineExtended === 'function') defineExtended(type)

/**
 * Component Types ---------------------------------------------------------------------------------
 */

// Input Control config object
type.Control = type.Obj({
  /**
   * One of `<Input/>` types (eg. 'text', 'slider', etc.), default is 'text'; or an:
   *  - array of type.Control for `type.ListOf`
   *  - object of type.Control for `type.Obj`
   *  - map of type.Control for `type.ObjectOf`, `type.MapOf`.
   *
   * Note: type.OneOf is like a regular control config object with multiple `controls`
   *
   * @example:
   *  // type.ListOf(type.Number)
   *  {
   *    type: [type.Number],
   *    maxInputs: 9, // limit the list to 9 items
   *  }
   *
   *  // type.ListOf(type.OneOf([type.Number, type.String]))
   *  {
   *    type: [type.Number, type.String],
   *    mixedTypes: true, // allow the list to have both numbers and strings
   *  }
   *
   *  // type.Obj({key1: type.Number, key2: type.String})
   *  {
   *    type: {
   *      key1: type.Number,
   *      key2: type.String,
   *    },
   *  }
   *
   *  // type.ObjectOf(type.Number)
   *  {
   *    type: new Map([
   *      [type.String, type.Number],
   *    ]),
   *  }
   *
   *  // type.MapOf(new Map([[type.String, type.Number], [type.Number, type.Boolean]]))
   *  {
   *    type: new Map([
   *      [type.String, type.Number],
   *      [type.Number, type.Boolean],
   *    ]),
   *  }
   */
  type: type.OneOf([
    type.String,
    // Recursive definition
    type.ObjectOf(type.OneOf([type.PropType, type.Object])),
    type.ListOf(type.OneOf([type.PropType, type.Object])),
    type.Map,
  ]).isRequired,
  // Unique identifier for the base type (eg. Symbol.for('String') for type.Url),
  '#_type': type.Symbol,
  // Unique identifier for the type (eg. Symbol.for('Url') for type.Url), fallback is `#_type` if undefined
  '#type': type.Symbol,
  // Searchable human-readable label for the input type (required if `type` is a string)
  '#text': type.String,
  // Brief explanation of the input type (supports Markdown)
  '#desc': type.NodeOrFunction,
  /**
   * CSS color value (eg. 'rgba(0,0,0,1)', 'linear-gradient(to bottom, white, black)', etc.),
   * of Function(value, name, control) => string | undefined - that returns color value
   */
  '#color': type.OneOf([type.String, type.Function]),
  // Function(value) => boolean | number - function to check if value belongs to this control type.
  // Return `true` to indicate a match, or number of matches for type.Obj/ObjEqual for sorting
  '#ofType': type.Function.isRequired,
  // Maximum number of control items in the list (for type.ListOf/ObjectOf/MapOf)
  '#maxInputs': type.Number,
  // Whether to allow mixing item types (when `type` is a list of controls)
  '#mixedTypes': type.Boolean,
  // ...other props to pass to `<Input/>` component
})

// type.PropType with controls attached
type.ControlType = type.Obj({
  controls: type.ListOf(type.Control),
  controlOptions: type.Options,
})

type.ControlTypes = type.OneOf([
  type.ListOf(type.ControlType),
  type.ObjectOf(type.ControlType),
])

// File Input object
type.FileInput = type.Obj({
  // File path, source URL, Base64 encoded data, or Preview string/object
  src: type.UrlOrBase64OrPreview,
  // Type of file (ex: public/private...)
  kind: type.Any,
  // Identifier or index position of the file in the grid (ex. thumb/small/large/0/1...)
  i: type.Any,
  // Optional ID
  id: type.Id,
  // File name with extension
  name: type.String,
  // Selected File object to send to backend for upload (example: Upload input file object)
  file: type.File,
  // Flag to delete the file from backend
  remove: type.Boolean,
  // Optional dimension in Pixels
  width: type.Px,
  // Optional dimension in Pixels
  height: type.Px,
  // Optional size in Bytes
  size: type.Byte,
  // Available file sizes (i.e. ImageInput)
  sizes: type.ListOf(type.Obj({
    // resKey (ex. 'thumb', 'medium', '')
    key: type.String,
    // Size in bytes
    val: type.Byte,
  })),
})

// FIELD definition object - see `@webframer/kit/variables/fields.js`
type.Field = type.Obj({
  // FIELD.ID base definition identifier
  ID: type.String,
  // FIELD.VIEW identifier
  VIEW: type.String,
  // Nested FIELD definitions
  FIELDS: type.ListOf(type.Object),
})

// Example: FIELD.FOR.CONTACT definitions
type.FieldForList = type.ListOf(type.Field)

// Tag entry object
type.Tag = type.Obj({
  id: type.Id.isRequired,
  name: type.String.isRequired, // may be retrieved dynamically with translation
})

// List of Tag ID strings
type.TagIds = type.ListOf(type.Id.isRequired)
type.TagById = type.ObjectOf(type.Tag.isRequired)
type.TagOptions = type.Options

// Tooltip open/close on events
const tooltipOnEnum = type.Enum(['click', 'focus', 'hover'])

/**
 * Tooltip propTypes declaration.
 * For the compiler to parse this automatically,
 * the declared variable name must be: `Component.name` + 'PropTypes'.
 * The same applies to defaultProps: `Component.name` + 'DefaultProps'.
 */
export const TooltipPropTypes = {
  // Tooltip content
  children: type.NodeOrFunction.isRequired,
  // One of, or any combination of `['click', 'focus', 'hover']`
  on: type.OneOf([tooltipOnEnum, type.ListOf(tooltipOnEnum)]),
  // Location of the Tooltip relative to the parent element
  position: type.Enum(['top', 'right', 'bottom', 'left']),
  /**
   * Tooltip alignment relative to the `position`, default is center/middle alignment.
   * ```
   * For position 'top'/'bottom':
   *    'start' is left
   *    'end' is right
   *
   * For position 'left'/'right':
   *    'start' is top
   *    'end' is bottom
   * ```
   */
  align: type.Enum(['start', 'end']),
  // Animation CSS class to apply
  animation: type.String,
  // Popup delay duration in milliseconds
  delay: type.Millisecond,
  // Whether to render Tooltip as child element of the parent Node, by default it renders as Portal
  embedded: type.Boolean,
  // Tooltip pointer offset from the parent element, default is `16`
  offset: type.Px,
  // Whether to show Tooltip initially
  openInitially: type.Boolean,
  // Handler(event, self: object) => void - before Tooltip opens
  onOpen: type.Function,
  // Handler(event, self: object) => void - before Tooltip closes
  onClose: type.Function,
  // Callback(self: object) => void - when Tooltip container has mounted
  onMount: type.Function,
  // Name of the theme mode to apply - must be one of the available theme styles.
  // Example: `inverted`, `light`, `dark`, `glass`, etc.
  theme: type.String,
  // Class name for the Tooltip container
  tooltipClass: type.ClassName,
}
// Tooltip props (or content to display as tooltip) on interaction with this component
type.Tooltip = type.OneOf([type.NodeOrFunction, type.Obj(TooltipPropTypes)])

// Generic Component props
type.Props = type.Obj({
  className: type.ClassName,
  style: type.Style,
})

// This can be used to attach input controls or custom validators to types defined above
if (typeof defineComponent === 'function') defineComponent(type)

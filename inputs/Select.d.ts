/// Generated by Webframe.app | Do not edit this file directly! \\\
import { type } from '../types';
export interface SelectProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Selectable values
   */
  options: Array<string | number | boolean | {
    value: any;
    text?: string;
    key?: any;
    children?: string | number | boolean | Function;
  }>;
  /**
   * Individual option props to pass
   */
  optionProps?: object;
  /**
   * Options container props to pass
   */
  optionsProps?: object;
  /**
   * Handler(event, value: any, name?, self) when selected value changes
   */
  onChange?: Function;
  /**
   * Handler(event, value: any, name?: string, self) on select focus
   */
  onFocus?: Function;
  /**
   * Handler(event, value: any, name?: string, self) on select blur
   */
  onBlur?: Function;
  /**
   * Handler(event, value: any, name?: string, self) on input removal.
   * 
   * `onChange` handler will fire after with `null` as value, unless event.preventDefault().
   * 
   * To let `onChange` update form instance first before removing the field,
   * 
   * use setTimeout to execute code inside `onRemove` handler.
   */
  onRemove?: Function;
  /**
   * Handler(event, query: string, name?, self) when search input value changes
   */
  onSearch?: Function;
  /**
   * Handler(event, value: any, name?, self) when an option gets focus
   */
  onSelect?: Function;
  /**
   * Handler(event, value: any, name?, self) when a multiple selected value is clicked
   */
  onClickValue?: Function;
  /**
   * Handler(self: object) when this component has mounted
   */
  onMount?: Function;
  /**
   * Whether to allow users to add new options (in combination with search)
   * Set to `true` to allow adding new term.
   * Set to `object` of props to pass to new `option` object when selected.
   * Set to `function(query: string) => boolean | object` for conditional logic.
   */
  addOption?: boolean | object | Function;
  /**
   * Whether to use minimal width that fits content, pass number for additional character offset
   */
  compact?: boolean | number;
  /**
   * Whether to lock selected value when `value` prop is given
   */
  controlledValue?: boolean;
  /**
   * Whether to open options initially
   */
  openInitially?: boolean;
  /**
   * Whether to filter out selected value from options dropdown
   */
  excludeSelected?: boolean;
  /**
   * Function(value, name?, self) => any - Serializer for internal Select state value
   */
  format?: Function;
  /**
   * Function(value, name?, self, event) => any - Deserializer for onChange/onBlur/onFocus value
   * 
   * Select always stores the `value` or `value[]` internally for its logic, like fuzzy search
   */
  parse?: Function;
  /**
   * Function(query, name?, self, event) => string - search query normalizer to sanitize user input
   */
  normalize?: Function;
  /**
   * Whether to always render options, even when closed
   */
  forceRender?: boolean;
  /**
   * Custom Icon name or props to render before input node.
   * 
   * Default is 'dropdown' icon at the end, or 'search' icon at the start if `search = true`
   * 
   * and icons are undefined or null.
   */
  icon?: string | boolean | object | number | Function;
  /**
   * Custom Icon name or props to render after input node
   */
  iconEnd?: string | boolean | object | number | Function;
  /**
   * Whether to allow multiple selections and store values as array
   */
  multiple?: boolean;
  /**
   * Whether to set options with position fixed on open to remain visible inside Scroll
   */
  fixed?: boolean;
  /**
   * Default search query to use
   */
  query?: string;
  /**
   * Function(query) => string - parse function for internal query string used for search
   */
  queryParser?: Function;
  /**
   * Whether to enable search by options, pass Handler(query, options) => value for custom search
   */
  search?: boolean | Function;
  /**
   * Unique ID to trigger search options re-indexing
   */
  searchNonce?: any;
  /**
   * Fuzzy [search options](https://fusejs.io/api/options.html)
   */
  searchOptions?: {
    distance?: type.Integer;
    threshold?: type.Percent;
    useExtendedSearch?: boolean;
  };
  /**
   * Whether options menu should try to open from the top, default is from the bottom
   */
  upward?: boolean;
  /**
   * Selected value(s) - if passed, becomes a controlled component
   */
  value?: any;
  /**
   * Function(value: any, index: number, array, self) => JSX - to render selected option.
   * 
   * Currently only works for `multiple` selections.
   */
  renderSelected?: Function;
  /**
   * Message string to display when there are no options left for multiple select, or
   * 
   * Handler(self) => string - function to render message dynamically (example: using query)
   */
  noOptionsMsg?: string | number | boolean | Function;
  /**
   * Minimum number of Select options to use Virtual List renderer to optimize for performance
   */
  virtualOptionsMinimum?: type.UnsignedInteger;
}
/**
 * Dropdown List of Searchable Select Options and Nested Category Hierarchy.
 * @see https://webframe.app/docs/ui/inputs/Select
 * Features:
 *    1. Select (with options like `<select/>` element)
 *    2. Multiple select
 *    3. Search select (+ multiple)
 *    4. Customisable fuzzy search with cached indexing for large collections
 *    5. Infinite scroll with fast rendering using `<VirtualList/>`
 *    6. Group options by category, or render any custom UI via `optionsProps`
 *    7. Overlay options when inside overflow-hidden parent with `fixed={true}`
 *    8. Editable selected options with custom `renderSelected` function using `<InputView/>`
 *    9. Supports all features of `<InputNative/>`
 *    10. Keyboard friendly (arrows to move, `Enter` to select/open, `Escape` to close, `Tab` to blur)
 *    11. todo: improvement - Copy/Paste selected options via keyboard, like native input.
 *
 * Usage:
 *    - To keep Select open while interacting with content inside dropdown:
 *      1. Set the container of interactive content with `onClick: onEventStopPropagation()`
 *      2. Set `onBlur: (e) => e.preventDefault()` with your custom logic.
 *
 * Notes:
 *    - `compact` true sets input to dynamic character width, and increases when options open.
 *    - Options use position `absolute` initially, even when `fixed` is set to true,
 *      to remain visible inside overflow hidden Scroll
 *      => `.select__options` class must have `max-height` set to explicit unit, such as `px`
 *    - There are use cases when Select is used to concatenate string value from array.
 *      The parse function will convert array into a single string,
 *      But Select will need to split the string back to array value for internal state,
 *      possibly including mapping to the actual values.
 *      Select.value should always point to the source of truth,
 *      which in this case is a concatenated string, not array.
 *      But that complicates its internal logic.
 *      => What we need instead, is a serializer that
 *         converts form.values to individual input type value for each UI component.
 *         This way backend can store a different value format from UI internal state.
 *         @see https://www.django-rest-framework.org/api-guide/serializers/
 *
 * @example:
 *    // Format backend data to frontend value
 *    <Select format={(v) => v.split(' ')} />
 *    // which is equivalent to
 *    serialize('row reverse')
 *    >>> ['row', 'reverse']
 *
 *    // Parse frontend value to backend data
 *    <Select parse={(v) => v.join(' ')} />
 *    // which is equivalent to
 *    deserialize(['row', 'reverse'])
 *    >>> 'row reverse'
 */
export function Select(props: SelectProps): JSX.Element;

/**
 * Convert list of values to Select options, each as objects.
 * @note: does not work for symbols with the same string, because `key` is no longer unique
 * @param {any[]} arrayOfValues - to convert to options
 * @returns {object[]} options - for Select dropdown with values converted to text representation
 */
export function toSelectOptions(arrayOfValues: any[]): object[];
export default SelectMemo;
declare const SelectMemo: React.NamedExoticComponent<SelectProps>;
import * as React from 'react';

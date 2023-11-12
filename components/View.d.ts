/// Generated by Webframe.app | Do not edit this file directly! \\\
import { type } from '../types';
/**
 * Create a React View - Pure Component.
 * @param {string} [defaultProp] - the prop to make true by default
 * @returns {((props: ViewProps) => JSX.Element)[]} list of View function components
 */
export function createView(defaultProp?: string | undefined): ((props: ViewProps) => JSX.Element)[];
/**
 * Extract key->value pairs from `props` object by mutation, returning new object of extracted keys
 * as defined in `propTypes`.
 *
 * @example:
 *    function Component ({...props}) {
 *      return (
 *        <View {...extractProps(props)}>
 *          // The `props` now has View.jsx props removed
 *          <OtherComponent {...props}/>
 *        </View>
 *      )
 *    }
 *
 * @param {object} props - original Component props
 * @param {object} [keys] - object keys config:
 *    - keys with `false` values are skipped (left in `props`),
 *    - keys with `null` values are deleted from `props` without inclusion in the `result` object,
 *    - `undefined` keys or keys with `true` values are deleted from `props` and assigned to `result`
 * @param {object} [propTypes] - Component.propTypes definition to extract props for
 * @returns {object} result - props to use with Component.jsx, with keys removed from the original `props`
 */
export function extractProps(props: object, keys?: object | undefined, propTypes?: object | undefined): object;
/**
 * Check whether given Node element contains a Scroll component by its className
 * @param {Element} parentElement - element to check
 * @param {Element} [scrollElement] - the node to exclude from check
 * @param {string} [className] - to identify the Scroll component
 * @returns {boolean} true - if node contains at least once Scroll component
 */
export function hasScrollElement(parentElement: Element, scrollElement?: Element | undefined, className?: string | undefined): boolean;
/**
 * Set CSS max-height/width offset style for direct Parent element of a flex Scroll component
 * to prevent clipping of content when Scroll overflows the Parent.
 * @param {Element} parentElement - direct parent node to offset scroll
 * @param {string|boolean} [side] - one of 'height' or 'width' (or `true` for both) to offset
 * @param {string} [className] - to identify the Scroll component
 * @param {string} [attr] - attribute key to store the original parentElement.style for reset later
 * @returns {string|void} attribute - modified style attribute that was attached to parentElement
 */
export function maxSizeScrollOffset(parentElement: Element, side?: string | boolean | undefined, className?: string | undefined, attr?: string | undefined): string | void;
export interface ViewProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * CSS class names string, separated by space
   */
  className?: string;
  /**
   * CSS style object with camelCase attribute keys
   */
  style?: unknown;
  /**
   * Whether to use vertical (i.e. column) layout. By default, it is `true` if `row` prop is falsy
   */
  col?: boolean;
  /**
   * Whether to use horizontal layout. By default, it is falsy
   */
  row?: boolean;
  /**
   * Whether to use grid layout, instead of the default `col`/`row` flex layout
   */
  grid?: boolean;
  /**
   * Whether to make the view fill up available height and width
   */
  fill?: boolean;
  /**
   * Whether to reverse the render order of inner content items
   */
  reverse?: boolean;
  /**
   * Whether to use right to left text, layout, and scroll direction
   */
  rtl?: boolean;
  /**
   * Align inner content to the start
   */
  left?: boolean;
  /**
   * Align inner content to the end
   */
  right?: boolean;
  /**
   * Align inner content to the top
   */
  top?: boolean;
  /**
   * Align inner content to the bottom
   */
  bottom?: boolean;
  /**
   * Align inner content to the center horizontally
   */
  center?: boolean;
  /**
   * Align inner content to the middle vertically
   */
  middle?: boolean;
  /**
   * @param {object|HTMLAudioElement} new Audio(URL) sound file to play on click
   */
  sound?: object;
  /**
   * Inner content to render
   */
  children?: string | number | boolean | Function;
  /**
   * Custom UI to render before `children` in Scroll mode (outside inner Scroll component)
   */
  childBefore?: string | number | boolean | Function;
  /**
   * Custom UI to render after `children` in Scroll mode (outside inner Scroll component)
   */
  childAfter?: string | number | boolean | Function;
  /**
   * Whether to prevent components from setting size offset for this component.
   * This can prevent bugs caused by children Scroll components with `scrollOffset` enabled.
   */
  preventOffset?: boolean;
  /**
   * Tooltip props (or content) to display as popup on interaction with this component
   */
  tooltip?: string | number | boolean | Function | {
    children: string | number | boolean | Function;
    on?: 'click' | 'focus' | 'hover' | Array<'click' | 'focus' | 'hover'>;
    position?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'end';
    animation?: string;
    delay?: type.Millisecond;
    embedded?: boolean;
    offset?: type.Px;
    openInitially?: boolean;
    onOpen?: Function;
    onClose?: Function;
    onMount?: Function;
    theme?: string;
    /**
     * CSS class names separated by space
     */
    tooltipClass?: string;
  };
  /**
   * Whether to enable `scroll` mode so that overflow content is scrollable.
   * Note: because of browser quirks related to flex layout, this mode adds an extra
   * inner scroll `div` element that wraps `children` content.
   */
  scroll?: boolean;
  /**
   * Whether to restrict scrolling along the layout direction.
   * 
   * Scrollable in all directions by default.
   */
  scrollAlongDirectionOnly?: boolean;
  /**
   * CSS class for inner wrapper Scroll component
   */
  scrollClass?: string;
  /**
   * CSS style for inner wrapper Scroll component
   */
  scrollStyle?: unknown;
  /**
   * Props for the inner Scroll component
   */
  scrollProps?: object;
  /**
   * Whether to allow `Scroll` element to set offset style to its parent element.
   * The Scroll component may set `max-width` or `max-height` style to the parent
   * element in order for it to calculate the maximum available space correctly.
   * Sometimes, this behavior leads to false positives, and needs to be disabled.
   */
  scrollOffset?: boolean | 'height' | 'width';
  /**
   * Props for outer Scroll `div` when content overflows in given direction, set to `false` to disable
   */
  scrollOverflowProps?: {
    top?: {
      /**
       * CSS class names separated by space
       */
      className?: string;
    };
    bottom?: {
      /**
       * CSS class names separated by space
       */
      className?: string;
    };
    left?: {
      /**
       * CSS class names separated by space
       */
      className?: string;
    };
    right?: {
      /**
       * CSS class names separated by space
       */
      className?: string;
    };
  } | boolean;
  /**
   * When `true`:
   * - For column layout - left scrollbar
   * - For row layout - reverses scroll direction.
   * 
   * Here is how it works when enabled:
   * - for LTR direction it uses right to left scroll direction and place the scrollbar on the left.
   * - If `rtl` is true, the scroll direction is left to right and the scrollbar is on the right.
   * 
   * To achieve left scrollbar without changing horizontal scroll direction,
   * restrict this `Scroll` component to allow only vertical scroll,
   * then create a nested Scroll component that can only scroll horizontally.
   * @example:
   * <Scroll rtl={rtl} scrollReversed scrollAlongDirectionOnly>
   * <Scroll row scrollAlongDirectionOnly>...</Scroll>
   * </Scroll>
   */
  scrollReversed?: boolean;
  /**
   * Ref for the inner Scroll component
   */
  scrollRef?: Function | {
    current?: {
      getBoundingClientRect: Function;
    };
  };
  /**
   * Ref for the View or outer Scroll container
   */
  _ref?: Function | {
    current?: {
      getBoundingClientRect: Function;
    };
  };
}
export function View(props: ViewProps): JSX.Element;
export default ViewMemo;
export namespace overflowScrollProps {
    namespace top {
        let className: string;
    }
    namespace bottom {
        let className_1: string;
        export { className_1 as className };
    }
    namespace left {
        let className_2: string;
        export { className_2 as className };
    }
    namespace right {
        let className_3: string;
        export { className_3 as className };
    }
}
declare const ViewMemo: React.NamedExoticComponent<ViewProps>;
import * as React from 'react';
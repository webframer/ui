/// Generated by Webframe.app | Do not edit this file directly! \\\
import { type } from '../types';
export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The text content
   */
  children?: string | number | boolean | Function;
  /**
   * CSS class names separated by space
   */
  className?: string;
  style?: unknown;
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
  _ref?: Function | {
    current?: {
      getBoundingClientRect: Function;
    };
  };
}
/**
 * Text View - Pure Component
 * (to be used as replacement for `<span></span>` for cross platform integration).
 * @see https://webframe.app/docs/ui/components/Text
 */
export function Text(props: TextProps): JSX.Element;

export default TextMemo;
declare const TextMemo: React.NamedExoticComponent<TextProps>;
import * as React from 'react';

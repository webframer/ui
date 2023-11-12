/// Generated by Webframe.app | Do not edit this file directly! \\\
import { type } from '../types';
export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Button content
   */
  children: string | number | boolean | Function;
  /**
   * CSS class names separated by space
   */
  className?: string;
  style?: unknown;
  /**
   * Whether to add `active` css class
   */
  active?: boolean;
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Whether to show loading state
   */
  loading?: boolean;
  /**
   * Button type
   */
  type?: 'button' | 'submit';
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
 * Button - Pure Component
 * @see https://webframe.app/docs/ui/components/Button
 */
export function Button(props: ButtonProps): JSX.Element;

export default ButtonMemo;
declare const ButtonMemo: React.NamedExoticComponent<ButtonProps>;
import * as React from 'react';

/// Generated by Webframe.app | Do not edit this file directly! \\\
export interface LoaderProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Whether to show this Component or not
   */
  loading?: boolean;
  /**
   * Optional loading text or custom UI to render as loading indicator
   */
  children?: string | number | boolean | Function;
  /**
   * Loading icon size (ie. the spinner)
   */
  size?: 'smallest' | 'smaller' | 'small' | 'base' | 'large' | 'larger' | 'largest';
  /**
   * Class name for the loading icon
   */
  iconClass?: string;
  /**
   * CSS class names as string, separated by space
   */
  className?: string;
  style?: unknown;
}
/**
 * Loading Overlay - Pure Component.
 * @see https://webframe.app/docs/ui/components/Loader
 */
export function Loader(props: LoaderProps): any;

export default LoaderMemo;
declare const LoaderMemo: React.NamedExoticComponent<LoaderProps>;
import * as React from 'react';

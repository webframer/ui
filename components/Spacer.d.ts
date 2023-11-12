/// Generated by Webframe.app | Do not edit this file directly! \\\
export interface SpacerProps extends React.HTMLAttributes<HTMLElement> {
  size?: 'smallest' | 'smaller' | 'small' | 'base' | 'large' | 'larger' | 'largest';
  /**
   * CSS class names separated by space
   */
  className?: string;
  style?: unknown;
}
/**
 * Spacer - Pure Component
 * @see https://webframe.app/docs/ui/components/Spacer
 *
 * @param {{
 *    className?: string,
 *    size?: string,
 *    [p: string]: any,
 * }} p
 * @returns {JSX.Element}
 */
export function Spacer(props: SpacerProps): JSX.Element;

export default SpacerMemo;
declare const SpacerMemo: React.NamedExoticComponent<SpacerProps>;
import * as React from 'react';

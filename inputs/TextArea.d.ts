/// Generated by Webframe.app | Do not edit this file directly! \\\
export interface TextAreaProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Whether to use minimal width that fits content, pass a number for additional character offset
   */
  compact?: boolean | number;
  /**
   * Initial value for uncontrolled state
   */
  defaultValue?: any;
  /**
   * Internal value for controlled state
   */
  value?: any;
  /**
   * Handler(event, value: any, name?: string, self) on textarea value changes
   */
  onChange?: Function;
  /**
   * Handler(event, value: any, name?: string, self) on textarea focus
   */
  onFocus?: Function;
  /**
   * Handler(event, value: any, name?: string, self) on textarea blur
   */
  onBlur?: Function;
  /**
   * Handler(event, value: any, name?: string, self) on textarea removal.
   * `onChange` handler will fire after with `null` as value, unless event.preventDefault().
   * To let `onChange` update form instance first before removing the field,
   * use setTimeout to execute code inside `onRemove` handler.
   */
  onRemove?: Function;
  /**
   * Label to show before the textarea (or after with `reverse` true)
   */
  label?: string | number | boolean | Function;
  /**
   * Whether textarea is loading
   */
  loading?: boolean;
  /**
   * Function(value, name?, event?, self) => string - value formatter for UI display
   */
  format?: Function;
  /**
   * Function(value, name?, event, self) => any - Parser for internal value for onChange
   */
  parse?: Function;
  /**
   * Whether to automatically resize height style to fit content
   */
  resize?: boolean;
  /**
   * Whether to disable spell check and autocorrection
   */
  noSpellCheck?: boolean;
  /**
   * Custom UI to render before textarea node (inside .textarea wrapper with focus state)
   */
  childBefore?: string | number | boolean | Function;
  /**
   * Custom UI to render after textarea node (inside .textarea wrapper with focus state)
   */
  childAfter?: string | number | boolean | Function;
  /**
   * Custom Icon name or props to render before textarea node
   */
  icon?: string | object;
  /**
   * Custom Icon name or props to render after textarea node (if `onRemove` not defined)
   */
  iconEnd?: string | object;
}
/**
 * Wrapper for Native HTML `<textarea>`.
 * @see https://webframe.app/docs/ui/inputs/TextArea
 *
 * Features:
 *  - Label added before textarea
 *  - Icon at the start or end of textarea
 *  - Loading state (with spinner icon and temporarily readonly textarea)
 *  - Controlled or uncontrolled textarea value state
 *  - Compact textarea with automatic width adjustment
 *  - Resize textarea with automatic height adjustment
 *  - onRemove handler for removing the input field
 */
export function TextArea(props: TextAreaProps): JSX.Element;

export default TextAreaMemo;
declare const TextAreaMemo: React.NamedExoticComponent<TextAreaProps>;
import * as React from 'react';

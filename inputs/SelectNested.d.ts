/// Generated by Webframe.app | Do not edit this file directly! \\\
export interface SelectNestedProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Icon indicator for nested collections
   */
  nestedIcon?: string;
  /**
   * Any object or array, or a deeply nested collection of `type.Option`
   */
  options: Array<unknown> | Array<string | number | boolean | {
    value: any;
    text?: string;
    key?: any;
    children?: string | number | boolean | Function;
  }> | object;
  /**
   * Function(key: string, keyPath: string[], self) => string - to format key path for display
   */
  formatKey?: Function;
  /**
   * Function(value: any, key: string, keyPath: string[], self) => boolean - true to render value, false to skip
   */
  filterValue?: Function;
}
/**
 * Nested Dropdown Selection, where `options` is a deeply nested collection (object or array),
 * and `value` is the selected key path (by default) or value (if `select='value'`).
 *
 * Logic:
 *  - Value is the entire selected path
 *  - The first selection level uses multiple Select, then NestedDropdown for the rest
 *  - When nested option is clicked, set it as multiple value inside Select
 *  - Each selected sub-path can have its own nested dropdowns
 *  - on select option, close all dropdowns, because Tooltip does not close when clicking inside itself
 *  - on='hover' Tooltip works well because loosing hover state only closes the last dropdown.
 *    => This is the desired UX because typically multilevel dropdowns would close everything,
 *       forcing the user to do it all over again, which is bad user experience.
 *  - todo: component onChange, onBlur, onFocus, format, parse, normalize handlers
 *  - todo: component keyboard accessibility - arrow up/down to navigate Dropdown options, Escape to exit, Enter to select
 */
export function SelectNested(props: SelectNestedProps): JSX.Element;

export default SelectNestedMemo;
export const selectNestedTooltipProps: {
    embedded: boolean;
    className: string;
    position: string;
    on: string[];
    theme: string;
    style: {
        marginInlineStart: string;
        marginInlineEnd: string;
    };
    onClick: (arg0: Event | undefined) => any;
    tabIndex: number;
    delay: any;
};
declare const SelectNestedMemo: React.NamedExoticComponent<SelectNestedProps>;
import * as React from 'react';
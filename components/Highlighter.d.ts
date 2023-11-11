/// Generated by Webframe.app | Do not edit this file directly! \\\
export interface HighlighterProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Source code string
   */
  children: string;
  /**
   * Code block language
   */
  language: string;
  /**
   * The element that wraps around the `<code>` block
   */
  PreTag: string;
}
/**
 * Syntax Highlighter for `<Markdown>` code block.
 * @example:
 *  import { Markdown, mdJSX } from '@webframer/ui'
 *
 *  <Markdown components={mdJSX}} children={`~~~jsx\n${jsxSourceCode}\n~~~`} />
 *
 */
export function Highlighter(props: HighlighterProps): JSX.Element;

/**
 * Create `components` prop for use with `<Markdown>`
 * @see: `HighlightJSX.js` for example
 *
 * @param {string} language - one of the supported code languages (eg. 'jsx')
 * @param {object} [style] - SyntaxHighlighter theme
 * @returns {object} `components` prop
 */
export function createMarkdownComponentsProp(language: string, style?: object | undefined): object;
export default HighlighterMemo;
export const highlightCodeTheme: {
    'code[class*="language-"]': {
        color: string;
        textShadow: string;
        fontFamily: string;
        textAlign: string;
        whiteSpace: string;
        wordSpacing: string;
        wordBreak: string;
        wordWrap: string;
        lineHeight: string;
        MozTabSize: string;
        OTabSize: string;
        tabSize: string;
        WebkitHyphens: string;
        MozHyphens: string;
        msHyphens: string;
        hyphens: string;
    };
    'pre[class*="language-"]': {
        color: string;
        textShadow: string;
        fontFamily: string;
        textAlign: string;
        whiteSpace: string;
        wordSpacing: string;
        wordBreak: string;
        wordWrap: string;
        lineHeight: string;
        MozTabSize: string;
        OTabSize: string;
        tabSize: string;
        WebkitHyphens: string;
        MozHyphens: string;
        msHyphens: string;
        hyphens: string;
        padding: string;
        margin: string;
        overflow: string;
        borderRadius: string;
    };
    ':not(pre) > code[class*="language-"]': {
        background: string;
        padding: string;
        borderRadius: string;
        whiteSpace: string;
    };
    '.namespace': {
        Opacity: string;
    };
    comment: {
        color: string;
    };
    prolog: {
        color: string;
    };
    doctype: {
        color: string;
    };
    cdata: {
        color: string;
    };
    constant: {
        color: string;
    };
    property: {
        color: string;
    };
    tag: {
        color: string;
    };
    'attr-name': {
        color: string;
    };
    atrule: {
        color: string;
    };
    variable: {
        color: string;
    };
    function: {
        color: string;
    };
    'class-name': {
        color: string;
    };
    string: {
        color: string;
    };
    '.language-css .token.string': {
        color: string;
    };
    '.style .token.string': {
        color: string;
    };
    'attr-value': {
        color: string;
    };
    char: {
        color: string;
    };
    inserted: {
        color: string;
    };
    selector: {
        color: string;
    };
    regex: {
        color: string;
    };
    number: {
        color: string;
    };
    boolean: {
        color: string;
    };
    keyword: {
        color: string;
    };
    operator: {
        color: string;
    };
    url: {
        color: string;
    };
    punctuation: {
        color: string;
    };
    symbol: {
        color: string;
    };
    builtin: {
        color: string;
    };
    entity: {
        color: string;
        cursor: string;
    };
    important: {
        color: string;
        fontWeight: string;
    };
    deleted: {
        color: string;
    };
    bold: {
        fontWeight: string;
    };
    italic: {
        fontStyle: string;
    };
};
declare const HighlighterMemo: React.NamedExoticComponent<HighlighterProps>;
import * as React from 'react';

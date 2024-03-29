/// Generated by Webframe.app | Do not edit this file directly! \\\
export function imageSrc({ avatar, src, name, dir }: {
    avatar: any;
    src: any;
    name?: string | undefined;
    dir?: any;
}): any;
export interface ImageProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * File name (required if `src` or `alt` not defined)
   */
  name?: string;
  /**
   * Directory path to the file (without file name) if `src` not given
   */
  dir?: string;
  /**
   * Image file source URL or full file path (takes priority over file `name`)
   */
  src?: string;
  /**
   * Alternative text description of the image (auto generated from file `name`)
   */
  alt?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'auto' | 'async' | 'sync';
  /**
   * CSS class names separated by space
   */
  className?: string;
  style?: unknown;
}
/**
 * Image - Pure Component.
 * @see https://webframe.app/docs/ui/components/Image
 */
export function Image(props: ImageProps): JSX.Element;

export default ImageMemo;
declare const ImageMemo: React.NamedExoticComponent<ImageProps>;
import * as React from 'react';

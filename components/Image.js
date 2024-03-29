import { FILE, fileNameWithoutExt } from '@webframer/js'
import cn from 'classnames'
import * as React from 'react'
import { accessibilitySupport } from '../react.js'
import { type } from '../types.js'

function createImage () {
  /**
   * Image - Pure Component.
   * @see https://webframe.app/docs/ui/components/Image
   */
  function Image ({
    name,
    dir,
    className,
    _ref,
    ...props
  }) {
    props = accessibilitySupport(props)
    if (_ref) props.ref = _ref

    if (props.src == null) props.src = imageSrc({name, dir})
    if (props.alt == null) props.alt = fileNameWithoutExt(name)

    return <img className={cn('img', className)} {...props} />
  }

  Image.defaultProps = {
    // Placeholder image to prevent error and for better UX
    name: 'image.svg',
    loading: 'lazy',
    decoding: 'async',
  }

  Image.propTypes = {
    // File name (required if `src` or `alt` not defined)
    name: type.Src,
    // Directory path to the file (without file name) if `src` not given
    dir: type.String,
    // Image file source URL or full file path (takes priority over file `name`)
    src: type.Src,
    // Alternative text description of the image (auto generated from file `name`)
    alt: type.String,
    loading: type.Enum(['eager', 'lazy']),
    decoding: type.Enum(['auto', 'async', 'sync']),
    className: type.ClassName,
    style: type.Style,
  }

  return [Image]
}

export function imageSrc ({avatar, src, name = '', dir = FILE.PATH_IMAGES}) {
  return avatar || src || (dir + name.replace(/\s/g, '-').toLowerCase())
}

export const [Image] = createImage()
const ImageMemo = React.memo(Image)
ImageMemo.name = Image.name
ImageMemo.propTypes = Image.propTypes
export default ImageMemo

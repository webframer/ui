import { _, l, translate } from '@webframer/js'
import React, { useCallback, useMemo, useState } from 'react'
import Icon from '../components/Icon.js'
import Switch from '../components/Switch.js'
import Text from '../components/Text.js'
import { Button, cn, Expand, extractProps, Markdown, mdJSX, Row, type, View } from '../index.js'

/**
 * Renders `children` along with its source code representation
 */
export function CodeExample ({children, className, source = '', desc, ...view}) {
  const [open, setOpen] = useState(false)
  const sourceCode = useMemo(() => source
    .replace(CODE_INDENT_REGEX, '\n')
    .replace(CODE_TRIM_REGEX, ''), [source])

  // RTL toggle switch -----------------------------------------------------------------------------
  const [rtl, setRtl] = useState(!!view.rtl)
  const toggleDir = useCallback((_e, value) => setRtl(value), [setRtl])

  return (
    <View className={cn('CodeExample', className, 'embossed rounded')} {...extractProps(view)}>
      <Row>
        <View className='CodeExample__desc padding fill middle'>
          <Text className='p fill faded'>{desc || _.EXAMPLE}</Text>
        </View>
        <Row className='CodeExample__buttons middle padding-h gap'>
          <Switch className='font-smallest appear-on-hover-only'
                  onChange={toggleDir}
                  value={rtl}
                  title={_.TOGGLE_LAYOUT_DIRECTION}
                  checkedLabel={<Text className='font-smaller'>{_.RTL}</Text>}
                  uncheckedLabel={<Text className='font-smaller'>{_.LTR}</Text>} />
          <Button className='gap-smaller btn-transparent padding-v-smallest padding-h-smaller fade'
                  onClick={() => setOpen(!open)}>
            <Icon name='hi/code' className='font-large' />
            <Text className='font-small'>{open ? _.HIDE_CODE : _.SHOW_CODE}</Text>
          </Button>
        </Row>
      </Row>
      <Row className={cn('reverse fill padding-h padding-bottom wrap', {gap: open})}>
        <Expand asPanel direction='width' duration={700} open={open}>
          {() => (
            <Markdown className={cn('CodeExample__source fill')}
                      components={mdJSX} children={`~~~jsx\n${sourceCode}\n~~~`} />
          )}
        </Expand>
        <View className='CodeExample__preview fill middle center padding-largest' rtl={rtl}>
          {children}
        </View>
      </Row>
    </View>
  )
}

CodeExample.propTypes = {
  // Example source code
  children: type.Node.isRequired,
  // Description text - default is "Example"
  desc: type.String,
  // `children` as literal source code string for documentation
  // Autogenerate this using [webframe-docs](https://www.npmjs.com/package/webframe-docs) CLI.
  source: type.String,
}

export default React.memo(CodeExample)

translate({
  EXAMPLE: {
    [l.ENGLISH]: 'Example',
  },
  HIDE_CODE: {
    [l.ENGLISH]: 'Hide Code',
  },
  SHOW_CODE: {
    [l.ENGLISH]: 'Show Code',
  },
  LTR: {
    [l.ENGLISH]: 'LTR',
  },
  RTL: {
    [l.ENGLISH]: 'RTL',
  },
  TOGGLE_LAYOUT_DIRECTION: {
    [l.ENGLISH]: 'Toggle Layout Direction',
  },
})

export const CODE_TRIM_REGEX = /^\n+|\n+$/g
export const CODE_INDENT_REGEX = /\n\s{2}/g

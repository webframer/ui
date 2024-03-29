import cn from 'classnames'
import * as React from 'react'
import { useInstance, usePreviousProp } from '../react/hooks.js'
import { renderProp } from '../react/render.js'
import { type } from '../types.js'
import { View } from './View.js'

/**
 * List of Expandable/Collapsible content sections
 * @see https://webframe.app/docs/ui/components/Accordion
 * @see https://webframe.app/docs/ui/components/Expand
 *
 * @example:
 *    import { Accordion, Expand, ExpandPanel, ExpandTab } from '@webframer/ui'
 *
 *    <Accordion>
 *
 *      <Expand>
 *        <ExpandTab>{...}</ExpandTab>
 *        <ExpandPanel>{...}</ExpandPanel>
 *      </Expand>
 *
 *      <Expand>
 *        <ExpandTab>{...}</ExpandTab>
 *        <ExpandPanel>{...}</ExpandPanel>
 *      </Expand>
 *
 *    </Accordion>
 *
 * Logic:
 *  - To keep separation of concerns, and to avoid Expand using incorrect Accordion context,
 *    Shallow clone direct children (i.e. Expand components) to pass Accordion props.
 */
export function Accordion ({
  duration, forceRender, multiple, onChange, open, className, ...props
}) {
  const [opened] = usePreviousProp(open)
  const [self, state] = useInstance({openAll: open, openById: {}})
  if (opened != null && open != null && opened !== open) state.openAll = open // update prop changes

  // Handle Accordion change
  if (!self.props) {
    self.toggleOpen = function (e, open, id, index) {
      const {openById} = self.state
      const {multiple, onChange} = self.props
      if (onChange) onChange.apply(this, arguments)
      if (e.defaultPrevented) return
      self.setState({openAll: false, openById: {...multiple && openById, [index]: open}})
    }
  }
  self.props = arguments[0]

  // Resolve direct children with Accordion props
  const {openAll, openById} = state
  Object.assign(self, state)
  props.children = renderProp(props.children, self)
  props.children = React.Children.map(props.children, (child, index) => {
    // Checking isValidElement is the safe way and avoids a typescript error.
    if (React.isValidElement(child)) {
      const newProps = {index, open: openAll || !!openById[index], onChange: self.toggleOpen}
      if (duration != null) newProps.duration = duration
      if (forceRender != null) newProps.forceRender = forceRender
      return React.cloneElement(child, newProps)
    }
    return child
  })

  return <View className={cn(className, 'accordion')} {...props} />
}

Accordion.propTypes = {
  // Expandable content (see example)
  children: type.NodeOrFunction.isRequired,
  // Expand/Collapse animation duration in milliseconds
  duration: type.Millisecond,
  // Whether to allow opening multiple Accordion panels at once
  multiple: type.Boolean,
  // Callback(event: Event, open: boolean, id: string, index?: number) when `open` state changes
  onChange: type.Function,
  // Whether to have all content expanded by default
  open: type.Boolean,
  // Whether to always render ExpandPanel content (useful for SEO indexing)
  forceRender: type.Boolean,
}

const AccordionMemo = React.memo(Accordion)
AccordionMemo.name = Accordion.name
AccordionMemo.propTypes = Accordion.propTypes
export default AccordionMemo

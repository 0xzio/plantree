import React, { CSSProperties, useState } from 'react'
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Post } from '@prisma/client'
import { CatalogueItem } from './CatalogueItem'
import { FlattenedItem } from './types'

interface Props {
  depth: number
  overDepth: number // projected depth
  name: string
  item: FlattenedItem
  post: Post
  onCollapse?: () => void
}

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => (isSorting || wasDragging ? false : true)

export function SortableTreeItem({
  item,
  post,
  depth,
  overDepth,
  onCollapse,
  name,
}: Props) {
  const sortable = useSortable({
    id: item.id,
    animateLayoutChanges,
  })
  const {
    over,
    active,
    overIndex,
    activeIndex,
    attributes,
    isDragging,
    isSorting,
    isOver,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    setNodeRef,
    transform,
    transition,
  } = sortable

  const { id } = item

  function getActiveStyle() {
    if (!over || !active) return {}
    if (id !== over.id) return {}
    // if (over.id === active.id) return {}
    if (item.isCategory) return {}

    const isAfter = overIndex > activeIndex
    const style = {
      left: overDepth * 20,
      // left: 0,
      right: 0,
      top0: !isAfter,
      bottom0: isAfter,
      content: '""',
      position: 'absolute',
      h: 2,
      w: '100%',
      bgBrand500: true,
    }
    return {
      '::after': style,
    }
  }

  const style: CSSProperties = {
    transform: isSorting ? undefined : CSS.Translate.toString(transform),
    transition,
  }

  return (
    <CatalogueItem
      ref={sortable.setNodeRef}
      item={item}
      post={post}
      name={name}
      depth={depth}
      onCollapse={onCollapse}
      listeners={sortable.listeners}
      // level={item.depth}
      sortable={sortable}
      style={style}
      css={getActiveStyle()}
    />
  )
}

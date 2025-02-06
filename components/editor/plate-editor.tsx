'use client'

import React, { useEffect, useRef } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { SettingsDialog } from '@/components/editor/use-chat'
import {
  PlateEditorType,
  useCreateEditor,
} from '@/components/editor/use-create-editor'
import { CommentsPopover } from '@/components/plate-ui/comments-popover'
import { CursorOverlay } from '@/components/plate-ui/cursor-overlay'
import { Editor, EditorContainer } from '@/components/plate-ui/editor'
import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar'
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons'
import { FloatingToolbar } from '@/components/plate-ui/floating-toolbar'
import { FloatingToolbarButtons } from '@/components/plate-ui/floating-toolbar-buttons'
import { cn } from '@/lib/utils'
import { Plate } from '@udecode/plate-common/react'
import { AddNodeBtn } from '../AddNodeBtn'

interface Props {
  readonly?: boolean
  value: any
  className?: string
  showAddButton?: boolean
  draggable?: boolean
  placeholder?: string
  onInit?: (editor: PlateEditorType) => void
  onChange?: (value: any) => void
}

export function PlateEditor({
  onChange,
  value,
  className,
  showAddButton = false,
  readonly = false,
  draggable = true,
  placeholder,
  onInit,
}: Props) {
  const containerRef = useRef(null)
  const editor = useCreateEditor(value, draggable, placeholder)

  useEffect(() => {
    onInit?.(editor)
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate
        editor={editor}
        onValueChange={({ value }) => {
          onChange?.(value)
        }}
      >
        {/* <FixedToolbar>
          <FixedToolbarButtons />
        </FixedToolbar> */}

        <Editor
          variant="default"
          readOnly={readonly}
          className={cn(className)}
        />

        <EditorContainer id="scroll_container" ref={containerRef}>
          <FloatingToolbar>
            <FloatingToolbarButtons />
          </FloatingToolbar>

          {showAddButton && <AddNodeBtn editor={editor} />}

          {/* <CommentsPopover /> */}

          <CursorOverlay containerRef={containerRef} />
        </EditorContainer>

        {/* <SettingsDialog /> */}
      </Plate>
    </DndProvider>
  )
}

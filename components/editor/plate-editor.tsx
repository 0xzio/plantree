'use client'

import React, { useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { SettingsDialog } from '@/components/editor/settings'
import {
  PlateEditorType,
  useCreateEditor,
} from '@/components/editor/use-create-editor'
import { Editor, EditorContainer } from '@/components/plate-ui/editor'
import { cn } from '@/lib/utils'
import { Plate } from '@udecode/plate/react'

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
  const editor = useCreateEditor({
    value,
    placeholder,
  })

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
        <EditorContainer>
          <Editor
            variant="post"
            readOnly={readonly}
            className={cn(className)}
          />
        </EditorContainer>

        {/* <SettingsDialog /> */}
      </Plate>
    </DndProvider>
  )
}

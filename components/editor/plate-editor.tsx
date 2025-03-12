'use client'

import React, { useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { SettingsDialog } from '@/components/editor/settings'
import {
  PlateEditorType,
  useCreateEditor,
} from '@/components/editor/use-create-editor'
import {
  Editor,
  EditorContainer,
  editorVariants,
} from '@/components/plate-ui/editor'
import { cn } from '@/lib/utils'
import { Plate } from '@udecode/plate/react'
import { VariantProps } from 'class-variance-authority'
import { AddNodeBtn } from '../AddNodeBtn'

interface Props {
  readonly?: boolean
  value: any
  className?: string
  showAddButton?: boolean
  showFixedToolbar?: boolean
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
  showFixedToolbar = false,
  readonly = false,
  draggable = true,
  placeholder,
  onInit,
  variant = 'none',
}: Props & VariantProps<typeof editorVariants>) {
  const editor = useCreateEditor({
    value,
    placeholder,
    showFixedToolbar,
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
            variant={variant}
            readOnly={readonly}
            className={cn('text-lg', className)}
          />
          {showAddButton && (
            <div className="size-full px-16 pt-4 text-base sm:px-[max(10px,calc(50%-350px))]">
              <AddNodeBtn editor={editor} />
            </div>
          )}
        </EditorContainer>

        {/* <SettingsDialog /> */}
      </Plate>
    </DndProvider>
  )
}

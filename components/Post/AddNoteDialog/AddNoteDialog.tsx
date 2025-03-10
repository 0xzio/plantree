import { useState } from 'react'
import { PlateEditor } from '@/components/editor/plate-editor'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { usePosts } from '@/hooks/usePosts'
import { usePublishPost } from '@/hooks/usePublishPost'
import { editorDefaultValue } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api } from '@/lib/trpc'
import { GateType, PostType } from '@prisma/client'
import { add } from 'lodash'
import { Editor, Node, Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { toast } from 'sonner'
import { useAddNoteDialog } from './useAddNoteDialog'

export function AddNoteDialog() {
  const site = useSiteContext()
  const { isOpen, setIsOpen } = useAddNoteDialog()
  const [value, setValue] = useState(editorDefaultValue)
  const [isLoading, setLoading] = useState(false)
  const { refetch } = usePosts()
  const { publishPost } = usePublishPost()

  async function addNote() {
    setLoading(true)
    try {
      const post = await api.post.create.mutate({
        siteId: site.id,
        type: PostType.NOTE,
        title: '',
        content: JSON.stringify(value),
      })
      await publishPost({
        slug: post.slug,
        gateType: GateType.FREE,
        collectible: false,
        delivered: false,
      })
      refetch()
      setIsOpen(false)
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to add note')
    }
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[560px] min-h-[320px] p-6">
        <DialogDescription className="hidden"></DialogDescription>
        <div className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>

          <div className="flex-1 -mx-6">
            <PlateEditor
              className="flex-1"
              value={value}
              draggable={false}
              placeholder="Write your thoughts..."
              onInit={(editor: any) => {
                setTimeout(() => {
                  Transforms.select(editor, Editor.end(editor, [0, 0]))
                  ReactEditor.focus(editor)
                }, 0)
              }}
              onChange={(v) => {
                setValue(v)
              }}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              className="flex gap-1"
              disabled={isLoading}
              type="submit"
              onClick={async () => {
                addNote()
              }}
            >
              <div>Add Note</div>
              {isLoading && <LoadingDots className="bg-background" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

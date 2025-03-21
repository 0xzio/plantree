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
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { usePosts } from '@/hooks/usePosts'
import { usePublishPost } from '@/hooks/usePublishPost'
import { editorDefaultValue } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api } from '@/lib/trpc'
import { GateType, PostType } from '@prisma/client'
import { usePlateEditor } from '@udecode/plate/react'
import { add } from 'lodash'
import { Editor, Node, Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { toast } from 'sonner'
import { useAddNoteDialog } from './useAddNoteDialog'

const key = 'PUBLISH_NOTE_DIRECTLY'
export function AddNoteDialog() {
  const { isOpen, setIsOpen } = useAddNoteDialog()
  const [value, setValue] = useState(editorDefaultValue)

  return (
    <Dialog modal open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent forceMount className="sm:max-w-[560px] min-h-[320px] p-6">
        <DialogDescription className="hidden"></DialogDescription>
        <div className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Add note</DialogTitle>
          </DialogHeader>

          <div className="flex-1">
            <PlateEditor
              className="flex-1 min-h-52"
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
            >
              <Footer value={value} setValue={setValue} />
            </PlateEditor>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Footer({
  value,
  setValue,
}: {
  value: any
  setValue: (v: any) => void
}) {
  const site = useSiteContext()
  const { setIsOpen } = useAddNoteDialog()
  const [isLoading, setLoading] = useState(false)
  const { refetch } = usePosts()
  const { publishPost } = usePublishPost()
  const [publishDirectly, setPublishDirectly] = useState(
    localStorage.getItem(key) !== 'true' ? true : false,
  )
  const editor = usePlateEditor()

  async function addNote() {
    setLoading(true)
    try {
      const post = await api.post.create.mutate({
        siteId: site.id,
        type: PostType.NOTE,
        title: '',
        content: JSON.stringify(value),
      })
      if (publishDirectly) {
        await publishPost(
          {
            slug: post.slug,
            gateType: GateType.FREE,
            collectible: false,
            delivered: false,
          },
          post as any,
        )
      }
      refetch()
      setIsOpen(false)
      setValue(editorDefaultValue)
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to add note')
    }
    setLoading(false)
  }
  return (
    <div className="flex gap-2 justify-between items-center">
      <div className="flex items-center space-x-2">
        <Switch
          id="enable-publish"
          checked={publishDirectly}
          onCheckedChange={(checked) => {
            setPublishDirectly(checked)
            if (checked) {
              localStorage.setItem(key, 'true')
            } else {
              localStorage.removeItem(key)
            }
          }}
        />
        <Label htmlFor="enable-publish" className="text-foreground/60">
          Publish directly
        </Label>
      </div>
      <Button
        size="lg"
        className="flex gap-1"
        disabled={isLoading}
        type="submit"
        onClick={async () => {
          addNote()
        }}
      >
        <div>Add note</div>
        {isLoading && <LoadingDots className="bg-background" />}
      </Button>
    </div>
  )
}

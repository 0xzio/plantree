import { forwardRef, useRef, useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { Post } from '@/hooks/usePost'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api } from '@/lib/trpc'
import { uploadFile } from '@/lib/uploadFile'
import { getUrl } from '@/lib/utils'
import { AudioLinesIcon, ImageIcon, X } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface Props {
  post: Post
}

export const AudioCreationUpload = forwardRef<HTMLDivElement, Props>(
  function AudioCreationUpload({ post }, ref) {
    const [value, setValue] = useState((post.media as string) || '')
    const inputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        setLoading(true)
        const file = e.target.files[0]
        const src = URL.createObjectURL(file)
        setValue(src)

        try {
          const data = await uploadFile(file)
          const uri = data.url || data.cid || ''
          await api.post.update.mutate({
            id: post.id,
            media: uri,
          })
          setValue(data.url!)
          toast.success('Audio uploaded successfully')
        } catch (error) {
          console.log('Failed to upload file:', error)
          toast.error(extractErrorMessage(error) || 'Failed to upload audio')
        }

        setLoading(false)
      }
    }

    async function removeImage() {
      setValue('')
      await api.post.update.mutate({
        id: post.id,
        media: '',
      })
    }

    if (value) {
      return (
        <div className="w-full h-auto relative space-y-2">
          <audio controls className="w-full">
            <source src={getUrl(post.media || '')} type="audio/mp3" />
          </audio>
          <X
            className="absolute -top-0 -right-1 bg-foreground/10 rounded-full p-1 text-foreground/80 w-6 h-6 cursor-pointer"
            onClick={removeImage}
          />

          {loading && (
            <div className="flex items-center justify-center gap-1">
              <span className="text-sm text-foreground/50">
                Audio uploading
              </span>
              <LoadingDots className="bg-foreground/50" />
            </div>
          )}
        </div>
      )
    }

    return (
      <div ref={ref}>
        <div className="w-full h-[200px] rounded-2xl bg-accent relative cursor-pointer flex items-center justify-center">
          <div className="absolute left-0 top-0 w-full h-full cursor-pointer z-1 flex items-center justify-center gap-1 text-foreground/40 text-sm">
            <AudioLinesIcon size={18} />
            <div>Select audio</div>
          </div>

          <input
            ref={inputRef}
            type="file"
            onChange={handleFileChange}
            className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer z-10"
          />
          {loading && <LoadingDots />}
        </div>
      </div>
    )
  },
)

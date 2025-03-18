import { forwardRef, useEffect, useRef, useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { Post } from '@/lib/theme.types'
import { api } from '@/lib/trpc'
import { uploadFile } from '@/lib/uploadFile'
import { getUrl } from '@/lib/utils'
import { AudioLinesIcon, ImageIcon, X } from 'lucide-react'
import { Player } from 'shikwasa'
import { toast } from 'sonner'
import { useSiteContext } from '../SiteContext'
import { Button } from '../ui/button'

interface Props {
  post: Post
}

export const AudioCreationUpload = forwardRef<HTMLDivElement, Props>(
  function AudioCreationUpload({ post }, ref) {
    const [value, setValue] = useState(post?.podcast?.media || '')
    const inputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const playerRef = useRef<any>(null)
    const site = useSiteContext()

    // TODO: hack
    const [mounted, setMounted] = useState(true)

    useEffect(() => {
      if (!value || !value.startsWith('/')) return

      playerRef.current = new Player({
        container: () => document.querySelector('.podcast-audio'),
        // fixed: {
        //   type: 'fixed',
        //   position: 'bottom',
        // },
        themeColor: 'black',
        theme: 'light',
        download: true,
        preload: 'metadata',
        audio: {
          title: post.title,
          artist:
            post?.authors[0]?.user?.displayName ||
            post?.authors[0]?.user?.name ||
            '',
          cover: post.image
            ? getUrl(post.image || '')
            : getUrl(site.logo || site.image || ''),
          // src: 'https://r2.penx.me/8283074160_460535.mp3',
          // src: 'https://v.typlog.com/sspai/8267989755_658478.mp3'
          src: getUrl(value),
        },
      })
      window.__PLAYER__ = playerRef.current
    }, [value])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        setLoading(true)
        const file = e.target.files[0]
        const src = URL.createObjectURL(file)
        setValue(src)

        const duration = await getDuration(file)

        try {
          const data = await uploadFile(file)
          const uri = data.url || data.cid || ''
          await api.post.update.mutate({
            id: post.id,
            podcast: {
              ...post.podcast,
              duration,
              media: uri,
            },
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

    async function removeAudio() {
      setValue('')
      playerRef.current = null
      await api.post.update.mutate({
        id: post.id,
        podcast: {},
      })
    }

    if (!mounted) return null

    if (value) {
      return (
        <div className="w-full h-auto relative space-y-2">
          <div className="podcast-audio"></div>
          <div className="text-center">
            <Button
              variant="outline-solid"
              onClick={() => {
                setMounted(false)
                removeAudio()
                setTimeout(() => {
                  setMounted(true)
                }, 10)
              }}
            >
              Reupload audio
            </Button>
          </div>
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
        <div className="w-full h-[160px] rounded-2xl bg-accent relative cursor-pointer flex items-center justify-center">
          <div className="absolute left-0 top-0 w-full h-full cursor-pointer z-1 flex items-center justify-center gap-1 text-foreground/40 text-sm">
            <AudioLinesIcon size={18} />
            <div>Select audio</div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".mp3"
            onChange={handleFileChange}
            className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer z-10"
          />
          {loading && <LoadingDots />}
        </div>
      </div>
    )
  },
)

function getDuration(file: File): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const audio = new Audio(URL.createObjectURL(file))
    audio.addEventListener('canplaythrough', () => {
      const duration = audio.duration
      if (isNaN(duration)) {
        reject(new Error('Failed to get audio duration'))
      } else {
        resolve(duration)
      }
    })
    audio.addEventListener('error', () => {
      reject(new Error('Failed to load audio'))
    })
  })
}

import { useRef, useState } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { UploadCloud } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  className?: string
}

export const ImportPostsButton = ({ className, ...rest }: Props) => {
  const site = useSiteContext()

  const hiddenFileInput = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as any)
        await api.post.importPosts.mutate({
          siteId: site.id,
          postData: JSON.stringify(jsonData),
        })
        toast.success('Posts imported successfully!')
      } catch (error) {
        console.error('Error parsing JSON:', error)
        toast.error(extractErrorMessage(error) || 'Failed to import posts')
      }
    }
    reader.readAsText(file)
  }

  const handleClick = () => {
    hiddenFileInput.current?.click?.()
  }

  return (
    <div {...rest} className={cn('flex items-center', className)}>
      <Button onClick={handleClick}>Import</Button>
      <input
        type="file"
        accept="application/json"
        onChange={(event) => {
          const fileUploaded = event.target.files?.[0]!
          handleFile(fileUploaded)
        }}
        ref={hiddenFileInput}
        style={{ display: 'none' }}
      />
    </div>
  )
}

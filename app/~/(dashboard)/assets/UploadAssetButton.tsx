'use client'

import { useRef, useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { useAssets } from '@/hooks/useAssets'
import { calculateSHA256FromFile } from '@/lib/encryption'
import { localDB } from '@/lib/local-db'
import { trpc } from '@/lib/trpc'
import { uniqueId } from '@/lib/unique-id'
import { uploadFile } from '@/lib/uploadFile'
import { cn } from '@/lib/utils'
import { UploadCloud } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  className?: string
}

export const UploadAssetButton = ({ className, ...rest }: Props) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    hiddenFileInput.current?.click?.()
  }

  const [uploading, setUploading] = useState(false)
  const { refetch } = useAssets()
  async function handleUpload(file: File) {
    setUploading(true)
    const fileHash = await calculateSHA256FromFile(file)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('from', 'ASSET')

    const res = await fetch(`/asset/${fileHash}`, {
      method: 'PUT',
      body: formData,
    })
    try {
      uploadFile(file, false)

      toast.success('Image uploaded successfully!')

      await localDB.addFile(fileHash, file)
      await refetch()
    } catch (error) {
      toast.error('Upload image failed')
    }

    setUploading(false)
  }

  return (
    <Button variant="brand" {...rest} className={cn('p-0 w-40', className)}>
      <a
        onClick={handleClick}
        className="bg-transparent h-full w-full flex items-center gap-2 text-sm px-3 justify-center"
      >
        {!uploading && <UploadCloud size={20} />}
        {!uploading && <span>Upload a image</span>}
        {uploading && (
          <div className="flex items-center gap-x-2">
            <span>Uploading</span>
            <LoadingDots className="bg-white" />
          </div>
        )}
      </a>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const fileUploaded = event.target.files?.[0]!
          handleUpload(fileUploaded)
        }}
        ref={hiddenFileInput}
        style={{ display: 'none' }}
      />
    </Button>
  )
}

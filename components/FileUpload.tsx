import { forwardRef, useMemo, useRef, useState } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { IPFS_GATEWAY } from '@/lib/constants'
import { Edit3 } from 'lucide-react'
import Image from 'next/image'

interface Props {
  value?: string
  onChange?: (value: string) => void
}

export const FileUpload = forwardRef<HTMLDivElement, Props>(function FileUpload(
  { value, onChange },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setLoading(true)
      const file = e.target.files[0]
      const src = URL.createObjectURL(file)
      onChange?.(src)

      const res = await fetch('/api/ipfs-upload?pin=true', {
        method: 'POST',
        body: file,
      })

      if (res.ok) {
        const data = await res.json()
        console.log('=======data.cid:', data.cid)
        onChange?.(data.cid)
      } else {
        console.log('Failed to upload file')
      }
      setLoading(false)
    }
  }

  const imageUrl = useMemo(() => {
    if (value?.startsWith('blob') || value?.startsWith('http')) return value
    return IPFS_GATEWAY + `/ipfs/${value}`
  }, [value])

  return (
    <div ref={ref}>
      <div className="w-20 h-20 rounded-2xl bg-accent relative cursor-pointer flex items-center justify-center overflow-hidden">
        {value && (
          <img
            src={imageUrl}
            className="absolute left-0 top-0 w-full h-full cursor-pointer"
            alt=""
          />
        )}
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer"
        />
        {loading && <LoadingDots />}
        <div
          className="rounded-full h-6 w-6 border flex items-center justify-center bg-white absolute top-1 right-1"
          onClick={() => {
            inputRef.current?.click()
          }}
        >
          <Edit3 size={14}></Edit3>
        </div>
      </div>
    </div>
  )
})

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { UploadCloud } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface PlatformTabProps {
  platform: 'penx'
  isImporting: boolean
  onFileSelect: (file: File) => void
  description: string
  acceptTypes: string
  fileType: string
}

export function PlatformTab({
  platform,
  isImporting,
  onFileSelect,
  description,
  acceptTypes,
  fileType
}: PlatformTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileClick = () => {
    fileInputRef.current?.click?.()
  }
  
  const platformNames = {
    penx: 'PenX',
    paragraph: 'Paragraph',
    substack: 'Substack'
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center">
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
        <Badge variant="outline" className="ml-2">{fileType}</Badge>
      </div>
      <Button 
        onClick={handleFileClick} 
        disabled={isImporting}
        className="w-full"
      >
        <UploadCloud className="mr-2 h-4 w-4" />
        {isImporting ? 'Importing...' : `Select ${platformNames[platform]} File`}
      </Button>
      
      <input
        type="file"
        accept={acceptTypes}
        onChange={(event) => {
          const fileUploaded = event.target.files?.[0]
          if (fileUploaded) onFileSelect(fileUploaded)
          event.target.value = ''
        }}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
    </div>
  )
} 
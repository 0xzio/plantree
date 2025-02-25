import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { PlatformTab } from './PlatformTab'
import { SubstackImportTab } from './SubstackImportTab'
import { useImport } from './useImport'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const { isImporting, handlePenxImport, handleParagraphImport, handleSubstackImport } = useImport()
  const [activeTab, setActiveTab] = useState<'penx' | 'paragraph' | 'substack'>('penx')

  const handlePenxFiles = async (file: File) => {
    const success = await handlePenxImport(file)
    if (success) {
      onOpenChange(false)
    }
  }

  const handleParagraphFiles = async (file: File) => {
    const success = await handleParagraphImport(file)
    if (success) {
      onOpenChange(false)
    }
  }

  const handleSubstackFiles = async (csvFile: File, htmlFiles: FileList) => {
    const success = await handleSubstackImport(csvFile, htmlFiles)
    if (success) {
      onOpenChange(false)
    }
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Import Posts</DialogTitle>
        <DialogDescription>
          Choose a platform to import posts from
        </DialogDescription>
      </DialogHeader>
      
      <Tabs 
        defaultValue="penx" 
        className="w-full"
        onValueChange={(value) => setActiveTab(value as 'penx' | 'paragraph' | 'substack')}
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="penx">PenX</TabsTrigger>
          <TabsTrigger value="paragraph">Paragraph</TabsTrigger>
          <TabsTrigger value="substack">Substack</TabsTrigger>
        </TabsList>
        
        <TabsContent value="penx" className="py-4">
          <PlatformTab
            platform="penx"
            isImporting={isImporting}
            onFileSelect={handlePenxFiles}
            description="Import posts exported from PenX."
            acceptTypes="application/json"
            fileType="JSON"
          />
        </TabsContent>
        
        <TabsContent value="paragraph" className="py-4">
          <PlatformTab
            platform="paragraph"
            isImporting={isImporting}
            onFileSelect={handleParagraphFiles}
            description="Select the CSV file exported from your Paragraph account."
            acceptTypes="text/csv"
            fileType="CSV"
          />
        </TabsContent>
        
        <TabsContent value="substack" className="py-4">
          <SubstackImportTab
            isImporting={isImporting}
            onImport={handleSubstackFiles}
          />
        </TabsContent>
      </Tabs>
    </DialogContent>
  )
} 
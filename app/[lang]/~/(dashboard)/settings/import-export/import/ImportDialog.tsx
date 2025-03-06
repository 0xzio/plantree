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
import { URLImportTab } from './URLImportTab'
import { useImport } from './useImport'
import { Badge } from '@/components/ui/badge'

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const { isImporting, handlePenxImport, handleUrlImport } = useImport()
  const [activeTab, setActiveTab] = useState<'penx' | 'url'>('penx')

  const handlePenxFiles = async (file: File) => {
    const success = await handlePenxImport(file)
    if (success) {
      onOpenChange(false)
    }
  }
  
  const handleUrlImportAction = async (url: string) => {
    const success = await handleUrlImport(url)
    if (success) {
      onOpenChange(false)
    }
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Import Posts</DialogTitle>
        <DialogDescription>
          Choose a method to import posts
        </DialogDescription>
      </DialogHeader>
      
      <Tabs 
        defaultValue="penx" 
        value={activeTab}
        className="w-full"
        onValueChange={(value) => setActiveTab(value as 'penx' | 'url')}
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="penx">PenX</TabsTrigger>
          <TabsTrigger value="url" className="relative">
            URL
            {activeTab === 'url' && (
              <Badge 
                variant="outline" 
                className="absolute -top-1 -right-1 text-[9px] px-1 py-0 h-auto bg-muted text-muted-foreground border-border"
              >
                BETA
              </Badge>
            )}
          </TabsTrigger>
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
        
        <TabsContent value="url" className="py-4">
          <URLImportTab
            isImporting={isImporting}
            onImport={handleUrlImportAction}
          />
        </TabsContent>
      </Tabs>
    </DialogContent>
  )
} 
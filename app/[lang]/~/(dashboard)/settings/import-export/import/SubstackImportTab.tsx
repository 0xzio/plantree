import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { UploadCloud, File, CheckCircle2, AlertCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface SubstackImportTabProps {
  isImporting: boolean
  onImport: (csvFile: File, htmlFiles: FileList) => void
}

export function SubstackImportTab({
  isImporting,
  onImport
}: SubstackImportTabProps) {
  const csvFileInputRef = useRef<HTMLInputElement>(null)
  const htmlFilesInputRef = useRef<HTMLInputElement>(null)
  
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [htmlFiles, setHtmlFiles] = useState<FileList | null>(null)
  
  const handleCsvClick = () => {
    csvFileInputRef.current?.click()
  }
  
  const handleHtmlClick = () => {
    htmlFilesInputRef.current?.click()
  }
  
  const handleImport = () => {
    if (csvFile && htmlFiles && htmlFiles.length > 0) {
      onImport(csvFile, htmlFiles)
    }
  }
  
  const isImportReady = csvFile && htmlFiles && htmlFiles.length > 0
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="space-y-4">
        <div className="border rounded-md p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <File className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">posts.csv file <span className="text-red-500">*</span></span>
            </div>
            {csvFile && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
          </div>
          
          {csvFile ? (
            <div className="text-sm text-muted-foreground flex items-center justify-between">
              <span className="truncate max-w-[200px]">{csvFile.name}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCsvClick}
                disabled={isImporting}
              >
                Change
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleCsvClick}
              disabled={isImporting}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              Select CSV file
            </Button>
          )}
        </div>
        
        <div className="border rounded-md p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <File className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">HTML files from 'posts' directory <span className="text-red-500">*</span></span>
            </div>
            {htmlFiles && htmlFiles.length > 0 && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
          </div>
          
          {htmlFiles && htmlFiles.length > 0 ? (
            <div className="text-sm text-muted-foreground flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <span>{htmlFiles.length} files selected</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleHtmlClick}
                  disabled={isImporting}
                >
                  Change
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleHtmlClick}
              disabled={isImporting}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              Select HTML files
            </Button>
          )}
        </div>
      </div>
      
      {isImporting && (
        <div className="space-y-2">
          <Progress value={45} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">Importing posts...</p>
        </div>
      )}
      
      <Button 
        className="w-full"
        disabled={!isImportReady || isImporting}
        onClick={handleImport}
      >
        {isImporting ? 'Importing...' : 'Import Substack Content'}
      </Button>
      
      <input
        type="file"
        accept="text/csv"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) setCsvFile(file)
          event.target.value = ''
        }}
        ref={csvFileInputRef}
        style={{ display: 'none' }}
      />
      
      <input
        type="file"
        accept="text/html"
        multiple
        onChange={(event) => {
          const files = event.target.files
          if (files && files.length > 0) setHtmlFiles(files)
          event.target.value = ''
        }}
        ref={htmlFilesInputRef}
        style={{ display: 'none' }}
      />
    </div>
  )
} 
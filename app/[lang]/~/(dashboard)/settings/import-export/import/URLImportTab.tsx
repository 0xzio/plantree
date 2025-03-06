import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Link, Globe, ArrowRight, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'

interface URLImportTabProps {
  isImporting: boolean
  onImport: (url: string) => void
}

export function URLImportTab({
  isImporting,
  onImport
}: URLImportTabProps) {
  const [url, setUrl] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  
  const handleImport = () => {
    if (!url) {
      setError('Please enter a URL')
      return
    }
    
    try {
      new URL(url)
      setError(null)
      onImport(url)
    } catch (e) {
      setError('Please enter a valid URL')
    }
  }

  const exampleUrls = [
    { name: 'Zio', url: 'https://zio.penx.io/posts' },
    { name: 'Leen', url: 'https://leen.penx.io/posts' }
  ]
  
  return (
    <div className="flex flex-col space-y-5">
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium">Enter blog URL</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              placeholder="https://example.com/posts"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (error) setError(null)
              }}
              disabled={isImporting}
              className="pr-10"
            />
            <Link className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button 
            onClick={handleImport}
            disabled={isImporting || !url}
            className="min-w-[80px]"
          >
            {isImporting ? 'Importing...' : 'Import'}
            {!isImporting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertDescription className="text-xs flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {error}
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      {isImporting && (
        <div className="space-y-2">
          <Progress value={45} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">Importing content from URL...</p>
        </div>
      )}
      
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Try with these examples:</p>
        <div className="grid grid-cols-2 gap-2">
          {exampleUrls.map((example) => (
            <Card 
              key={example.name} 
              className="border-dashed cursor-pointer transition-colors hover:bg-accent border-border"
              onClick={() => setUrl(example.url)}
            >
              <CardContent className="p-2">
                <div className="text-xs font-medium">{example.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">{example.url}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 
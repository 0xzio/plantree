import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Link, Globe, ArrowRight, AlertTriangle, Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { ImportTask, PostData } from './useImport'
import { PostSelectionList } from './PostSelectionList'

interface URLImportTabProps {
  isImporting: boolean
  importTask: ImportTask | null
  progress: { progress: number, message: string }
  onImport: (url: string) => void
  onImportPosts: (posts: PostData[]) => Promise<void>
}

export function URLImportTab({
  isImporting,
  importTask,
  progress,
  onImport,
  onImportPosts
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
  
  const showPostsList = importTask?.status === 'completed' && importTask.result && importTask.result.length > 0
  const showNoPostsMessage = importTask?.status === 'completed' && (!importTask.result || importTask.result.length === 0)
  
  return (
    <div className="w-full flex flex-col space-y-5">
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium">Enter blog URL</p>
        </div>
        
        <Alert 
          variant="default" 
          className="border-amber-200/30 bg-amber-50/30 dark:border-amber-400/10 dark:bg-amber-900/10"
        >
          <AlertDescription className="text-xs flex items-start">
            <Info className="h-3 w-3 mr-1.5 mt-0.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span className="text-amber-800 dark:text-amber-200">
              For best results, enter a blog's directory page rather than a single article.
              For paginated blogs, import each page separately.
            </span>
          </AlertDescription>
        </Alert>
        
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
      
      {isImporting && !showPostsList && (
        <div className="space-y-2">
          <Progress value={progress.progress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">{progress.message}</p>
          
          {importTask?.status === 'extracting' && (
            <p className="text-xs text-center text-muted-foreground italic">
              This may take a few minutes for large blogs
            </p>
          )}
        </div>
      )}
      
      {showPostsList && (
        <div className="space-y-3 w-full">
          <div className="flex items-center justify-between w-full">
            {importTask.total && importTask.total > importTask.result!.length && (
              <p className="text-xs text-muted-foreground">
                {importTask.total - importTask.result!.length} posts couldn't be parsed
              </p>
            )}
          </div>
          <PostSelectionList 
            posts={importTask.result!}
            isImporting={isImporting}
            onImport={onImportPosts}
          />
        </div>
      )}
      
      {showNoPostsMessage && (
        <Alert>
          <AlertDescription>
            No posts were found at this URL. Try a different URL or check if the blog is accessible.
          </AlertDescription>
        </Alert>
      )}
      
      {!isImporting && !showPostsList && !showNoPostsMessage && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Try with these examples:</p>
          <div className="grid grid-cols-2 gap-2">
            {exampleUrls.map((example) => (
              <Card 
                key={example.name} 
                className="border-dashed cursor-pointer transition-colors hover:bg-accent"
                onClick={() => setUrl(example.url)}
              >
                <CardContent className="px-2">
                  <div className="text-sm font-medium">{example.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{example.url}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 
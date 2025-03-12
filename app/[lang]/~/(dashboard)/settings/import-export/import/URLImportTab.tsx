import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ImportPostData, ImportTask } from '@/hooks/usePostImportTask'
import {
  AlertTriangle,
  ArrowRight,
  Globe,
  Info,
  Link,
  Search,
  AlertCircle,
} from 'lucide-react'
import { PostSelectionList } from './PostSelectionList'

// Define stages for the import process
const STAGES = ['pending', 'extracting', 'analyzing', 'converting', 'completed'];

interface URLImportTabProps {
  isImporting: boolean
  importTask: ImportTask | null
  progress: { progress: number; message: string }
  onImport: (url: string) => void
  onImportPosts: (posts: ImportPostData[]) => Promise<void>
}

export function URLImportTab({
  isImporting,
  importTask,
  progress,
  onImport,
  onImportPosts,
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
    { name: 'Dan abramov', url: 'https://overreacted.io' },
    { name: 'Vitalik Buterin', url: 'https://vitalik.eth.limo' },
  ]

  const shouldDisplayPostSelection =
    importTask?.status === 'completed' &&
    importTask.result &&
    importTask.result.length > 0
  const shouldDisplayEmptyResult =
    importTask?.status === 'completed' &&
    (!importTask.result || importTask.result.length === 0)

  const getErrorMessage = (error?: string): { message: string, suggestion: string } => {
    if (!error) return { 
      message: 'Unknown error occurred', 
      suggestion: 'Please try again or use a different URL' 
    };
    
    if (error.includes('timeout')) {
      return {
        message: 'The import process took too long',
        suggestion: 'Try a URL with fewer posts or import directly from a file'
      };
    }
    
    if (error.includes('not found') || error.includes('404')) {
      return {
        message: 'The URL could not be accessed',
        suggestion: 'Check if the URL is correct and publicly accessible'
      };
    }
    
    // Handle more error types
    if (error.includes('parse') || error.includes('format')) {
      return {
        message: 'Content format not supported',
        suggestion: 'This URL may not contain standard blog content'
      };
    }
    
    return { message: error, suggestion: 'Please try again with a different URL' };
  }

  return (
    <div className="w-full flex flex-col space-y-5">
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium">Enter blog URL</p>
        </div>

        <Alert
          variant="default"
          className="border-amber-200/30 bg-amber-50/30 dark:border-amber-400/10 dark:bg-amber-900/10"
        >
          <AlertDescription className="text-xs flex items-start">
            <Info className="h-3 w-3 mr-1.5 mt-0.5 text-amber-600 dark:text-amber-400shrink-0" />
            <span className="text-amber-800 dark:text-amber-200">
              For best results, enter a blog's directory page rather than a
              single article. For paginated blogs, import each page separately.
            </span>
          </AlertDescription>
        </Alert>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 group">
            <Input
              placeholder="https://example.com/posts"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (error) setError(null)
              }}
              disabled={isImporting}
              className="pr-10 transition-all focus-visible:ring-primary/50"
            />
            <Link className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <Button
            onClick={handleImport}
            disabled={isImporting || !url}
            className="min-w-[80px] transition-all"
          >
            {isImporting ? (
              <span className="flex items-center">
                <Search className="mr-2 h-3.5 w-3.5 animate-pulse" />
                Importing...
              </span>
            ) : (
              <span className="flex items-center">
                Import
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </span>
            )}
          </Button>
        </div>

        {importTask?.status === 'failed' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{getErrorMessage(importTask.error).message}</AlertTitle>
            <AlertDescription>
              {getErrorMessage(importTask.error).suggestion}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {isImporting && !shouldDisplayPostSelection && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progress.message}</span>
            <span>{Math.round(progress.progress)}%</span>
          </div>
          <Progress value={progress.progress} className="h-1.5" />
        </div>
      )}

      {shouldDisplayPostSelection && (
        <div className="space-y-2 w-full border-2 border-dashed border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between w-full">
            {importTask.total &&
              importTask.total > importTask.result!.length && (
                <p className="text-xs text-muted-foreground">
                  {importTask.total - importTask.result!.length} posts couldn't
                  be parsed
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

      {shouldDisplayEmptyResult && (
        <Alert>
          <AlertDescription className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
            No posts were found at this URL. Try a different URL or check if the
            blog is accessible.
          </AlertDescription>
        </Alert>
      )}

      {!isImporting &&
        !shouldDisplayPostSelection &&
        !shouldDisplayEmptyResult && (
          <div className="space-y-2 border border-muted rounded-lg p-4">
            <p className="text-sm font-medium text-muted-foreground flex items-center">
              <Info className="h-4 w-4 mr-2 text-primary" />
              Try with these examples:
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {exampleUrls.map((example) => (
                <Card
                  key={example.name}
                  className="border-dashed cursor-pointer transition-all hover:border-primary/30 hover:bg-primary/5"
                  onClick={() => setUrl(example.url)}
                >
                  <CardContent className="p-3 flex flex-col">
                    <div className="text-sm font-medium">{example.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {example.url}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      <div className="text-sm text-foreground/60">
        If you import post failed, get help from{' '}
        <a
          href="https://discord.gg/nyVpH9njDu"
          target="_blank"
          className="text-brand"
        >
          our discord
        </a>
        .
      </div>
    </div>
  )
}

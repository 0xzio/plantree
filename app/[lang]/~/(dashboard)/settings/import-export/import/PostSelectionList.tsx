import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ImportPostData } from '@/hooks/usePostImportTask'
import { Calendar, FileText, Link as LinkIcon, Loader2 } from 'lucide-react'

interface PostSelectionListProps {
  posts: ImportPostData[]
  isImporting: boolean
  onImport: (posts: ImportPostData[]) => Promise<void>
}

export function PostSelectionList({
  posts,
  isImporting,
  onImport,
}: PostSelectionListProps) {
  const [selectedPosts, setSelectedPosts] = useState<Record<number, boolean>>(
    posts.reduce((acc, _, index) => ({ ...acc, [index]: true }), {}),
  )
  const [importing, setImporting] = useState(false)

  useEffect(() => {
    setSelectedPosts(posts.reduce((acc, _, index) => ({ ...acc, [index]: true }), {}))
  }, [posts])

  const handleToggleAll = (checked: boolean) => {
    setSelectedPosts(
      posts.reduce((acc, _, index) => ({ ...acc, [index]: checked }), {}),
    )
  }

  const handleTogglePost = (index: number, checked: boolean) => {
    setSelectedPosts((prev) => ({ ...prev, [index]: checked }))
  }

  const handleImport = async () => {
    setImporting(true)
    const postsToImport = posts.filter((_, index) => selectedPosts[index])
    await onImport(postsToImport)
    setImporting(false)
  }

  const selectedCount = Object.values(selectedPosts).filter(Boolean).length

  return (
    <div className="flex flex-col space-y-4 overflow-hidden">
      <div className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectedCount === posts.length}
            onCheckedChange={(checked) => handleToggleAll(!!checked)}
            aria-label={`Select all ${posts.length} posts`}
            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <label
            htmlFor="select-all"
            className="text-sm font-medium flex items-center cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
            <span>Select all posts</span>
            <Badge variant="outline" className="ml-2 px-1.5 py-0 h-5 text-xs">
              {selectedCount}/{posts.length}
            </Badge>
          </label>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleImport}
                disabled={importing || selectedCount === 0}
                size="sm"
                className="transition-all"
                variant={selectedCount > 0 ? 'default' : 'outline'}
              >
                {importing ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Importing...
                  </>
                ) : (
                  `Import ${selectedCount} post${selectedCount !== 1 ? 's' : ''}`
                )}
              </Button>
            </TooltipTrigger>
            {selectedCount === 0 && (
              <TooltipContent>
                <p>Select at least one post to import</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="overflow-hidden border rounded-md">
        <ScrollArea className="h-52">
          <div className="divide-y">
            {posts.map((post, index) => (
              <div
                key={index}
                className={`
                  p-3 cursor-pointer transition-colors flex items-start
                  ${selectedPosts[index] ? 'bg-primary/5' : 'hover:bg-muted/50'}
                `}
                onClick={() => handleTogglePost(index, !selectedPosts[index])}
              >
                <Checkbox
                  id={`post-${index}`}
                  className="mt-1 mr-3shrink-0 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  checked={selectedPosts[index]}
                  onCheckedChange={(checked) =>
                    handleTogglePost(index, !!checked)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1 min-w-0">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-sm font-medium line-clamp-1">
                          {post.title || 'Untitled Post'}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        align="start"
                        className="max-w-[300px]"
                      >
                        <p className="text-sm break-words">
                          {post.title || 'Untitled Post'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    {post.contentFormat && (
                      <Badge
                        variant="outline"
                        className="mr-2 px-1 py-0 h-4 text-[10px] bg-muted/30"
                      >
                        {post.contentFormat}
                      </Badge>
                    )}

                    {post.url && (
                      <span
                        className="flex items-center mr-2 truncate max-w-[150px]"
                        title={post.url}
                      >
                        <LinkIcon className="h-3 w-3 mr-1 opacity-70" />
                        {new URL(post.url).hostname}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {importing && (
        <div className="text-center text-sm text-muted-foreground animate-pulse">
          Converting and importing posts...
        </div>
      )}
    </div>
  )
}

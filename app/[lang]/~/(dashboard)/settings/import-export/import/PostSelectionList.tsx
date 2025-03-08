import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ImportPostData } from '@/hooks/usePostImportTask'
import { Loader2 } from 'lucide-react'

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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectedCount === posts.length}
            onCheckedChange={(checked) => handleToggleAll(!!checked)}
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            Select all posts ({selectedCount}/{posts.length})
          </label>
        </div>
        <Button
          onClick={handleImport}
          disabled={importing || selectedCount === 0}
          size="sm"
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
      </div>

      <div className="overflow-hidden">
        <ScrollArea className="h-52 rounded-md">
          <div className="space-y-2">
            {posts.map((post, index) => (
              <Card
                key={index}
                className="overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleTogglePost(index, !selectedPosts[index])}
              >
                <CardContent className="p-2 flex items-center">
                  <Checkbox
                    id={`post-${index}`}
                    className="mr-2 flex-shrink-0"
                    checked={selectedPosts[index]}
                    onCheckedChange={(checked) =>
                      handleTogglePost(index, !!checked)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {post.title || 'Untitled Post'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

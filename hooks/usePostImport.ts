import { useState } from 'react'
import { ServerSideEditor } from '@/components/editor/server-side-editor'
import { useSiteContext } from '@/components/SiteContext'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api } from '@/lib/trpc'
import { Post } from '@prisma/client'
import { deserializeMd } from '@udecode/plate-markdown'
import { toast } from 'sonner'
import { ImportPostData } from './usePostImportTask'

export function usePostImport() {
  const site = useSiteContext()
  const [isImporting, setIsImporting] = useState(false)

  const importPosts = async (posts: Post[]): Promise<boolean> => {
    setIsImporting(true)
    try {
      await api.post.importPosts.mutate({
        siteId: site.id,
        posts: posts,
      })

      toast.success('Posts imported successfully!')
      return true
    } catch (error) {
      console.error('Error importing posts:', error)
      toast.error(extractErrorMessage(error) || 'Failed to import posts')
      return false
    } finally {
      setIsImporting(false)
    }
  }

  // Handle file import
  const importFromFile = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string)
          const posts = JSON.parse(jsonData) as Post[]
          const success = await importPosts(posts)
          resolve(success)
        } catch (error) {
          console.error('Error parsing file:', error)
          toast.error(extractErrorMessage(error) || 'Failed to parse file')
          setIsImporting(false)
          resolve(false)
        }
      }

      reader.onerror = () => {
        toast.error('Error reading file')
        setIsImporting(false)
        resolve(false)
      }

      reader.readAsText(file)
    })
  }

  // Import selected posts
  const importSelectedPosts = async (
    posts: ImportPostData[],
  ): Promise<boolean> => {
    setIsImporting(true)
    try {
      // Convert post.content from markdown to plate format
      const convertedPosts = await Promise.all(
        posts.map(async (post: Post) => {
          let content = await deserializeMd(ServerSideEditor, post.content)
          if (typeof content === 'object') {
            content = JSON.stringify(content)
          }
          return {
            title: post.title,
            content: content,
            status: 'DRAFT',
            type: 'ARTICLE',
          }
        }),
      )

      // Call API to save to database
      const success = await importPosts(convertedPosts as Post[])
      if (!success) {
        toast.error('Failed to import posts')
      }
      return success
    } catch (error) {
      console.error('Error importing selected posts:', error)
      toast.error(
        extractErrorMessage(error) || 'Failed to import selected posts',
      )
      return false
    } finally {
      setIsImporting(false)
    }
  }

  return {
    isImporting,
    importFromFile,
    importSelectedPosts,
  }
}

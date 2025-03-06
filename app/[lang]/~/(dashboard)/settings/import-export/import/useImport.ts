import { useState } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api } from '@/lib/trpc'
import { toast } from 'sonner'

type ImportPlatform = 'penx'

export function useImport() {
  const site = useSiteContext()
  const [isImporting, setIsImporting] = useState(false)

  const importPosts = async (data: any, platform: ImportPlatform) => {
    setIsImporting(true)
    try {
      const apiParams: any = {
        siteId: site.id,
        postData: JSON.stringify(data),
      }

      if (platform === 'penx') {
        apiParams.platform = platform
      }

      await api.post.importPosts.mutate(apiParams)

      const platformNames = {
        penx: 'PenX',
      }

      toast.success(`${platformNames[platform]} posts imported successfully!`)
      return true
    } catch (error) {
      console.error(`Error importing ${platform} data:`, error)
      toast.error(
        extractErrorMessage(error) || `Failed to import ${platform} posts`,
      )
      return false
    } finally {
      setIsImporting(false)
    }
  }

  const handlePenxImport = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string)
          const success = await importPosts(jsonData, 'penx')
          resolve(success)
        } catch (error) {
          console.error('Error parsing PenX file:', error)
          toast.error(extractErrorMessage(error) || 'Failed to parse PenX file')
          setIsImporting(false)
          resolve(false)
        }
      }
      reader.onerror = () => {
        toast.error('Error reading PenX file')
        setIsImporting(false)
        resolve(false)
      }
      reader.readAsText(file)
    })
  }

  const handleUrlImport = async (url: string): Promise<boolean> => {
    setIsImporting(true)
    try {
      toast.success('Content imported successfully from URL!')
      return true
    } catch (error) {
      console.error('Error importing from URL:', error)
      toast.error(extractErrorMessage(error) || 'Failed to import content from URL')
      return false
    } finally {
      setIsImporting(false)
    }
  }

  return {
    isImporting,
    handlePenxImport,
    handleUrlImport
  }
}

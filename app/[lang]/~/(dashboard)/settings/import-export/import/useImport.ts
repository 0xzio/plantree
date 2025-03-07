
import { useState, useEffect, useRef } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api } from '@/lib/trpc'
import { toast } from 'sonner'

export type ImportTaskStatus =
  | 'pending'    // Waiting to be processed
  | 'extracting' // Extracting web content
  | 'analyzing'  // Analyzing content
  | 'converting' // Converting format
  | 'completed'  // Task completed
  | 'failed'     // Task failed

export interface PostData {
  title: string
  content: string
  contentFormat?: 'html' | 'markdown' | 'plate' // Format of the content
  url?: string
}

export interface ImportTask {
  id: string
  url: string
  siteId: string
  status: ImportTaskStatus
  progress: number
  error?: string
  total?: number // Total number of items to parse
  result?: PostData[]
  createdAt: Date
  updatedAt: Date
}

// Status message mapping
const STATUS_MESSAGES = {
  pending: 'Waiting to process...',
  extracting: 'Extracting content from URL...',
  analyzing: 'Analyzing content...',
  converting: 'Converting to posts...',
  completed: 'Import completed!',
  failed: 'Import failed'
}

export function useImport() {
  const site = useSiteContext()
  const [isImporting, setIsImporting] = useState(false)
  const [importTask, setImportTask] = useState<ImportTask | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearTimeout(pollingIntervalRef.current)
      }
    }
  }, [])

  // Start polling for task status
  const startPolling = (taskId: string) => {
    const poll = async () => {
      const shouldContinue = await pollTaskStatus(taskId)
      if (shouldContinue) {
        pollingIntervalRef.current = setTimeout(poll, 2000)
      }
    }
    poll()
  }

  // Poll for task status
  const pollTaskStatus = async (taskId: string): Promise<boolean> => {
    try {
      const task = await api.postImport.getImportTaskStatus.query({ taskId })
      setImportTask(task)

      // If the task is completed or failed, stop polling
      if (task.status === 'completed' || task.status === 'failed') {
        clearPolling()
        setIsImporting(false)
        
        if (task.status === 'completed') {
          if (task.result && task.result.length > 0) {
            toast.success(`Found ${task.result.length} posts from URL`)
          } else {
            toast.info('No content was found to import')
          }
        } else {
          toast.error(task.error || 'Import failed')
        }
        
        return false
      }
      
      // Continue polling for in-progress tasks
      return true
    } catch (error) {
      console.error('Error polling task status:', error)
      clearPolling()
      setIsImporting(false)
      toast.error(extractErrorMessage(error) || 'Failed to check import status')
      return false
    }
  }

  // Clear polling interval
  const clearPolling = () => {
    if (pollingIntervalRef.current) {
      clearTimeout(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }

  // Import posts from JSON data
  const importFileData = async (data: any): Promise<boolean> => {
    setIsImporting(true)
    try {
      await api.post.importPosts.mutate({
        siteId: site.id,
        postData: JSON.stringify(data),
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

  // Handle PenX file import
  const importFromFile = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string)
          const success = await importFileData(jsonData)
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

  // Handle URL import
  const importFromUrl = async (url: string): Promise<boolean> => {
    setIsImporting(true)
    setImportTask(null)
    
    try {
      // Submit URL to start import task
      const task = await api.postImport.createImportTask.mutate({
        siteId: site.id,
        url
      })
      
      setImportTask(task)
      startPolling(task.id)
      return true
    } catch (error) {
      console.error('Error starting URL import:', error)
      toast.error(extractErrorMessage(error) || 'Failed to start URL import')
      setIsImporting(false)
      return false
    }
  }

  // Get progress percentage and status message
  const getImportProgress = () => {
    if (!importTask) return { progress: 0, message: 'Preparing import...' }
    
    const message = importTask.status === 'failed' 
      ? `${STATUS_MESSAGES.failed}: ${importTask.error || 'Unknown error'}`
      : STATUS_MESSAGES[importTask.status]
    
    return {
      progress: importTask.progress,
      message
    }
  }

  // Import selected posts
  const importSelectedPosts = async (posts: PostData[]): Promise<boolean> => {
    setIsImporting(true)
    try {
      // todo Convert post.content from markdown to plate format
      // todo Call API to save to database
      return true
    } catch (error) {
      console.error('Error importing selected posts:', error)
      toast.error(extractErrorMessage(error) || 'Failed to import selected posts')
      return false
    } finally {
      setIsImporting(false)
    }
  }

  return {
    isImporting,
    importTask,
    getImportProgress,
    importFromFile,
    importFromUrl,
    importSelectedPosts
  }
}


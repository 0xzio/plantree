import { useState } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api } from '@/lib/trpc'
import { toast } from 'sonner'

type ImportPlatform = 'penx' | 'paragraph' | 'substack'

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
        paragraph: 'Paragraph',
        substack: 'Substack',
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

  const handleParagraphImport = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const csvText = e.target?.result as string
          const parsedData = parseParagraphCsv(csvText)
          const success = await importPosts(parsedData, 'paragraph')
          resolve(success)
        } catch (error) {
          console.error('Error parsing Paragraph file:', error)
          toast.error(
            extractErrorMessage(error) || 'Failed to parse Paragraph file',
          )
          setIsImporting(false)
          resolve(false)
        }
      }
      reader.onerror = () => {
        toast.error('Error reading Paragraph file')
        setIsImporting(false)
        resolve(false)
      }
      reader.readAsText(file)
    })
  }

  const handleSubstackImport = async (
    csvFile: File,
    htmlFiles: FileList,
  ): Promise<boolean> => {
    setIsImporting(true)
    try {
      const csvData = await readFileAsText(csvFile)
      const parsedCsv = parseCsv(csvData)

      const htmlContents: Record<string, string> = {}

      for (let i = 0; i < htmlFiles.length; i++) {
        const file = htmlFiles[i]
        const filename = file.name
        const content = await readFileAsText(file)
        htmlContents[filename] = content
      }

      const substackData = {
        posts: parsedCsv,
        htmlContents,
      }

      const success = await importPosts(substackData, 'substack')
      return success
    } catch (error) {
      console.error('Error importing Substack data:', error)
      toast.error(
        extractErrorMessage(error) || 'Failed to import Substack content',
      )
      return false
    } finally {
      setIsImporting(false)
    }
  }

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = (e) => reject(e)
      reader.readAsText(file)
    })
  }

  const parseParagraphCsv = (csvText: string) => {
    const rows = csvText.split(/\r?\n/)
    if (rows.length === 0) return []

    const headers = parseCSVRow(rows[0])

    const posts = rows
      .slice(1)
      .filter((row) => row.trim())
      .map((row) => {
        const values = parseCSVRow(row)
        const post: Record<string, any> = {}

        headers.forEach((header, index) => {
          let value: any = values[index] || ''

          if (
            value &&
            (header === 'draftFreeJson' || header.includes('Json'))
          ) {
            try {
              value = JSON.parse(value)
            } catch (e) {
              // Keep original string if parsing fails
            }
          }

          if (value === 'TRUE') value = true
          if (value === 'FALSE') value = false

          if (
            header === 'createdAt' ||
            header === 'publishedAt' ||
            header.includes('updatedAt')
          ) {
            if (value && typeof value === 'string') {
              try {
                value = new Date(value).toISOString()
              } catch (e) {
                // Keep original string if date parsing fails
              }
            }
          }

          post[header] = value
        })

        return transformParagraphPost(post)
      })

    return posts
  }

  const transformParagraphPost = (paragraphPost: Record<string, any>) => {
    return {
      title: paragraphPost.title || 'Untitled Post',
      content: extractContentFromDraft(paragraphPost.draftFreeJson),
      status: paragraphPost.published ? 'published' : 'draft',
      publishedAt: paragraphPost.published ? paragraphPost.createdAt : null,
      createdAt: paragraphPost.createdAt,
      updatedAt: paragraphPost.publisherUpdatedAt || paragraphPost.createdAt,
      slug: generateSlugFromTitle(paragraphPost.title),
      excerpt: extractExcerptFromDraft(paragraphPost.draftFreeJson),
      coverImage: paragraphPost.post_precover_imgslug || null,
      originalData: paragraphPost, // Keep original data for reference
    }
  }

  const extractContentFromDraft = (draftJson: any) => {
    if (!draftJson) return ''

    try {
      if (typeof draftJson === 'string') {
        try {
          draftJson = JSON.parse(draftJson)
        } catch (e) {
          return draftJson
        }
      }

      if (draftJson.blocks) {
        return draftJson.blocks
          .map((block: any) => block.text || '')
          .filter(Boolean)
          .join('\n\n')
      }

      return JSON.stringify(draftJson)
    } catch (e) {
      console.error('Error extracting content from draft:', e)
      return ''
    }
  }

  const extractExcerptFromDraft = (draftJson: any) => {
    const content = extractContentFromDraft(draftJson)
    return content.substring(0, 160) + (content.length > 160 ? '...' : '')
  }

  const generateSlugFromTitle = (title: string) => {
    if (!title) return ''
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
  }

  const parseCSVRow = (row: string): string[] => {
    const result: string[] = []
    let inQuotes = false
    let currentValue = ''

    for (let i = 0; i < row.length; i++) {
      const char = row[i]
      const nextChar = row[i + 1]

      if (char === '"' && !inQuotes) {
        // Start quotes
        inQuotes = true
      } else if (char === '"' && nextChar === '"') {
        // Escaped quotes
        currentValue += '"'
        i++ // Skip next quote
      } else if (char === '"') {
        // End quotes
        inQuotes = false
      } else if (char === ',' && !inQuotes) {
        // Column separator
        result.push(currentValue)
        currentValue = ''
      } else {
        // Normal character
        currentValue += char
      }
    }

    // Add the last column
    result.push(currentValue)

    return result
  }

  const parseCsv = (csvText: string) => {
    const lines = csvText.split('\n')
    const headers = lines[0].split(',').map((h) => h.trim())

    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(',')
        const obj: Record<string, string> = {}

        headers.forEach((header, index) => {
          obj[header] = values[index]?.trim() || ''
        })

        return obj
      })
  }

  return {
    isImporting,
    handlePenxImport,
    handleParagraphImport,
    handleSubstackImport,
  }
}

import { Dispatch, SetStateAction, useMemo } from 'react'
import { usePaletteDrawer } from '@/hooks'
import { usePages } from '@/hooks/usePages'
import { usePosts } from '@/hooks/usePosts'
import { useRouter } from '@/lib/i18n'
import { File } from 'lucide-react'
import { LoadingDots } from '../icons/loading-dots'
import { CommandGroup, CommandItem } from './command-components'
import { useOpen } from './hooks/useOpen'
import { useSearch } from './hooks/useSearch'

interface Props {
  heading?: string
  isRecent?: boolean
}

export function SearchPageList({ heading = '', isRecent = false }: Props) {
  const { close } = useOpen()
  const { data = [], isLoading } = usePosts()
  const pages = isRecent ? data.slice(0, 20) : data
  const { search, setSearch } = useSearch()
  const q = search.replace(/^@(\s+)?/, '') || ''
  const paletteDrawer = usePaletteDrawer()
  const { push } = useRouter()

  const filteredItems = useMemo(() => {
    if (!q) return pages
    const items = pages.filter(({ title = '' }) => {
      return title?.toLowerCase().includes(q.toLowerCase())
    })

    return items
  }, [pages, q])

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  if (!filteredItems.length) {
    return (
      <div className="text-sm flex items-center justify-center h-16">
        No results found.
      </div>
    )
  }

  return (
    <>
      <CommandGroup heading={heading}>
        {filteredItems.map((item) => {
          return (
            <CommandItem
              key={item.id}
              value={item.id}
              className=""
              onSelect={() => {
                paletteDrawer?.close()
                close()
                setSearch('')
                push(`/~/page?id=${item.id}`)
              }}
            >
              <File size={16} />
              {item.title || 'Untitled'}
            </CommandItem>
          )
        })}
      </CommandGroup>
    </>
  )
}

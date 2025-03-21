'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Badge } from '@/components/ui/badge'
import { useSite } from '@/hooks/useSite'
import { queryClient } from '@/lib/queryClient'
import { trpc } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { useLoading } from './hooks/useLoading'
import { useThemeName } from './hooks/useThemeName'

const themes = [
  {
    name: 'Minimal',
    value: 'minimal',
  },
  {
    name: 'Sue',
    value: 'sue',
  },
  {
    name: 'Aside',
    value: 'aside',
  },
  {
    name: 'Paper',
    value: 'paper',
  },
  {
    name: 'Publication',
    value: 'publication',
  },
  {
    name: 'Square',
    value: 'square',
  },
  {
    name: 'Micro',
    value: 'micro',
  },
  {
    name: 'Wide',
    value: 'wide',
  },
  {
    name: 'Maple',
    value: 'maple',
  },
  {
    name: 'Card',
    value: 'card',
  },
  {
    name: 'Garden',
    value: 'garden',
  },
  {
    name: 'Docs',
    value: 'docs',
  },
]

export function ThemeList() {
  const site = useSiteContext()
  const { themeName, setThemeName } = useThemeName()
  const { setLoading } = useLoading()

  // console.log('site======>:', site.themeName)

  return (
    <div className="w-52">
      <div className="">
        {themes.map((item, index) => (
          <div
            key={item.value}
            className={cn(
              'border border-foreground/5 p-4 cursor-pointer transition-all hover:bg-foreground/5 flex items-center justify-between group text-foreground/60 hover:text-foreground',
              index === 0 && 'rounded-tl-md rounded-tr-md',
              index === themes.length - 1 && 'rounded-bl-md rounded-br-md',
              themeName === item.value && 'bg-foreground/5 text-foreground',
            )}
            onClick={() => {
              setThemeName(item.value)
              setLoading(true)
              setTimeout(() => {
                setLoading(false)
              })
            }}
          >
            <div className="text-lg font-bold">{item.name}</div>
            {site.themeName === item.value && (
              <Badge variant="success">Current</Badge>
            )}

            {site.themeName !== item.value && (
              <UseButton themeName={item.value} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function UseButton({ themeName }: { themeName: string }) {
  const site = useSiteContext()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()
  const { setThemeName } = useThemeName()
  return (
    <Badge
      className="hidden group-hover:flex transition-all w-12 justify-center"
      onClick={async (e) => {
        e.stopPropagation()
        await mutateAsync({
          id: site.id,
          themeName,
        })

        queryClient.setQueriesData(
          { queryKey: ['current_site'] },
          {
            ...site,
            themeName,
          },
        )
        // setThemeName(themeName)
      }}
    >
      {isPending ? <LoadingDots /> : 'Use'}
    </Badge>
  )
}

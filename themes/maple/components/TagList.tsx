'use client'

import { Link, usePathname } from '@/lib/i18n'
import { Tag } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { slug } from 'github-slugger'

interface PostListWithTagProps {
  tags: Tag[]
}

export function TagList({ tags = [] }: PostListWithTagProps) {
  const pathname = usePathname()!

  return (
    <ul className="flex flex-wrap gap-x-1 w-full justify-center">
      <li className="my-3">
        <Link
          href="/"
          className={cn(
            'py-2 text-foreground/60 rounded-full hover:bg-foreground/6 px-4',
            pathname === '/' && 'text-foreground bg-foreground/6',
          )}
        >
          All
        </Link>
      </li>

      {tags.map((t) => {
        return (
          <li key={t.id} className="my-3">
            <Link
              href={`/tags/${slug(t.name)}`}
              className={cn(
                'py-2 text-foreground/60 rounded-full hover:bg-foreground/6 px-4',
                decodeURI(pathname.split('/tags/')[1]) === slug(t.name) &&
                  'text-foreground bg-foreground/6 py-2 px-4',
              )}
              aria-label={`View posts tagged ${t.name}`}
            >
              {`${t.name}`}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

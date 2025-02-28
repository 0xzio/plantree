'use client'

import { Tag } from '@/lib/theme.types'
import { slug } from 'github-slugger'
import { usePathname } from '@/lib/i18n'
import Link from './Link'

interface PostListWithTagProps {
  tags: Tag[]
}

export function TagList({ tags = [] }: PostListWithTagProps) {
  const pathname = usePathname()!

  return (
    <ul className="flex flex-wrap gap-x-5 w-full justify-center">
      {tags.map((t) => {
        return (
          <li key={t.id} className="my-3">
            {decodeURI(pathname.split('/tags/')[1]) === slug(t.name) ? (
              <h3 className="inline py-2 text-brand">#{`${t.name}`}</h3>
            ) : (
              <Link
                href={`/tags/${slug(t.name)}`}
                className="py-2 text-foreground/60 hover:text-brand dark:hover:text-brand rounded-full"
                aria-label={`View posts tagged ${t.name}`}
              >
                #{`${t.name}`}
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}

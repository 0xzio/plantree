'use client'

import { Link, usePathname } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'

interface Props {}

export function PostsNav({}: Props) {
  const pathname = usePathname()

  const Paths = {
    published: '/~/posts',
    drafts: '/~/posts/drafts',
    archived: '/~/posts/archived',
  }

  const linkClassName = (path: string) =>
    cn(
      'inline-flex item-center justify-center py-1.5 border-b-2 -mb-[1px]',
      path !== pathname && 'border-transparent',
      path === pathname && 'border-foreground/80',
    )

  return (
    <div className="flex border-b border-foreground/10 gap-8">
      <Link href={Paths.drafts} className={linkClassName(Paths.drafts)}>
        <Trans>Drafts</Trans>
      </Link>

      <Link href={Paths.published} className={linkClassName(Paths.published)}>
        <Trans>Published</Trans>
      </Link>

      <Link href={Paths.archived} className={linkClassName(Paths.archived)}>
        <Trans>Archived</Trans>
      </Link>
    </div>
  )
}

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Link } from '@/lib/i18n'
import { SeriesWithPosts } from '@/lib/theme.types'
import { getUrl } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { SeriesType } from '@prisma/client'

interface Props {
  series: SeriesWithPosts
}
export function SeriesInfo({ series }: Props) {
  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-2">
        <Avatar className="w-20 h-20">
          <AvatarImage src={getUrl(series.logo || '')} />
          <AvatarFallback>{series.name.slice(0, 1)}</AvatarFallback>
        </Avatar>

        <div className="flex items-center gap-2">
          <Link href={`/series/${series.slug}`} className="text-xl font-bold">
            {series.name}
          </Link>
        </div>
        <div className="text-foreground/60">{series.description}</div>
      </div>
    </div>
  )
}

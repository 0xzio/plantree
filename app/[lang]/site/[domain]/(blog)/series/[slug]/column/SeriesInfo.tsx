import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
          <h2 className="text-xl font-bold">{series.name}</h2>
          {series.seriesType === SeriesType.BOOK && (
            <Badge>
              <Trans>Book</Trans>
            </Badge>
          )}

          {series.seriesType === SeriesType.COLUMN && (
            <Badge>
              <Trans>Column</Trans>
            </Badge>
          )}
        </div>
        <div className="text-foreground/60">{series.description}</div>
      </div>
    </div>
  )
}

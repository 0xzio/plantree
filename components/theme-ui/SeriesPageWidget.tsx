import { Image } from '@/components/Image'
import { Link } from '@/lib/i18n'
import { Site } from '@/lib/theme.types'
import { cn, getUrl } from '@/lib/utils'
import { Series } from '@prisma/client'

interface Props {
  site: Site
  className?: string
}

export function SeriesPageWidget({ site, className }: Props) {
  return (
    <div className={cn('flex md:flex-row flex-col flex-wrap gap-8', className)}>
      {site.series.map((item) => (
        <SeriesItem key={item.id} series={item} />
      ))}
    </div>
  )
}

export function SeriesItem({ series: series }: { series: Series }) {
  return (
    <Link
      href={`/series/${series.slug}`}
      key={series.id}
      className="bg-foreground/5 rounded-lg p-5 flex flex-col items-center gap-3 w-full md:max-w-[400px] flex-1 hover:scale-105 transition-all"
    >
      <div className="flex justify-center">
        <Image
          width={200}
          height={200}
          src={getUrl(series.logo!)}
          alt=""
          className="size-20"
        />
      </div>
      <h2 className="text-lg font-semibold">{series.name}</h2>
      <div className="text-foreground/60 text-center">{series.description}</div>
    </Link>
  )
}

'use client'

import { Image } from '@/components/Image'
import { Button } from '@/components/ui/button'
import { Link } from '@/lib/i18n'
import { trpc } from '@/lib/trpc'
import { getUrl } from '@/lib/utils'
import { RouterOutputs } from '@/server/_app'

interface Props {
  series: RouterOutputs['series']['getSeriesList']['0']
}

export function SeriesItem({ series: series }: Props) {
  return (
    <Link
      href={`/~/series/${series.id}`}
      key={series.id}
      className="bg-foreground/5 rounded-lg p-5 flex flex-col items-center gap-3"
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
      {/* <div className="mt-auto">
        <div className="flex justify-center gap-2">
          <Button variant="outline-solid">Setup payment</Button>
          <Button variant="outline-solid">Setup payment</Button>
        </div>
      </div> */}
    </Link>
  )
}

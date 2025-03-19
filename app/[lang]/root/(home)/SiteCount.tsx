import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MySite } from '@/lib/types'
import { getUrl } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'

interface Props {
  count: number
  sites: MySite[]
}
export function SiteCount({ count, sites }: Props) {
  return (
    <div className="flex items-center gap-2">
      {sites.slice(0, 5).map((site) => (
        <Avatar key={site.id} className="-ml-4 ring-2 ring-background">
          <AvatarImage src={getUrl(site.logo!)} />
          <AvatarFallback>{site.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
      ))}
      <div className="flex flex-col">
        <div className="h-6 leading-none inline-flex">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <span
                key={i}
                className="icon-[material-symbols--star-rounded] w-6 h-6 leading-none bg-yellow-500 -bottom-1"
              ></span>
            ))}
        </div>

        <div className="space-x-1">
          <span className="font-bold">{count}</span>
          <span className="text-sm">
            <Trans>individual blogs created</Trans>
          </span>
        </div>
      </div>
    </div>
  )
}

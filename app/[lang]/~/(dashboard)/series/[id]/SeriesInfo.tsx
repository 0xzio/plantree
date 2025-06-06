'use client'

import { CreatePostButton } from '@/components/CreatePostButton'
import { useSeriesContext } from '@/components/SeriesContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, getUrl } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { SeriesType } from '@prisma/client'
import { PencilIcon, PlusIcon } from 'lucide-react'
import { useSeriesDialog } from '../SeriesDialog/useSeriesDialog'
import { useCategoryNodeDialog } from './CatalogueBox/CategoryNodeDialog/useCategoryNodeDialog'

interface Props {
  className?: string
}

export function SeriesInfo({ className }: Props) {
  const series = useSeriesContext()
  const { setState } = useSeriesDialog()
  const categoryNodeDialog = useCategoryNodeDialog()
  return (
    <div className={cn('flex justify-between', className)}>
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={getUrl(series.logo || '')} />
          <AvatarFallback>{series.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div>
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
      <div className="flex gap-1">
        <Button
          variant="secondary"
          size="icon"
          className="size-9"
          onClick={() => {
            setState({
              isOpen: true,
              series,
            })
          }}
        >
          <PencilIcon size={20} className="text-foreground/60" />
        </Button>

        <CreatePostButton
          seriesId={series.id}
          onAddCategory={async () => {
            console.log('gogo......xxxxxxxxxx')
            categoryNodeDialog.setState({
              parentId: '',
              isOpen: true,
            })
          }}
        >
          <Button size="icon" className="size-9">
            <PlusIcon size={20} className="" />
          </Button>
        </CreatePostButton>
      </div>
    </div>
  )
}

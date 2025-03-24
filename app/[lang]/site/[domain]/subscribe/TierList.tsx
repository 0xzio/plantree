'use client'

import { Site } from '@/lib/theme.types'
import { cn } from '@/lib/utils'
import { Product } from '@prisma/client'
import { TierItem } from './TierItem'

interface Props {
  site: Site
  tiers: Product[]
}

export function TierList({ tiers, site }: Props) {
  return (
    <div
      className={cn('mt-4 flex items-center gap-4 flex-wrap justify-center')}
    >
      {tiers.map((item, index) => {
        return <TierItem key={index} tier={item} site={site} />
      })}
    </div>
  )
}

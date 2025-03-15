import React from 'react'
import { cn } from '@udecode/cn'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'
import { CampaignCard } from './CampaignCard'

export const CampaignElementStatic = ({
  children,
  className,
  ...props
}: SlateElementProps) => {
  const campaignId = props.element.campaignId as string
  if (!campaignId) return null

  return (
    <SlateElement
      className={cn(className, 'm-0 px-0 py-1 flex justify-center')}
      {...props}
    >
      <CampaignCard campaignId={campaignId} />
      {children}
    </SlateElement>
  )
}

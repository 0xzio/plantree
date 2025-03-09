'use client'

import React, { useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {  trpc } from '@/lib/trpc'
import { getUrl } from '@/lib/utils'
import Image from 'next/image'

export function ProductCard({ productId }: { productId: string }) {
  const { data, isLoading } = trpc.product.byId.useQuery(productId)

  if (isLoading || !data) {
    return (
      <div className="min-h-20 flex items-center justify-center">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-foreground/5">
      <div className="flex items-center gap-2">
        {data.image && (
          <Image
            width={64}
            height={64}
            src={getUrl(data.image || '')}
            alt=""
            className="rounded-xl"
          />
        )}
        <div>
          <div className="flex items-center gap-1">
            <div className="text-2xl font-bold">{data.name}</div>
            <div className="text-sm text-foreground/60">
              (${(data.price / 100).toFixed(2)} USD)
            </div>
          </div>
          <div className="text-foreground/60">{data.description}</div>
        </div>
      </div>
      <Button>Buy</Button>
    </div>
  )
}

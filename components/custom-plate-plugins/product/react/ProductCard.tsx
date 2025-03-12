'use client'

import React, { useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { getUrl } from '@/lib/utils'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'

export function ProductCard({ productId }: { productId: string }) {
  const { data, isLoading } = trpc.product.byId.useQuery(productId)
  const [loading, setLoading] = useState(false)
  const checkout = trpc.stripe.buyProductCheckout.useMutation()
  const pathname = usePathname()
  const site = useSiteContext()

  if (isLoading || !data) {
    return (
      <div className="min-h-20 flex items-center justify-center">
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-foreground/5 bg-background">
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
          <div className="flex items-center gap-1 text-foreground">
            <div className="text-2xl font-bold">{data.name}</div>
            <div className="text-sm text-brand">
              (${(data.price / 100).toFixed(2)} USD)
            </div>
          </div>
          <div className="text-foreground/60">{data.description}</div>
        </div>
      </div>
      <Button
        disabled={loading}
        className="w-20"
        onClick={async () => {
          setLoading(true)
          try {
            const res = await checkout.mutateAsync({
              productId,
              siteId: site.id,
              host: window.location.host,
              pathname: pathname!,
            })
            console.log('=======res:', res)
            window.location.href = res.url!
          } catch (error) {
            setLoading(false)
            toast.error(extractErrorMessage(error))
          }
        }}
      >
        {loading ? <LoadingDots className="bg-background" /> : 'Buy'}
      </Button>
    </div>
  )
}

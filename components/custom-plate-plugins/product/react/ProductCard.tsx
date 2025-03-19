'use client'

import React, { useState } from 'react'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
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
  const [amount, setAmount] = useState('1')
  const site = useSiteContext()

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-between p-4 rounded-2xl border border-foreground/5 bg-background h-[100px]">
        <div className="flex items-center gap-2">
          <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-foreground">
              <Skeleton className="h-8 w-40" />
            </div>
            <Skeleton className="h-6 w-full sm:w-64" />
          </div>
        </div>
        <Skeleton className="w-20 h-10" />
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl border border-foreground/5 bg-background h-auto md:h-[100px] gap-y-3">
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
          </div>
          <div className="text-foreground/60">{data.description}</div>
        </div>
      </div>
      <div className="flex flex-col gap-1 items-end">
        <ToggleGroup
          size="sm"
          value={amount}
          className="flex"
          variant="outline"
          onValueChange={(v) => {
            setAmount(v)
          }}
          type="single"
        >
          <ToggleGroupItem value="1" className="">
            1 hours
          </ToggleGroupItem>
          <ToggleGroupItem value="2" className="">
            2 hours
          </ToggleGroupItem>
          <ToggleGroupItem value="3" className="">
            3 hours
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="flex items-center justify-between gap-2">
          {amount && (
            <div className="text-sm">
              ${((Number(amount) * data.price) / 100).toFixed(2)} USD
            </div>
          )}

          <Button
            disabled={loading}
            className="w-20"
            onClick={async () => {
              if (!amount) {
                return toast.info('Please select a duration')
              }

              setLoading(true)
              try {
                const res = await checkout.mutateAsync({
                  productId,
                  siteId: site.id,
                  host: window.location.host,
                  pathname: pathname!,
                  amount: Number(amount),
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
      </div>
    </div>
  )
}

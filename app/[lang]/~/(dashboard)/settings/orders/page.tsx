'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { useSite } from '@/hooks/useSite'
import { useProductDialog } from './ProductDialog/useProductDialog'
import { OrderList } from './OrderList'
import { ProductPriceDialog } from './ProductPriceDialog/ProductPriceDialog'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, site, error } = useSite()
  const { setState } = useProductDialog()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">Orders</div>
      </div>

      <ProductPriceDialog />
      <OrderList site={site} />
    </div>
  )
}

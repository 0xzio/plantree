'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api, trpc } from '@/lib/trpc'
import { getUrl, isValidUUIDv4 } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { cn, withRef } from '@udecode/cn'
import { PlateElement, usePlateEditor } from '@udecode/plate/react'
import Image from 'next/image'
import { setNodes } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { toast } from 'sonner'
import { TProductElement } from '../lib'

export const ProductElement = withRef<typeof PlateElement>((props, ref) => {
  // const editor = usePlateEditor()
  const editor = useSlate()
  const { children, className, nodeProps, ...rest } = props
  const [value, setValue] = useState('')
  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['product'],
    mutationFn: async (id: string) => {
      return await api.product.byId.query(id)
    },
  })

  if (!rest.element.productId) {
    return (
      <PlateElement
        ref={ref}
        className={cn(
          'rounded-2xl p-4 border border-foreground/5 space-y-1',
          className,
        )}
        {...rest}
        contentEditable={false}
      >
        <div className="text-sm text-foreground/60">Enter product ID</div>
        <div className="flex items-center gap-1">
          <Input
            placeholder="Product ID"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            disabled={isPending || !value}
            onClick={async () => {
              try {
                if (!isValidUUIDv4(value)) throw new Error('Invalid product ID')
                await mutateAsync(value)
                const path = ReactEditor.findPath(editor as any, props.element)
                setNodes<TProductElement>(
                  editor as any,
                  { productId: value },
                  { at: path },
                )
              } catch (error) {
                toast.error(
                  extractErrorMessage(error) || 'Failed to load product',
                )
              }
            }}
          >
            Save
          </Button>
        </div>
      </PlateElement>
    )
  }

  return (
    <PlateElement
      ref={ref}
      className={cn('rounded-2xl p-4 border space-y-1', className)}
      {...props}
      contentEditable={false}
    >
      <ProductCard productId={props.element.productId as string} />
      {children}
    </PlateElement>
  )
})

function ProductCard({ productId }: { productId: string }) {
  const { data, isLoading } = trpc.product.byId.useQuery(productId)
  if (isLoading || !data) return <div>Loading...</div>
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

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Space } from '@/domains/Space'
import { spaceAtom, useSpace } from '@/hooks/useSpace'
import { spaceAbi } from '@/lib/abi'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { api } from '@/lib/trpc'
import { wagmiConfig } from '@/lib/wagmi'
import { store } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { toast } from 'sonner'
import { z } from 'zod'
import { useUpdateSpaceDialog } from './useUpdateSpaceDialog'

const FormSchema = z.object({
  siteUrl: z.string().min(1, {
    message: 'site URL must be at least 1 characters.',
  }),
})

export function UpdateSpaceForm() {
  const { space } = useSpace()
  const { setIsOpen } = useUpdateSpaceDialog()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      siteUrl: space.siteUrl,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      // console.log('data:', data)

      const res = await fetch(`/api/ipfs-add?address=${space.address}`, {
        method: 'POST',
        body: JSON.stringify({
          ...space.spaceInfo,
          ...data,
        }),
        headers: { 'Content-Type': 'application/json' },
      }).then((d) => d.json())

      const hash = await writeContract(wagmiConfig, {
        address: space.address,
        abi: spaceAbi,
        functionName: 'updateConfig',
        args: [res.cid, space.stakingRevenuePercent],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      store.set(
        spaceAtom,
        new Space({
          ...space.raw,
          ...data,
          uri: res.cid,
        }),
      )

      toast.success('updated successfully!')
      revalidateMetadata('spaces')
      setIsOpen(false)
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to update. Please try again later.')
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="siteUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Site URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://..."
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>The URL of your site.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-32">
            {loading ? <LoadingDots /> : <p>Save</p>}
          </Button>
        </form>
      </Form>
    </div>
  )
}

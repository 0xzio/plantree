'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import LoadingDots from '@/components/icons/loading-dots'
import { NumberInput } from '@/components/NumberInput'
import { Button } from '@/components/ui/button'
import { DialogHeader } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useApps } from '@/hooks/useApps'
import { spaceFactoryAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { addToIpfs } from '@/lib/addToIpfs'
import { checkChain } from '@/lib/checkChain'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { wagmiConfig } from '@/lib/wagmi'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogTitle } from '@radix-ui/react-dialog'
import { waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { toast } from 'sonner'
import { Address } from 'viem'
import { z } from 'zod'
import { useAppDialog } from './useAppDialog'

const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/

const FormSchema = z.object({
  name: z.string().min(1, { message: 'App name is required' }),
  feePercent: z.string().min(1, { message: 'feePercent is required' }),
  feeReceiver: z
    .string()
    .min(1, { message: 'feeReceiver is required' })
    .regex(ethAddressRegex, { message: 'Invalid Ethereum address' }),
})

export function AppForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen, app } = useAppDialog()
  const { refetch } = useApps()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: app?.uri || '',
      feeReceiver: app?.feeReceiver || '',
      feePercent: app?.feePercent
        ? (precision.toDecimal(app?.feePercent) * 100).toFixed(2)
        : '',
    },
  })
  const feePercent = form.watch('feePercent')

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      await checkChain()

      // const cid = await addToIpfs(
      //   JSON.stringify({
      //     name: data.name,
      //     benefits: data.benefits,
      //   }),
      // )
      let hash: Address

      console.log('=====app:', app)

      if (!app) {
        hash = await writeContract(wagmiConfig, {
          address: addressMap.SpaceFactory,
          abi: spaceFactoryAbi,
          functionName: 'createApp',
          args: [
            data.name,
            data.feeReceiver as Address,
            precision.token(data.feePercent) / BigInt(100),
          ],
        })
      } else {
        hash = await writeContract(wagmiConfig, {
          address: addressMap.SpaceFactory,
          abi: spaceFactoryAbi,
          functionName: 'updateApp',
          args: [
            BigInt(app.id),
            data.name,
            data.feeReceiver as Address,
            precision.token(data.feePercent) / BigInt(100),
          ],
        })
      }

      await waitForTransactionReceipt(wagmiConfig, { hash })

      await refetch()
      setIsOpen(false)
      toast.success('Update App successfully!')
    } catch (error) {
      // console.log('====error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to update App. Please try again.')
    }
    setLoading(false)
  }

  return (
    <Form {...form}>
      <DialogHeader>
        <DialogTitle>{app ? 'Update App' : 'Create App'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Plan name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feeReceiver"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Fee Receiver</FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feePercent"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Fee percent ({feePercent || '0'}%)</FormLabel>
              <FormControl>
                <NumberInput
                  placeholder=""
                  precision={8}
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-32"
          type="submit"
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? <LoadingDots  /> : <p>Confirm</p>}
        </Button>
      </form>
    </Form>
  )
}

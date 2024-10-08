'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import Editor from '@/components/editor/advanced-editor'
import LoadingDots from '@/components/icons/loading-dots'
import { NumberInput } from '@/components/NumberInput'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { PlanStatus } from '@/domains/Plan'
import { useEthPrice } from '@/hooks/useEthPrice'
import { usePlans } from '@/hooks/usePlans'
import { useSpace } from '@/hooks/useSpace'
import { spaceAbi } from '@/lib/abi'
import { addToIpfs } from '@/lib/addToIpfs'
import { checkChain } from '@/lib/checkChain'
import { editorDefaultValue } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { wagmiConfig } from '@/lib/wagmi'
import { zodResolver } from '@hookform/resolvers/zod'
import { waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { toast } from 'sonner'
import { Address } from 'viem'
import { z } from 'zod'
import { useUpdatePlanDialog } from './useUpdatePlanDialog'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Plan name is required' }),
  price: z.string().min(1, { message: 'Price is required' }),
  status: z.string(),
  benefits: z.string().min(1, { message: 'Benefits is required' }),
})

export function UpdatePlanForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen } = useUpdatePlanDialog()
  const { space } = useSpace()
  const { ethPrice } = useEthPrice()
  const { plan } = useUpdatePlanDialog()
  const { refetch } = usePlans()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: plan.status,
      name: plan.name,
      price: plan.getUsdPrice(ethPrice).toFixed(2),
      benefits: plan.benefits,
    },
  })

  const price = form.watch('price')
  const priceBuyPrice = useMemo(() => {
    if (!price || !ethPrice) return 0
    return Number(price) / ethPrice
  }, [price, ethPrice])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      await checkChain()

      const cid = await addToIpfs(
        JSON.stringify({
          name: data.name,
          benefits: data.benefits,
        }),
      )

      const price = precision.token(Number(data.price) / ethPrice)
      const hash = await writeContract(wagmiConfig, {
        address: space.address as Address,
        abi: spaceAbi,
        functionName: 'updatePlan',
        args: [
          plan.id,
          cid,
          price,
          BigInt(0),
          data.status === PlanStatus.ACTIVE,
        ],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      await refetch()
      setIsOpen(false)
      toast.success('Update plan successfully!')
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to update plan. Please try again.')
    }
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="flex gap-8">
          <div className="space-y-6 flex-1 flex-shrink-0">
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
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Subscription price (${price || '0'}/month) =
                    {priceBuyPrice.toFixed(5)} ETH
                  </FormLabel>
                  <FormControl>
                    <NumberInput
                      placeholder=""
                      precision={2}
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      className="gap-3 bg-accent p-1 rounded-lg h-11"
                      value={field.value}
                      onValueChange={(v) => {
                        if (!v) return
                        field.onChange(v)
                      }}
                      type="single"
                    >
                      <ToggleGroupItem
                        className="data-[state=on]:bg-white ring-black bg-accent text-sm font-semibold flex-1 h-full"
                        value={PlanStatus.ACTIVE}
                      >
                        Active
                      </ToggleGroupItem>

                      <ToggleGroupItem
                        value={PlanStatus.INACTIVE}
                        className="data-[state=on]:bg-white ring-black bg-accent text-sm font-semibold flex-1 h-full"
                      >
                        Inactive
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-1 flex-shrink-0">
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem className="w-full h-full">
                  <FormLabel>Benefits</FormLabel>
                  <FormControl>
                    <div className="h-[360px]  border border-neutral-200 rounded-lg overflow-auto">
                      <Editor
                        className="p-3 break-all plan-editor"
                        initialValue={JSON.parse(field.value)}
                        onChange={(v) => {
                          field.onChange(JSON.stringify(v))
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="text-center mt-4">
          <Button
            className="w-64"
            type="submit"
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading ? <LoadingDots color="#808080" /> : <p>Update</p>}
          </Button>
        </div>
      </form>
    </Form>
  )
}

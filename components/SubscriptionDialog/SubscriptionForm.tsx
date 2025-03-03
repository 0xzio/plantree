'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
// import { useQueryEthBalance } from '@/app/(creator-fi)/hooks/useEthBalance'
// import { useTokenBalance } from '@/app/(creator-fi)/hooks/useTokenBalance'
import { LoadingDots } from '@/components/icons/loading-dots'
import { ProfileAvatar } from '@/components/Profile/ProfileAvatar'
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useCheckChain } from '@/hooks/useCheckChain'
import { erc20Abi } from '@/lib/abi'
import { memberAbi, penTokenAbi } from '@/lib/abi/penx'
import { addressMap } from '@/lib/address'
import {
  SECONDS_PER_DAY,
  SECONDS_PER_MONTH,
  SubscriptionType,
} from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { api } from '@/lib/trpc'
import { useSession } from '@/lib/useSession'
import { sleep } from '@/lib/utils'
import { wagmiConfig } from '@/lib/wagmi'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core'
import { toast } from 'sonner'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { z } from 'zod'
import { AmountInput } from './AmountInput'
import { usePlans } from './usePlans'
import { useSubscriptionDialog } from './useSubscriptionDialog'

interface Props {}

const FormSchema = z.object({
  type: z.string(),
  times: z.string().min(1, {
    message: 'Times should not be empty.',
  }),
})

export function SubscriptionForm({}: Props) {
  const { setIsOpen } = useSubscriptionDialog()
  const [loading, setLoading] = useState(false)
  const { getPlanPrice } = usePlans()
  const checkChain = useCheckChain()
  const { address } = useAccount()
  const { data: balance } = useReadContract({
    address: addressMap.PenToken,
    abi: penTokenAbi,
    functionName: 'balanceOf',
    args: [address!],
  })

  const { update } = useSession()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: SubscriptionType.SUBSCRIBE,
      times: '365', // 365 days by default
    },
  })

  const isSubscribe = form.watch('type') === SubscriptionType.SUBSCRIBE
  const days = form.watch('times')

  const cost = useMemo(() => {
    if (!days) return BigInt(0)
    if (isSubscribe) {
      const duration = BigInt(Number(days) * Number(SECONDS_PER_DAY))
      const price = getPlanPrice()
      return (duration * price) / SECONDS_PER_MONTH
    }

    return BigInt(0)
  }, [days, isSubscribe, getPlanPrice])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const isSubscribe = data.type === SubscriptionType.SUBSCRIBE
    checkChain()

    if (balance! <= cost) {
      return toast.error('Insufficient $PEN balance.')
    }

    setLoading(true)

    // const subscription = await readContract(wagmiConfig, {
    //   address: addressMap.Member,
    //   abi: memberAbi,
    //   functionName: 'getSubscription',
    //   args: [address!, 0],
    // })
    // console.log('=====subscription:', subscription)

    try {
      const approveTx = await writeContract(wagmiConfig, {
        address: addressMap.PenToken,
        abi: erc20Abi,
        functionName: 'approve',
        args: [addressMap.Member, cost],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash: approveTx })

      const hash = await writeContract(wagmiConfig, {
        address: addressMap.Member,
        abi: memberAbi,
        functionName: 'subscribe',
        args: [0, cost],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      const increasingDuration = (cost * SECONDS_PER_MONTH) / getPlanPrice()

      await api.plan.subscribe.mutate({
        duration: Number(increasingDuration),
      })

      // await update({ type: 'update-subscription' })
      toast.success('Subscribe successfully!')
      setIsOpen(false)
    } catch (error) {
      console.log('========error:', error)

      const msg = extractErrorMessage(error)
      toast.error(msg)
    }

    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        {/* <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <ToggleGroup
                  className="h-11 gap-3 rounded-lg bg-accent p-1"
                  value={field.value}
                  onValueChange={(v) => {
                    if (!v) return
                    field.onChange(v)
                  }}
                  type="single"
                >
                  <ToggleGroupItem
                    className="h-full flex-1 bg-accent text-sm font-semibold ring-black data-[state=on]:bg-background dark:data-[state=on]:bg-foreground/60"
                    value={SubscriptionType.SUBSCRIBE}
                  >
                    Subscribe
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    value={SubscriptionType.UNSUBSCRIBE}
                    className="h-full flex-1 bg-accent text-sm font-semibold ring-black data-[state=on]:bg-background dark:data-[state=on]:bg-foreground/60"
                  >
                    Unsubscribe
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <div className="space-y-1">
          <div>{isSubscribe ? 'Subscribe' : 'Unsubscribe'} days</div>

          <FormField
            control={form.control}
            name="times"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <AmountInput
                    isSubscribe={isSubscribe}
                    value={field.value}
                    onChange={(v) => {
                      // setAmount(v)
                      field.onChange(v)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex h-6 items-center justify-between">
          <div className="text-sm text-foreground/60">
            Total {isSubscribe ? 'cost' : 'refund'}
          </div>
          <div className="text-sm">
            {precision.toDecimal(cost).toFixed(2)} $PEN
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={loading || !form.formState.isValid}
        >
          {loading ? <LoadingDots /> : 'Confirm'}
        </Button>
      </form>
    </Form>
  )
}

'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import LoadingDots from '@/components/icons/loading-dots'
import { useSpaceContext } from '@/components/SpaceContext'
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
import { useCheckChain } from '@/hooks/useCheckChain'
import { useEthPrice } from '@/hooks/useEthPrice'
import { usePlans } from '@/hooks/usePlans'
import { useWagmiConfig } from '@/hooks/useWagmiConfig'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAddSubscriberDialog } from './useAddSubscriberDialog'

const FormSchema = z.object({
  emails: z.string().min(1, { message: 'email is required' }),
})

export function AddSubscriberForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen } = useAddSubscriberDialog()
  const { ethPrice } = useEthPrice()
  const checkChain = useCheckChain()
  const { refetch } = usePlans()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      emails: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      await checkChain()

      setIsOpen(false)
      refetch()
      toast.success('Add subscribers successfully!')
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to add subscribers. Please try again.')
    }
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="emails"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Add subscribers by email address</FormLabel>
              <FormDescription>
                Support multiple email addresses separated by commas.
              </FormDescription>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !form.formState.isValid || !ethPrice}
        >
          {isLoading ? <LoadingDots /> : <p>Add</p>}
        </Button>
      </form>
    </Form>
  )
}

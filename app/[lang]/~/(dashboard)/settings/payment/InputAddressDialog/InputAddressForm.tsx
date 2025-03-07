'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingDots } from '@/components/icons/loading-dots'
import { NumberInput } from '@/components/NumberInput'
import { useSiteContext } from '@/components/SiteContext'
import { useSpaceContext } from '@/components/SpaceContext'
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
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { queryClient } from '@/lib/queryClient'
import { api } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { useInputAddressDialog } from './useInputAddressDialog'

const FormSchema = z.object({
  address: z.string().min(1, { message: 'address is required' }),
})

export function InputAddressForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen } = useInputAddressDialog()
  const site = useSiteContext()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      address: site.walletAddress || '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)

      await api.site.updateSite.mutate({
        id: site.id,
        ...data,
      })

      queryClient.setQueriesData(
        { queryKey: ['current_site'] },
        {
          ...site,
          walletAddress: data.address,
        },
      )

      setIsOpen(false)
      toast.success('Set address successfully!')
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? <LoadingDots /> : <p>Save</p>}
        </Button>
      </form>
    </Form>
  )
}

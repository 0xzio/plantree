'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PlateEditor } from '@/components/editor/plate-editor'
import { LoadingDots } from '@/components/icons/loading-dots'
import { NumberInput } from '@/components/NumberInput'
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
import { editorDefaultValue } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api, trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { useTierDialog } from './useTierDialog'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Tier name is required' }),
  price: z.string().min(1, { message: 'Price is required' }),
  description: z.string().optional(),
})

export function TierForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen, tier } = useTierDialog()
  const { ethPrice } = useEthPrice()
  const { refetch } = trpc.tier.listSiteTiers.useQuery()

  const isEdit = !!tier

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: tier?.name || '',
      price: tier?.price.toString() || '',
      description: tier?.description || '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)

      if (isEdit) {
        await api.tier.updateTier.mutate({
          id: tier.id,
          name: data.name,
          description: data.description,
        })
      } else {
        await api.tier.addTier.mutate(data)
      }
      await refetch()

      setIsOpen(false)
      toast.success(
        isEdit ? 'Tier updated successfully!' : 'Tier added successfully!',
      )
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
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Tier name</FormLabel>
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
              <FormLabel>Monthly price</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute top-2 left-3">$</span>
                  <NumberInput
                    disabled={isEdit}
                    placeholder=""
                    precision={2}
                    {...field}
                    className="w-full pl-7"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormDescription>
                  Describe the benefits and exclusive content that members can
                  enjoy when they join
                </FormDescription>
                <FormControl>
                  <div className="h-[250px]  border border-foreground/20 rounded-lg overflow-auto prose-neutral prose-p:leading-none">
                    <PlateEditor
                      variant="default"
                      className="min-h-[240px]"
                      value={
                        field.value
                          ? JSON.parse(field.value)
                          : editorDefaultValue
                      }
                      onChange={(v) => {
                        field.onChange(JSON.stringify(v))
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <div>
          <Button
            type="submit"
            className="w-24"
            disabled={isLoading || !form.formState.isValid || !ethPrice}
          >
            {isLoading ? (
              <LoadingDots />
            ) : (
              <span>{isEdit ? 'Update tier' : 'Add tier'}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

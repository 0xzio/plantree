'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PlateEditor } from '@/components/editor/plate-editor'
import { FileUpload } from '@/components/FileUpload'
import { LoadingDots } from '@/components/icons/loading-dots'
import { NumberInput } from '@/components/NumberInput'
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
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api, trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChargeMode, SeriesType } from '@prisma/client'
import { toast } from 'sonner'
import { z } from 'zod'
import { useSeriesDialog } from './useSeriesDialog'

const FormSchema = z.object({
  seriesType: z.nativeEnum(SeriesType),
  logo: z.string().min(1, { message: 'Please upload your avatar' }),
  name: z.string().min(5, {
    message: 'Name must be at least 1 characters.',
  }),
  slug: z.string().min(1, { message: 'Slug is required' }),
  description: z.string(),
  // about: z.string(),
  chargeMode: z.nativeEnum(ChargeMode),
  price: z.string().min(1, { message: 'Price is required' }),
})

export function SeriesForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen, series } = useSeriesDialog()
  const { refetch } = trpc.tier.listSiteTiers.useQuery()

  const isEdit = !!series

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      seriesType: series?.seriesType || SeriesType.COLUMN,
      logo: series?.logo || '',
      name: series?.name || '',
      slug: series?.slug || '',
      price: series?.price.toString() || '',
      description: series?.description || '',
      chargeMode: series?.chargeMode || ChargeMode.PAID_MONTHLY,
    },
  })
  const chargeMode = form.watch('chargeMode')

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)

      if (isEdit) {
        await api.tier.updateTier.mutate({
          id: series.id,
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
          name="seriesType"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Series type</FormLabel>
              <FormControl>
                <ToggleGroup
                  className="w-auto"
                  size="lg"
                  value={field.value}
                  onValueChange={(v) => {
                    if (!v) return
                    field.onChange(v)
                  }}
                  type="single"
                >
                  <ToggleGroupItem className="" value={SeriesType.COLUMN}>
                    Column
                  </ToggleGroupItem>

                  <ToggleGroupItem value={SeriesType.BOOK} className="">
                    Book
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value={SeriesType.COURSE}
                    className=""
                    disabled
                  >
                    Course
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
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
                <FormControl>
                  <Textarea placeholder="" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>logo</FormLabel>
              <FileUpload {...field} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chargeMode"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Charge mode</FormLabel>
              <FormControl>
                <ToggleGroup
                  className="w-auto"
                  size="lg"
                  value={field.value}
                  onValueChange={(v) => {
                    if (!v) return
                    field.onChange(v)
                  }}
                  type="single"
                >
                  <ToggleGroupItem className="" value={ChargeMode.FREE}>
                    Free
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    value={ChargeMode.PAID_ONE_TIME}
                    className=""
                  >
                    One time payment
                  </ToggleGroupItem>
                  <ToggleGroupItem value={ChargeMode.PAID_MONTHLY}>
                    Monthly subscription
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isEdit && chargeMode !== ChargeMode.FREE && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute top-2 left-3 text-foreground">
                      $
                    </span>
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
        )}

        <div>
          <Button
            type="submit"
            className="w-24"
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading ? (
              <LoadingDots />
            ) : (
              <span>{isEdit ? 'Update series' : 'Add series'}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

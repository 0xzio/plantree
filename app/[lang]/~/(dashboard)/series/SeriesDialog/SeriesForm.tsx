'use client'

import { useEffect, useMemo, useState } from 'react'
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
import { useSeriesItem } from '@/hooks/useSeriesItem'
import { editorDefaultValue } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api, trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trans } from '@lingui/react/macro'
import { ChargeMode, SeriesType } from '@prisma/client'
import { slug } from 'github-slugger'
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
  about: z.string().optional(),
  chargeMode: z.nativeEnum(ChargeMode).optional(),
  // price: z.string().optional(),
})

export function SeriesForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen, series } = useSeriesDialog()
  const { refetch: refetchItem } = useSeriesItem()
  const { refetch: refetchList } = trpc.series.getSeriesList.useQuery()

  const isEdit = !!series

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      seriesType: series?.seriesType || SeriesType.COLUMN,
      logo: series?.logo || '',
      name: series?.name || '',
      slug: series?.slug || '',
      // price: series?.product?.price?.toString() || '',
      description: series?.description || '',
      about: series?.about || '',
      chargeMode: series?.chargeMode || ChargeMode.PAID_MONTHLY,
    },
  })

  const chargeMode = form.watch('chargeMode')
  const slugValue = form.watch('slug')

  useEffect(() => {
    if (slugValue === slug(slugValue)) return
    form.setValue('slug', slug(slugValue))
  }, [slugValue, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)

      if (isEdit) {
        await api.series.updateSeries.mutate({
          id: series.id,
          ...data,
        })
        await refetchItem()
      } else {
        await api.series.addSeries.mutate(data)
        await refetchList()
      }

      setIsOpen(false)
      toast.success(
        isEdit ? 'Series updated successfully!' : 'Series added successfully!',
      )
    } catch (error) {
      console.log('error:', error)

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
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Trans>logo</Trans>
              </FormLabel>
              <FileUpload {...field} />
            </FormItem>
          )}
        />
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
                    <Trans>Column</Trans>
                  </ToggleGroupItem>

                  <ToggleGroupItem value={SeriesType.BOOK} className="">
                    <Trans>Book</Trans>
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value={SeriesType.COURSE}
                    className=""
                    disabled
                  >
                    <Trans>Course</Trans>
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
              <FormLabel>
                <Trans>Name</Trans>
              </FormLabel>
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
              <FormLabel>
                <Trans>Slug</Trans>
              </FormLabel>
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
                <FormLabel>
                  <Trans>Description</Trans>
                </FormLabel>
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
          name="about"
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormLabel>About</FormLabel>
                <FormControl>
                  <div className="h-[250px]  border border-foreground/20 rounded-lg overflow-auto">
                    <PlateEditor
                      variant="default"
                      className="min-h-[240px]"
                      value={
                        field.value
                          ? JSON.parse(field.value)
                          : editorDefaultValue
                      }
                      onChange={(v) => {
                        // console.log('value:',v, JSON.stringify(v));
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

        {/* <FormField
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
        /> */}

        {/* {!isEdit && chargeMode !== ChargeMode.FREE && (
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
        )} */}

        <div>
          <Button
            type="submit"
            className="w-32"
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

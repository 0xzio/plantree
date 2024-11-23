'use client'

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
import { useSite } from '@/hooks/useSite'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { Site } from '@prisma/client'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  domain: z.string(),
})

interface Props {
  site: Site
}

export function CustomDomainForm({ site }: Props) {
  const { refetch } = useSite()
  const { isPending, mutateAsync } = trpc.site.customDomain.useMutation()

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      domain: site.customDomain || '',
    },
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        id: site.id,
        domain: data.domain,
      })
      refetch()
      toast.success('Updated successfully!')
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-2xl font-bold">Custom Domain</div>
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Custom domain</FormLabel>
              <FormControl>
                <Input
                  placeholder="Pathname"
                  pattern="[a-zA-Z0-9\-\.]+"
                  maxLength={100}
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormDescription>
                The custom domain for your site.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-24" disabled={isPending}>
          {isPending ? <LoadingDots /> : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}

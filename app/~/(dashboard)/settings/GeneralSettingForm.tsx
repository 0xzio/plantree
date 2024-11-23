'use client'

import { useForm } from 'react-hook-form'
import { PlateEditor } from '@/components/editor/plate-editor'
import { FileUpload } from '@/components/FileUpload'
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
import { Textarea } from '@/components/ui/textarea'
import { useSite } from '@/hooks/useSite'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { Site } from '@prisma/client'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  logo: z.string(),
  name: z.string().min(1, {
    message: 'Name must be at least 1 characters.',
  }),
  subdomain: z.string(),
  description: z.string(),
  about: z.string(),
})

interface Props {
  site: Site
}

export function GeneralSettingForm({ site }: Props) {
  const { refetch } = useSite()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()

  console.log('site=====:', site)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      logo: site.logo || '',
      name: site.name || '',
      subdomain: site.subdomain,
      description: site.description || '',
      about: site.about,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        id: site.id,
        logo: data.logo,
        name: data.name,
        subdomain: data.subdomain,
        description: data.description,
        about: data.about,
      })
      refetch()
      toast.success('Site updated successfully!')
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center justify-center gap-3">
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => <FileUpload {...field} />}
          />
        </div>

        <FormField
          control={form.control}
          name="subdomain"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Subdomain</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Pathname"
                    pattern="[a-zA-Z0-9\-]+"
                    maxLength={100}
                    {...field}
                    className="w-full"
                  />

                  <div className="absolute right-2 top-2 text-secondary-foreground">
                    .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                  </div>
                </div>
              </FormControl>
              <FormDescription>The subdomain for your site.</FormDescription>
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
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Bio</FormLabel>
              <FormDescription>A brief your introduction.</FormDescription>
              <FormControl>
                <Textarea placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => {
            return (
              <FormItem className="w-full h-full">
                <FormLabel>About</FormLabel>
                <FormControl>
                  <div className="h-[360px]  border border-neutral-200 rounded-lg overflow-auto prose-neutral prose-p:leading-none">
                    <PlateEditor
                      value={JSON.parse(field.value)}
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
          <Button size="lg" type="submit" className="w-20">
            {isPending ? <LoadingDots /> : <p>Save</p>}
          </Button>
        </div>
      </form>
    </Form>
  )
}

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import LoadingDots from '@/components/icons/loading-dots'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContributionType, Platform } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  type: z.string().min(1, {
    message: 'Contribution type is required.',
  }),
  platform: z.string().min(1, {
    message: 'Platform is required.',
  }),
  content: z.string().min(1, {
    message: 'Content is required.',
  }),
})

export function CreateRewardRequestForm() {
  const [isLoading, setLoading] = useState(false)
  const { push } = useRouter()
  const { mutateAsync } = trpc.rewards.create.useMutation()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: '',
      platform: '',
      content: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      await mutateAsync({ ...data })
      toast.success('Request created successfully!')
      push('/rewards')
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 items-center"
      >
        <div className="pb-8 mb-4 space-y-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Contribute Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Contribution Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ContributionType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() +
                            type.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Platform</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Platform).map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform.charAt(0).toUpperCase() +
                            platform.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter content"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button size="lg" type="submit" className="w-full">
          {isLoading ? <LoadingDots color="#808080" /> : <p>Create Request</p>}
        </Button>
      </form>
    </Form>
  )
}

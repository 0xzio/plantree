'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PlateEditor } from '@/components/editor/plate-editor'
import { LoadingDots } from '@/components/icons/loading-dots'
import { NumberInput } from '@/components/NumberInput'
import { useSiteContext } from '@/components/SiteContext'
import { useSpaceContext } from '@/components/SpaceContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { useCheckChain } from '@/hooks/useCheckChain'
import { useEthPrice } from '@/hooks/useEthPrice'
import { usePlans } from '@/hooks/usePlans'
import { usePost } from '@/hooks/usePost'
import { PublishPostFormSchema, usePublishPost } from '@/hooks/usePublishPost'
import { useWagmiConfig } from '@/hooks/useWagmiConfig'
import { BUILTIN_PAGE_SLUGS, editorDefaultValue } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api, trpc } from '@/lib/trpc'
import { useSession } from '@/lib/useSession'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { GateType, PostStatus } from '@prisma/client'
import { DialogClose } from '@radix-ui/react-dialog'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { usePublishDialog } from './usePublishDialog'

export function PublishForm() {
  const { setIsOpen } = usePublishDialog()
  const { post, setPost } = usePost()
  const { spaceId, ...site } = useSiteContext()
  const { data: session } = useSession()
  const { isLoading, publishPost } = usePublishPost()
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof PublishPostFormSchema>>({
    resolver: zodResolver(PublishPostFormSchema),
    defaultValues: {
      slug: post?.slug ? `/${post?.slug}` : '',
      gateType: post?.gateType || GateType.FREE,
      collectible: post?.collectible || false,
      delivered: post?.delivered || false,
      publishedAt: post?.publishedAt ? new Date(post?.publishedAt) : new Date(),
    },
  })

  async function onSubmit(data: z.infer<typeof PublishPostFormSchema>) {
    const opt = {
      ...data,
      slug: data.slug.replace(/^\/|\/$/g, ''),
    }

    try {
      await publishPost(opt)
      setPost({
        ...post,
        status: PostStatus.PUBLISHED,
        ...opt,
      })
    } catch (error) {}
  }

  return (
    <Form {...form}>
      <DialogHeader>
        <DialogTitle>
          {post.isPage ? 'Publish your page' : 'Publish your post'}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>slug</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  {...field}
                  className="w-full"
                  disabled={BUILTIN_PAGE_SLUGS.includes(post.slug)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!post.isPage && (
          <>
            <FormField
              control={form.control}
              name="gateType"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Access control</FormLabel>
                  <FormDescription>
                    Gate this post, config who can read this post.
                  </FormDescription>
                  <FormControl>
                    <GateTypeSelect {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* 
            <FormField
              control={form.control}
              name="collectible"
              render={({ field }) => (
                <FormItem className="w-full flex items-center">
                  <FormLabel htmlFor="post-collectible">collectible</FormLabel>
                  <FormControl>
                    <Switch
                      id="post-collectible"
                      checked={field.value}
                      disabled={!spaceId}
                      onCheckedChange={(value) => {
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="delivered"
              render={({ field }) => (
                <div>
                  <FormItem className="w-full flex items-center">
                    <div className="flex gap-2 items-center">
                      <FormLabel htmlFor="post-delivered">
                        Deliver your newsletter
                      </FormLabel>
                      <Badge
                        size="sm"
                        className="cursor-pointer h-6"
                        onClick={() => setIsOpen(true)}
                      >
                        Upgrade
                      </Badge>
                    </div>
                    <FormControl>
                      {post.delivered ? (
                        <div className="text-sm text-muted-foreground">
                          Already sent
                        </div>
                      ) : (
                        <Switch
                          id="post-delivered"
                          disabled={session?.isFree}
                          checked={field.value}
                          onCheckedChange={(value) => {
                            field.onChange(value)
                          }}
                        />
                      )}
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                  <div className="text-foreground/60 text-xs">
                    {post.delivered
                      ? 'This newsletter has been sent to subscribers.'
                      : 'Send your newsletter to subscribers.'}
                  </div>
                </div>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="publishedAt"
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormLabel htmlFor="">Publish date</FormLabel>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'justify-start text-xs px-3 rounded-md flex gap-1',
                          !field.value && 'text-muted-foreground',
                        )}
                        onClick={() => setOpen(!open)}
                      >
                        <CalendarIcon size={14} />
                        {field.value ? (
                          <span>{format(field.value, 'PPP')}</span>
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={async (d) => {
                          setOpen(false)
                          if (d) {
                            field.onChange(d!)
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <div className="flex items-center justify-end gap-2">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" className="w-24" disabled={isLoading}>
            {isLoading ? <LoadingDots /> : <span>Publish</span>}
          </Button>
        </div>
      </form>
    </Form>
  )
}

interface GateTypeSelectProps {
  value: GateType
  onChange: (value: GateType) => void
}

function GateTypeSelect({ value, onChange }: GateTypeSelectProps) {
  return (
    <div className="flex gap-2">
      <GateTypeItem
        selected={value === GateType.FREE}
        title="Free"
        description="Any one can read this post"
        onClick={() => onChange(GateType.FREE)}
      />
      <GateTypeItem
        selected={value === GateType.PAID}
        title="Paid"
        description="Member or collector can read this post"
        onClick={() => onChange(GateType.PAID)}
      />
    </div>
  )
}

interface GateItemTypeProps {
  selected?: boolean
  title: string
  description: string
  onClick: () => void
}

function GateTypeItem({
  selected,
  title,
  description,
  onClick,
}: GateItemTypeProps) {
  return (
    <div
      className={cn(
        'rounded-xl border-2 p-3 flex-1 cursor-pointer',
        selected ? 'border-primary' : 'border-secondary',
      )}
      onClick={() => onClick?.()}
    >
      <div className="font-medium text-base">{title}</div>
      <div className="text-xs text-foreground/60">{description}</div>
    </div>
  )
}

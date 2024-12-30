'use client'

import { useState } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { ExternalLink } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface Props {}
export const DeploySiteForm = () => {
  const [apiToken, setApiToken] = useState<string>('')
  const { isPending, mutateAsync } = trpc.hostedSite.deployNewSite.useMutation()
  const { data, status } = useSession()
  const { refetch } = trpc.hostedSite.myHostedSites.useQuery()

  const omSubmit = async () => {
    if (!apiToken) return
    try {
      const res = await mutateAsync({ apiToken })
      if (res.code === 200) {
        refetch()
        toast.success('Deploy task created!')
      } else if (res.code === 403) {
        toast.error(res.message)
      }
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  const authenticated = !!data

  if (!authenticated) {
    return null
  }

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <div className="w-full max-w-[600px] mx-auto px-10 py-16 rounded-md">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Deploy your site</h2>

            <div className="text-base text-foreground/60">
              Deploy your own site to Cloudflare Pages in 10 minutes
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="apiToken" className="text-sm font-medium">
                  API Token
                </label>

                <a
                  href="https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=[%20%20{%20%20%20%20%22key%22:%20%22d1%22,%20%20%20%20%22type%22:%20%22edit%22%20%20},%20%20{%20%20%20%20%22key%22:%20%22workers_r2%22,%20%20%20%20%22type%22:%20%22edit%22%20%20},%20%20{%20%20%20%20%22key%22:%20%22workers_kv_storage%22,%20%20%20%20%22type%22:%20%22edit%22%20%20},%20%20{%20%20%20%20%22key%22:%20%22page%22,%20%20%20%20%22type%22:%20%22edit%22%20%20},%20%20{%20%20%20%20%22key%22:%20%22ai%22,%20%20%20%20%22type%22:%20%22read%22%20%20},%20%20{%20%20%20%22key%22:%22workers_scripts%22,%20%20%20%22type%22:%20%22edit%22%20%20},%20%20{%20%20%20%20%22key%22:%20%22account_settings%22,%20%20%20%20%22type%22:%20%22read%22%20%20}%20%20]&name=PenX"
                  target="_blank"
                  className="text-sm text-foreground/60 flex items-center gap-1 hover:text-foreground/90 hover:scale-105 transition-all"
                >
                  Create API Token
                  <ExternalLink size={16}></ExternalLink>
                </a>
              </div>
              <Input
                size="lg"
                id="apiToken"
                value={apiToken}
                onChange={(e) => {
                  setApiToken(e.target.value)
                }}
                placeholder="Enter your Cloudflare API token"
              />
            </div>

            <Button
              onClick={omSubmit}
              disabled={isPending}
              size="lg"
              className="w-full"
            >
              {isPending ? <LoadingDots className=""></LoadingDots> : 'Deploy'}
            </Button>
          </div>
        </div>
      </div>

      {/* <DeployLogs userId={data.userId} /> */}
    </div>
  )
}

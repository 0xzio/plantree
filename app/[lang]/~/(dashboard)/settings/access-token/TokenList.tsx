'use client'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { LoadingDots } from '@/components/icons/loading-dots'
import { Separator } from '@/components/ui/separator'
import { useAccessTokens } from '@/hooks/useAccessTokens'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { AccessToken } from '@prisma/client'
import { format } from 'date-fns'
import { Copy, KeySquare } from 'lucide-react'
import { toast } from 'sonner'

interface Props {}

export default function AccessTokenList({}: Props) {
  const { isLoading, data: tokenList, refetch } = useAccessTokens()
  const { mutateAsync } = trpc.accessToken.delete.useMutation()
  const { copy } = useCopyToClipboard()

  if (isLoading) {
    return <LoadingDots />
  }

  async function handleDelete(id: string) {
    try {
      await mutateAsync({ id })
      toast.success('Access token deleted successfully')
      refetch()
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <div>
      {tokenList && tokenList.length > 0 ? (
        tokenList?.map((token) => (
          <div key={token.id} className="flex border-b px-2 py-3">
            <div className="grow flex flex-col space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex space-x-2">
                  <KeySquare size={20} className="" />
                  <span className="border py-1 px-2 rounded-lg text-xs font-medium border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    {token.title}
                  </span>
                </div>
                <span className="text-xs text-foreground/50">
                  expiredAt:{' '}
                  {token.expiredAt
                    ? format(new Date(token.expiredAt), 'yyyy-MM-dd')
                    : 'Never exp'}
                </span>
                <ConfirmDialog
                  title="Delete Confirm"
                  content="Are you sure you want to delete this access token?"
                  tooltipContent="delete access token"
                  onConfirm={() => handleDelete(token.id)}
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex text-sm text-muted-foreground space-x-4">
                  <span>{token.token}</span>
                </div>
                <Copy
                  size={16}
                  className="text-foreground/60 hover:text-foreground cursor-pointer"
                  onClick={() => {
                    copy(token.token)
                    toast.success('Access token copied to clipboard')
                  }}
                />
              </div>
            </div>

            <div className="flex justify-center items-center"></div>
          </div>
        ))
      ) : (
        <div className="text-foreground/50">No access tokens found.</div>
      )}
    </div>
  )
}

import { Skeleton } from '@/components/ui/skeleton'
import { Box, FowerHTMLProps } from '@fower/react'

interface Props extends FowerHTMLProps<'div'> {
  isLoading: boolean
}

export function GithubConnectionBox({ children, isLoading, ...rest }: Props) {
  return (
    <div {...rest}>
      {isLoading && (
        <div className="flex justify-between">
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="w-32 h-11 rounded-2xl" />
        </div>
      )}

      {!isLoading && <Box>{children}</Box>}
    </div>
  )
}

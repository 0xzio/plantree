'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSite } from '@/hooks/useSite'
import { trpc } from '@/lib/trpc'
import { useNavLinkDialog } from './NavLinkDialog/useNavLinkDialog'
import { NavList } from './NavList'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, site, error } = useSite()
  const { setState } = useNavLinkDialog()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <div>
        <CardTitle className="flex justify-between items-center">
          <div>Navigation links</div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setState({
                isOpen: true,
                navLink: null as any,
                index: -1,
              })
            }}
          >
            Add
          </Button>
        </CardTitle>
      </div>
      <NavList site={site} />
    </div>
  )
}

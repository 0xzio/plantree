import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function UnsubscribedPage({
  searchParams,
}: {
  searchParams: { email?: string }
}) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="flex h-full items-center justify-center">
        <Card className="max-w-[420px] flex flex-col items-center p-6">
          <CardHeader>
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
              <div className="text-2xl font-semibold text-center">
                Unsubscribed Successfully
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="text-center text-muted-foreground">
              {searchParams.email ? (
                <>
                  <span className="font-medium text-foreground">
                    {searchParams.email}
                  </span>{' '}
                  has been unsubscribed from our newsletter.
                </>
              ) : (
                'You have been unsubscribed from our newsletter.'
              )}
            </div>
            <div className="text-sm text-muted-foreground text-center">
              You can always resubscribe if you change your mind.
            </div>
            <Button asChild className="mt-2">
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

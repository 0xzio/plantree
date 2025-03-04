'use client';

import { useState } from 'react';
import { LoadingDots } from '@/components/icons/loading-dots';
import { useSiteContext } from '@/components/SiteContext';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';


export function ConnectStripe() {
  const [loading, setLoading] = useState(false)
  const site = useSiteContext()

  return (
    <div className="space-y-3">
      <div className="text-2xl font-bold">Connect stripe</div>
      <div className="text-foreground/60">
        Connect stripe to setup membership payment.
      </div>
      <Button
        size="lg"
        className="w-40"
        disabled={loading}
        onClick={async () => {
          setLoading(true)
          const REDIRECT_URI = process.env.NEXT_PUBLIC_STRIPE_REDIRECT_URI
          const CLIENT_ID = process.env.NEXT_PUBLIC_STRIPE_OAUTH_CLIENT_ID

          // const state = Math.random() * 100
          const url = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&scope=read_write&redirect_uri=${REDIRECT_URI}&state=${site.id}&stripe_user[business_type]=sole_prop&stripe_user[country]=US`

          location.href = url
        }}
      >
        {loading && <LoadingDots className="bg-foreground" />}
        {!loading && <div className="">Connect stripe</div>}
      </Button>
    </div>
  )
}
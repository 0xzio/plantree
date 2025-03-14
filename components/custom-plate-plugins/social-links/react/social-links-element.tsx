'use client'

import React, { useState } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { SocialNav } from '@/components/theme-ui/SocialNav'
import { Link } from '@/lib/i18n'
import { getBlockClassName } from '@/lib/utils'
import { cn, withRef } from '@udecode/cn'
import { PlateElement } from '@udecode/plate/react'

export const SocialLinksElement = withRef<typeof PlateElement>((props, ref) => {
  const { children, className, nodeProps, ...rest } = props
  const site = useSiteContext()

  return (
    <PlateElement
      ref={ref}
      {...props}
      className={cn(
        props.className,
        className,
        getBlockClassName(props),
        'flex justify-center items-center',
      )}
      contentEditable={false}
    >
      {Object.keys(site.socials as any).length > 0 ? (
        <SocialNav site={site as any} size={5} className="" />
      ) : (
        <Link
          href="/~/settings/socials"
          className="inline-flex bg-foreground/5 p-2 rounded-xl text-sm hover:bg-foreground/10 cursor-pointer"
        >
          No social links configured. Go to configure &rarr;
        </Link>
      )}

      {children}
    </PlateElement>
  )
})

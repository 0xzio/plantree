'use client'

import { useLingui } from '@lingui/react'
import NextLink from 'next/link'

type Props = React.ComponentPropsWithoutRef<typeof NextLink>
export function Link(props: Props) {
  const { i18n } = useLingui()
  return <NextLink {...props} href={`/${i18n.locale}${props.href}`}></NextLink>
}

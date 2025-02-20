'use client'

import Image from 'next/image'

interface Props {
  uri: string
}
export function SpaceLogo({ uri }: Props) {
  return (
    <Image
      src={`/api/space-logo?cid=${uri}`}
      alt=""
      width={64}
      height={64}
      className="w-12 h-12 rounded-lg"
    />
  )
}

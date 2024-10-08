'use client'

import { useLogoImages } from '@/hooks/useLogoImages'
import Image from 'next/image'

interface Props {
  address: string
}
export function SpaceLogo({ address }: Props) {
  const { logoImages } = useLogoImages()

  if (!logoImages[address]) {
    return <div className="w-12 h-12 rounded-lg bg-neutral-100" />
  }
  const url =
    process.env.NEXT_PUBLIC_IPFS_GATEWAY + `/ipfs/${logoImages[address]}`
  return <img src={url} alt="" className="w-12 h-12 rounded-lg" />
}

'use client'

import SVG from 'react-inlinesvg'
import { Button } from '@/components/ui/button'
import { Manifest } from '@/lib/model'
import { trpc } from '@/lib/trpc'
import { Box, css } from '@fower/react'
import { DownloadCloud } from 'lucide-react'
import Image from 'next/image'

interface ItemIconProps {
  icon: string
}
function ExtensionIcon({ icon }: ItemIconProps) {
  const size = 48
  const rounded = 12
  if (!icon) {
    return <Box square={size} bgNeutral300 rounded={rounded}></Box>
  }

  if (icon.startsWith('/')) {
    return (
      <Image
        src={icon}
        alt=""
        width={size}
        height={size}
        style={{ borderRadius: rounded }}
      />
    )
  }

  const isSVG = icon.startsWith('<svg')
  if (isSVG) {
    return (
      <SVG className={css({ square: size, rounded })} src={icon as string} />
    )
  }
  return (
    <Box
      as="img"
      square={size}
      rounded={rounded}
      src={`data:image/png;base64, ${icon}`}
    />
  )
}

export function MarketplaceList() {
  const { data = [], isLoading } = trpc.extension.all.useQuery()

  if (isLoading) return <p>Loading...</p>

  return (
    <Box>
      <Box grid gridTemplateColumns={[1, 2, 2, 3]} gap3>
        {data?.map((item) => {
          const manifest = new Manifest(item.manifest as any)

          return (
            <Box key={item.id} bgNeutral100 rounded2XL p5 column gap4>
              <Box toCenterY gap3>
                <ExtensionIcon icon={item.logo} />
                <Box column gap1>
                  <Box text2XL fontBold>
                    {manifest.name}
                  </Box>
                  <Box gray600>{manifest.description}</Box>
                </Box>
              </Box>
              <Box toBetween>
                <Box toCenterY gap1>
                  <Box gray600>
                    <DownloadCloud size={18} />
                  </Box>
                  <Box textSM>{item.installationCount}</Box>
                </Box>
                <Button size="sm">Install</Button>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

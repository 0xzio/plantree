import { ImageResponse } from 'next/og'

export const alt = 'Next-generation blog tool'

export const revalidate = 60

export const size = {
  width: 800,
  height: 500,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        tw="h-full w-full flex flex-col justify-center items-center relative text-white leading-none"
        style={{
          backgroundImage: 'url(https://frame.penx.io/og-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 tw="text-8xl -mt-6 leading-none">PenX</h1>
        <div tw="text-3xl leading-none">Next-generation blog tool</div>
      </div>
    ),
    {
      ...size,
    },
  )
}

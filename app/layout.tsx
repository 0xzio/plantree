import '@/styles/globals.css'
import { Profile } from '@/components/Profile/Profile'
import { SocialNav } from '@/components/SocialNav'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/react'
import { Metadata } from 'next'
import {
  // Inter as FontSans,
  // Merienda,
  Philosopher,
  Poppins,
  // Yeseva_One,
} from 'next/font/google'
import { headers } from 'next/headers'
import Link from 'next/link'
import NextTopLoader from 'nextjs-toploader'
import { Nav } from './Nav'
import { Providers } from './providers'

const logoFont = Philosopher({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
})

const title = 'Respace: Building Space On-Chain'
const description = 'Respace is a Protocol for Building Space On-Chain.'
// const image = 'https://vercel.pub/thumbnail.png'

export const metadata: Metadata = {
  title,
  description,

  icons: ['https://spaceprotocol.xyz/favicon.ico'],
  openGraph: {
    title,
    description,
    // images: [image],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    // images: [image],
    creator: '@space3',
  },
  metadataBase: new URL('https://spaceprotocol.xyz'),
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerList = headers()
  const cookies = headers().get('cookie')
  const url = headerList.get('x-current-path') || ''

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background antialiased',
          // cal.variable,
          // inter.variable,
          // fontSans.variable,
          'bg-orange-50',
          poppins.className,
          // url === '/' && 'bg-zinc-100',
        )}
      >
        <NextTopLoader
          color="#000"
          // crawlSpeed={0.08}
          height={2}
          showSpinner={false}
          template='<div class="bar" role="bar"><div class="peg"></div></div>'
        />
        <ThemeProvider
          attribute="class"
          // defaultTheme="system"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers cookies={cookies}>
            <div className="flex flex-col gap-4 container px-2">
              <div className="z-10  py-3 relative flex justify-between">
                <div className="flex items-center">
                  <Link href="/" className="cursor-pointer">
                    <div
                      className={cn(
                        'font-bold text-2xl flex',
                        logoFont.className,
                      )}
                    >
                      <span className="">Plantree</span>
                    </div>
                  </Link>
                </div>

                <div className="flex items-center gap-10">
                  <Nav />
                  <SocialNav className="text-neutral-800" />
                  <Profile />
                </div>
              </div>

              <div className="relative">
                <div className="z-10 relative">{children}</div>
              </div>
            </div>

            <Analytics />
          </Providers>
        </ThemeProvider>

        {process.env.NEXT_PUBLIC_UMAMIC_WEBSITE_ID && (
          <script
            async
            defer
            src="https://umamic.penx.io/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMIC_WEBSITE_ID}
          ></script>
        )}
      </body>
    </html>
  )
}

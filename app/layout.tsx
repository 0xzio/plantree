import '@/styles/globals.css'
import { ModeToggle } from '@/components/ModeToggle'
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
          'bg-zinc-50 dark:bg-zinc-900',
          // 'bg-orange-50',
          poppins.className,
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers cookies={cookies}>
            <div className="flex flex-col gap-4 container px-2">
              <div className="z-10  py-3 relative flex justify-between">
                <div className="flex items-center">
                  <Link href="/" className="cursor-pointer flex items-center">
                    <span className="i-[fluent-emoji--deciduous-tree] w-7 h-7"></span>
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

                <Nav />

                <div className="flex items-center gap-2">
                  <SocialNav className="text-neutral-800" />
                  <ModeToggle />
                  <Profile />
                </div>
              </div>

              <div className="relative">
                <div className="z-10 relative">{children}</div>
                <div
                  className="fixed left-[30%] top-[400px] -z-10 w-[800px] h-[800px] opacity-30 dark:opacity-0"
                  style={{
                    filter: 'blur(150px) saturate(150%)',
                    transform: 'translateZ(0)',
                    backgroundImage:
                      'radial-gradient(at 27% 37%, #3a8bfd 0, transparent 50%), radial-gradient(at 97% 21%, #9772fe 0, transparent 50%), radial-gradient(at 52% 99%, #fd3a4e 0, transparent 50%), radial-gradient(at 10% 29%, #5afc7d 0, transparent 50%), radial-gradient(at 97% 96%, #e4c795 0, transparent 50%), radial-gradient(at 33% 50%, #8ca8e8 0, transparent 50%), radial-gradient(at 79% 53%, #eea5ba 0, transparent 50%)',
                  }}
                ></div>
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

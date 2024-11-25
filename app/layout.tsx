import '@/styles/globals.css'
import '@farcaster/auth-kit/styles.css'
import '@rainbow-me/rainbowkit/styles.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'
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
import { Providers } from './providers'

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
})

const title = 'PenX'
const description = 'Build modern blog'
// const image = 'https://vercel.pub/thumbnail.png'

export const metadata: Metadata = {
  title,
  description,

  icons: ['https://penx.io/favicon.ico'],
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
    creator: '@penx',
  },
  metadataBase: new URL('https://penx.io'),
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
          // 'bg-zinc-50 dark:bg-zinc-900',
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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers cookies={cookies}>{children}</Providers>
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

import Negotiator from 'negotiator'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import linguiConfig from './lingui.config'

const locales = linguiConfig.locales as string[]

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|images|_next/|_static/|_vercel|.well-known|[\\w-]+\\.\\w+).*)',
  ],
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const { pathname } = url

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:4000)
  let hostname = req.headers
    .get('host')!
    .replace('.localhost:4000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)

  // const token = await getToken({ req })
  // console.log('====token:', token)

  const locale = pathnameHasLocale
    ? pathname.split('/')[1]
    : getRequestLocale(req.headers)

  // req.nextUrl.pathname = `/${locale}${pathname}`

  const searchParams = req.nextUrl.searchParams.toString()
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)

  const postfix = searchParams.length > 0 ? `?${searchParams}` : ''

  const path = pathnameHasLocale
    ? `${url.pathname.replace(`/${locale}`, '')}${postfix}`
    : `${url.pathname}${postfix}`

  console.log('======url.pathname:', url.pathname, 'path:', path)

  // Redirect if there is no locale

  const isRoot =
    hostname === 'localhost:4000' ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN

  // console.log(
  //   '======isRoot:',
  //   isRoot,
  //   'hostname:',
  //   hostname,
  //   process.env.NEXT_PUBLIC_ROOT_DOMAIN,
  // )

  console.log(
    '========pathnameHasLocale:',
    pathnameHasLocale,
    'locale:',
    locale,
  )
  const isDashboard = path.startsWith('/~')

  if (isRoot) {
    if (isDashboard) {
      const token = await getToken({ req: req })
      if (!token) {
        return NextResponse.redirect(new URL('/', req.url))
      }
      return NextResponse.rewrite(new URL(path, req.url))
    } else {
      console.log('=====path:', path)
      return NextResponse.rewrite(new URL(`/${locale}/root${path}`, req.url))
    }
  }

  if (path.startsWith('/@')) {
    return NextResponse.rewrite(new URL(`/site${path}`, req.url), {
      headers: { 'x-current-path': path },
    })
  }

  // return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
  // return NextResponse.next()

  return NextResponse.rewrite(new URL(`/site/${hostname}${path}`, req.url))
}

function getRequestLocale(requestHeaders: Headers): string {
  const langHeader = requestHeaders.get('accept-language') || undefined
  const languages = new Negotiator({
    headers: { 'accept-language': langHeader },
  }).languages(locales.slice())

  const activeLocale = languages[0] || locales[0] || 'en'

  return activeLocale
}

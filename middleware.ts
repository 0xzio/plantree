import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|images|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:4000)
  let hostname = req.headers
    .get('host')!
    .replace('.localhost:4000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)

  // special case for Vercel preview deployment URLs
  if (
    hostname.includes('---') &&
    hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    hostname = `${hostname.split('---')[0]}.${
      process.env.NEXT_PUBLIC_ROOT_DOMAIN
    }`
  }
  // const token = await getToken({ req })
  // console.log('====token:', token)

  const searchParams = req.nextUrl.searchParams.toString()
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ''
  }`
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

  if (path === '/login' && isRoot) {
    const token = await getToken({ req })
    if (token) {
      // return NextResponse.redirect(new URL('~/objects/today', req.url))
      return NextResponse.redirect(new URL('~/posts', req.url))
    } else {
      return NextResponse.next()
    }
  }

  if (path === '/login' && !isRoot) {
    const token = await getToken({ req })
    if (token) {
      return NextResponse.redirect(new URL('/', req.url))
    } else {
      return NextResponse.next()
    }
  }

  if (isRoot && !path.startsWith('/~')) {
    return NextResponse.rewrite(new URL(`/root${path}`, req.url))
  }

  if (path.startsWith('/~') && isRoot) {
    const token = await getToken({ req })
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return NextResponse.rewrite(new URL(path, req.url))
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

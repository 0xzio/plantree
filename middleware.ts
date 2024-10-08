import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isCID = (value: string) => value.startsWith('qm')

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  const host = req.headers.get('host')

  if (host === ROOT_DOMAIN) {
    return NextResponse.next()
  }

  const subdomain = host?.replace(`.${ROOT_DOMAIN}`, '') || ''

  if (!subdomain.length) {
    return NextResponse.next()
  }

  async function renderIpfs(hash: string, isRaw = false) {
    let cid = hash
    console.log('====hash:', hash, 'isRaw:', isRaw)

    const url = req.nextUrl
    const pathname = url.pathname

    if (!isRaw) {
      const GET_CID_URL = `${req.nextUrl.protocol}//${ROOT_DOMAIN}/api/cid?cid=${hash}`
      const cidRes = await fetch(GET_CID_URL).then((res) => res.json())
      cid = cidRes.cid
    }

    const ipfsUrl = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${cid}${pathname}`

    console.log('=====ipfsUrl:', ipfsUrl)
    if (ipfsUrl.endsWith('.woff2')) {
      return NextResponse.next()
    }

    const ipfsRes = await fetch(ipfsUrl)
    const contentType = ipfsRes.headers.get('content-type')

    if (!ipfsRes.ok) {
      return NextResponse.json(
        {
          error: 'Failed to fetch content from IPFS',
          msg: ipfsRes.json(),
          raw: ipfsRes,
        },
        { status: 500 },
      )
    }

    if (contentType && contentType.startsWith('image/')) {
      const blob = await ipfsRes.blob()
      const arrayBuffer = await blob.arrayBuffer()

      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType || 'application/octet-stream',
          'Content-Length': arrayBuffer.byteLength.toString(),
          'Cache-Control': 'max-age=31536000',
          'CDN-Cache-Control': 'max-age=31536000',
          'Vercel-CDN-Cache-Control': 'max-age=31536000',
        },
      })
    } else {
      const ipfsContent = await ipfsRes.text()

      return new NextResponse(ipfsContent, {
        headers: {
          'Content-Type': contentType || 'text/plain',
          'Cache-Control': 'max-age=31536000',
          'CDN-Cache-Control': 'max-age=31536000',
          'Vercel-CDN-Cache-Control': 'max-age=31536000',
        },
      })
    }
  }

  if (isCID(subdomain)) {
    const hash = subdomain
    await renderIpfs(hash)
  } else {
    try {
      const GET_DOMAIN_URL = `${req.nextUrl.protocol}//${ROOT_DOMAIN}/api/domain?domain=${subdomain}`
      const res = await fetch(GET_DOMAIN_URL).then((res) => res.json())
      if (!res.cid) return NextResponse.next()
      console.log('========subdomain:', subdomain, res)
      // return NextResponse.next()
      await renderIpfs(res.cid, true)
    } catch (error) {
      return NextResponse.next()
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    // '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
    '/((?!api/|_static/|_vercel).*)',
  ],
}

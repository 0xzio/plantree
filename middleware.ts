import { CID } from 'multiformats/cid'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function isValidCID(cidString: string) {
  try {
    CID.parse(cidString)
    return true
  } catch (error) {
    return false
  }
}

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  const host = req.headers.get('host')

  if (host === ROOT_DOMAIN) {
    return NextResponse.next()
  }

  let hash = host?.replace(`.${ROOT_DOMAIN}`, '') || ''

  console.log('====hash:', hash)

  if (hash.length) {
    if (!hash.startsWith('qm')) {
      return NextResponse.next()
    }

    const url = req.nextUrl
    const pathname = url.pathname

    const GET_CID_URL = `${req.nextUrl.protocol}//${ROOT_DOMAIN}/api/cid?cid=${hash}`

    const { cid } = await fetch(GET_CID_URL).then((res) => res.json())

    const ipfsUrl = `https://ipfs-gateway.spaceprotocol.xyz/ipfs/${cid}${pathname}`

    const response = await fetch(ipfsUrl)
    const contentType = response.headers.get('content-type')

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch content from IPFS' },
        { status: 500 },
      )
    }

    if (contentType && contentType.startsWith('image/')) {
      const blob = await response.blob()
      const arrayBuffer = await blob.arrayBuffer()

      return new NextResponse(arrayBuffer, {
        headers: {
          'Content-Type': contentType || 'application/octet-stream',
          'Content-Length': arrayBuffer.byteLength.toString(),
        },
      })
    } else {
      const ipfsContent = await response.text()

      return new NextResponse(ipfsContent, {
        headers: {
          'Content-Type': contentType || 'text/plain',
        },
      })
    }
  }
  return NextResponse.next()
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
    '/((?!api/|_next/|_static/|_vercel).*)',
  ],
}

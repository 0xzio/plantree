import { Readable } from 'stream'
import { create } from 'kubo-rpc-client'
import { NextApiRequest, NextApiResponse, PageConfig } from 'next'

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' })
  }

  // Create a buffer to store the incoming data
  const chunks: Buffer[] = []

  // Read the incoming stream
  req.on('data', (chunk) => {
    chunks.push(Buffer.from(chunk))
  })

  req.on('end', async () => {
    // Combine all chunks into a single buffer
    const buffer = Buffer.concat(chunks)

    const client = create(new URL('http://43.154.135.183:5001'))
    const { cid } = await client.add(
      {
        content: buffer,
      },
      { pin: true },
    )

    res.json({ cid: cid.toString() })
  })

  req.on('error', (err) => {
    console.error('Error reading request body:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  })
}

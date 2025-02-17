import { StorageProvider } from '@prisma/client'
import { calculateSHA256FromFile } from './calculateSHA256FromFile'
import { IPFS_GATEWAY, IPFS_UPLOAD_URL, STATIC_URL } from './constants'
import { api } from './trpc'

type UploadReturn = {
  contentDisposition?: string
  contentType?: string
  pathname?: string
  url?: string
  cid?: string
}

export async function uploadFile(file: File, isPublic = true) {
  const fileHash = await calculateSHA256FromFile(file)
  let data: UploadReturn = {}
  const site = window.__SITE__

  let qs = ''
  if (file.type === 'image/svg+xml') {
    let query = new URLSearchParams({})
    query.set('contentType', 'image/svg+xml')
    query.toString()
    qs = `?${query.toString()}`
  }

  const res = await fetch(`${STATIC_URL}/${fileHash}${qs}`, {
    method: 'PUT',
    body: file,
  })

  if (!res.ok) {
    throw new Error('Failed to upload file')
  }

  data = await res.json()
  const url = `/${fileHash}`
  data = {
    ...data,
    url,
  }

  await api.asset.create.mutate({
    siteId: site.id,
    url,
    filename: file.name,
    contentType: file.type,
    size: file.size,
    isPublic,
    createdAt: file.lastModified ? new Date(file.lastModified) : new Date(),
  })

  return data as UploadReturn
}

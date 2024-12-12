import { StorageProvider } from '@prisma/client'
import { calculateSHA256FromFile } from './calculateSHA256FromFile'
import { IPFS_GATEWAY, IPFS_UPLOAD_URL, STATIC_URL } from './constants'
import { uploadToGoogleDrive } from './uploadToGoogleDrive'

type UploadReturn = {
  contentDisposition?: string
  contentType?: string
  pathname?: string
  url?: string
  cid?: string
}

export async function uploadFile(
  file: File,
  isUploadToGoogleDrive: boolean = false,
) {
  const fileHash = await calculateSHA256FromFile(file)
  let data: UploadReturn = {}
  const site = window.__SITE__

  if (site.storageProvider === StorageProvider.VERCEL_BLOB) {
    data = await fetch(`/api/upload?fileHash=${fileHash}`, {
      method: 'POST',
      body: file,
    }).then((res) => res.json())
    return data as UploadReturn
  } else {
    const res = await fetch(`${STATIC_URL}/images/${fileHash}`, {
      method: 'PUT',
      body: file,
    })

    if (res.ok) {
      data = await res.json()
      data = {
        ...data,
        url: `/images/${fileHash}`,
      }
    } else {
      throw new Error('Failed to upload file')
    }
  }

  if (isUploadToGoogleDrive) {
    setTimeout(async () => {
      try {
        await uploadToGoogleDrive(fileHash, file)
      } catch (error) {
        console.log('error uploading to Google Drive:', error)
      }
    }, 0)
  }

  return data as UploadReturn
}

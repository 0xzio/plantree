'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@udecode/cn'
import type { TPlaceholderElement } from '@udecode/plate-media'
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  PlaceholderPlugin,
  PlaceholderProvider,
  updateUploadHistory,
  VideoPlugin,
} from '@udecode/plate-media/react'
import {
  PlateElement,
  useEditorPlugin,
  withHOC,
  withRef,
} from '@udecode/plate/react'
import { AudioLines, FileUp, Film, ImageIcon } from 'lucide-react'
import { useFilePicker } from 'use-file-picker'
import { Spinner } from './spinner'

const CONTENT: Record<
  string,
  {
    accept: string[]
    content: ReactNode
    icon: ReactNode
  }
> = {
  [AudioPlugin.key]: {
    accept: ['audio/*'],
    content: 'Add an audio file',
    icon: <AudioLines />,
  },
  [FilePlugin.key]: {
    accept: ['*'],
    content: 'Add a file',
    icon: <FileUp />,
  },
  [ImagePlugin.key]: {
    accept: ['image/*'],
    content: 'Add an image',
    icon: <ImageIcon />,
  },
  [VideoPlugin.key]: {
    accept: ['video/*'],
    content: 'Add a video',
    icon: <Film />,
  },
}

export const MediaPlaceholderElement = withHOC(
  PlaceholderProvider,
  withRef<typeof PlateElement>(
    ({ children, className, nodeProps, ...props }, ref) => {
      const editor = props.editor
      const element = props.element as TPlaceholderElement

      const { api } = useEditorPlugin(PlaceholderPlugin)

      return (
        <PlateElement ref={ref} className={cn(className, 'my-1')} {...props}>
          <div></div>
        </PlateElement>
      )
    },
  ),
)

export function ImageProgress({
  className,
  file,
  imageRef,
  progress = 0,
}: {
  file: File
  className?: string
  imageRef?: React.RefObject<HTMLImageElement | null>
  progress?: number
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setObjectUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  if (!objectUrl) {
    return null
  }

  return (
    <div className={cn('relative', className)} contentEditable={false}>
      <img
        ref={imageRef}
        className="h-auto w-full rounded-sm object-cover"
        alt={file.name}
        src={objectUrl}
      />
      {progress < 100 && (
        <div className="absolute right-1 bottom-1 flex items-center space-x-2 rounded-full bg-black/50 px-1 py-0.5">
          <Spinner />
          <span className="text-xs font-medium text-white">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  )
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: 'accurate' | 'normal'
  } = {},
) {
  const { decimals = 0, sizeType = 'normal' } = opts

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']

  if (bytes === 0) return '0 Byte'

  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`
}

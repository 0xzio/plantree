'use client'

import { getUrl } from '@/lib/utils'
import Image from 'next/image'
import { createEditor } from 'slate'
import { Slate, withReact } from 'slate-react'
import { SlateContent } from './SlateContent'

interface Props {
  content: any
}

export function ContentRender({ content }: Props) {
  if (typeof content === 'string' && content.startsWith('/')) {
    return (
      <div>
        <Image
          src={getUrl(content)}
          alt=""
          width={1000}
          height={1000}
          className="w-full h-auto rounded-lg"
        />
      </div>
    )
  }
  const editor = withReact(createEditor())

  return (
    <Slate
      editor={editor}
      initialValue={Array.isArray(content) ? content : JSON.parse(content)}
    >
      <SlateContent />
    </Slate>
  )
}

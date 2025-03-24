'use client'

import { cn } from '@/lib/utils'
import { slug } from 'github-slugger'
import { Node } from 'slate'

interface Props {
  content: any[]
}

export const Toc = ({ content }: Props) => {
  const headings = content.filter((node: any) =>
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.type),
  )

  const types = Array.from(
    new Set(headings.map((node: any) => Number(node.type.replace('h', '')))),
  )
  const min = Math.min(...types)

  return (
    <aside
      className="sidebar w-56 sticky top-16 shrink-0 py-8 overflow-y-auto hidden xl:block"
      style={{
        height: 'calc(100vh - 4rem)',
      }}
    >
      <h2 className="font-semibold mb-4">On this page</h2>

      <div className="flex flex-col gap-2">
        {headings.map((node: any) => {
          const text = Node.string(node)
          const id = slug(text)
          const depth = Number(node.type.replace('h', '')) - min

          return (
            <div key={node.id} className="text-sm text-foreground/60">
              <a
                className={cn('cursor-pointer')}
                style={{
                  paddingLeft: depth * 12,
                }}
                href={`#${id}`}
              >
                {text}
              </a>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

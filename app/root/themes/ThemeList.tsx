'use client'

import { STATIC_URL } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'

export function ThemeList() {
  const { data = [], isLoading } = trpc.theme.all.useQuery()
  if (isLoading) return <div></div>
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
      {data?.map((item) => {
        const manifest = JSON.parse(item.manifest)

        return (
          <article
            key={item.id}
            className="flex flex-col space-y-5  bg-background rounded-lg overflow-hidden hover:scale-105 transition-all shadow-sm border border-foreground/5"
          >
            <div className="w-full h-52 border-b border-b-popover-foreground/10">
              <Image
                src={`${STATIC_URL}/${manifest.screenshots[0]}`}
                alt=""
                width={400}
                height={400}
                className="object-cover w-full h-52"
              />
            </div>
            <div className="space-y-2 p-4">
              <div className="text-xs text-foreground/50">
                Install theme: npx penx install theme {item.name}
              </div>
              <h2 className="text-xl font-semibold">
                {manifest.title || manifest.name}
              </h2>
              <div className="text-sm flex items-center justify-between">
                {manifest.author && <div>By {manifest.author}</div>}
                {manifest.previewUrl && (
                  <a
                    href={manifest.previewUrl}
                    target="_blank"
                    className="flex items-center gap-1 text-foreground/60"
                  >
                    <div>Preview</div>
                    <ExternalLink size={16}></ExternalLink>
                  </a>
                )}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

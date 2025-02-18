import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="mx-auto h-screen flex flex-col max-w-6xl">
      {children}
    </section>
  )
}

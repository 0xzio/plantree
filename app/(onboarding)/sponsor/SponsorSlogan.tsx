export function SponsorSlogan() {
  return (
    <div className="text-center mx-auto space-y-4">
      <div className="text-6xl leading-tight text-center font-bold space-y-2">
        <div className="">Sponsor PenX project</div>
      </div>
      <div className="w-full md:max-w-[600px] text-lg text-neutral-600 text-center mx-auto">
        PenX is an open-source project and also it is a public good. If you
        love{' '}
        <a
          href="https://www.penx.io/"
          target="_blank"
          className="underline decoration-brand-500 text-brand-500"
        >
          penx.io
        </a>{' '}
        project, you can sponsor the PenX project, and you will receive{' '}
        <span className="text-brand-500">$PEN</span> tokens.
      </div>
    </div>
  )
}

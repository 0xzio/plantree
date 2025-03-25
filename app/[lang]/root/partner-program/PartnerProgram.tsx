import { ReferralLink } from './ReferralLink'

export function PartnerProgram() {
  return (
    <div className="text-center mx-auto space-y-4 -mt-20">
      <div className="text-5xl md:text-6xl leading-tight text-center font-semibold space-y-2">
        <div className="font-serif">
          Welcome to The <br /> PenX Partner Program
        </div>
      </div>

      <div className="text-3xl">Get 50% of referred payments forever</div>
      <div className="w-full md:max-w-[640px] text-lg text-foreground/80 text-center mx-auto">
        PenX's Partner Program is designed for individuals interested in helping
        us expand our reach, promote our products or services, and grow our
        community. By joining the program, you can earn a continuous 50%
        commission on referred payments and be part of our shared growth
        journey.
      </div>

      <div className="mt-6 flex flex-col gap-5 h-[126px]">
        <ReferralLink />
      </div>
    </div>
  )
}

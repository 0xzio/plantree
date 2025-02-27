import { ConnectGitHub } from './ConnectGitHub'

export const SyncBox = () => {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div className="font-bold text-3xl">Github backup</div>
      </div>
      <div>
        <ConnectGitHub />
      </div>
    </div>
  )
}

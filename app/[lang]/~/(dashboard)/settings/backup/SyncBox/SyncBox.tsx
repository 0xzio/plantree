import { ConnectGitHub } from './ConnectGitHub'

export const SyncBox = () => {
  return (
    <div>
      <div className="flex items-center justify-between ">
        <div className="font-bold text-3xl mb-3">Github backup</div>
      </div>
      <div>
        <ConnectGitHub />
      </div>
    </div>
  )
}

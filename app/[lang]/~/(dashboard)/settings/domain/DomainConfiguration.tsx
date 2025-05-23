'use client'

import { useState } from 'react'
import { getSubdomain } from '@/lib/domains'
import { cn } from '@/lib/utils'
import DomainStatus from './DomainStatus'
import { useDomainStatus } from './use-domain-status'

export const InlineSnippet = ({
  className,
  children,
}: {
  className?: string
  children: string
}) => {
  return (
    <span
      className={cn(
        'inline-block rounded-md bg-blue-100 px-1 py-0.5 font-mono text-blue-900 dark:bg-blue-900 dark:text-blue-100',
        className,
      )}
    >
      {children}
    </span>
  )
}
export function DomainConfiguration({ domain }: { domain: string }) {
  const [recordType, setRecordType] = useState<'A' | 'CNAME'>('CNAME')

  const { status, domainJson } = useDomainStatus({ domain })

  // if (!status || status === 'Valid configuration' || !domainJson) return null
  if (!status || !domainJson) return null

  const subdomain = getSubdomain(domainJson.name, domainJson.apexName)

  const txtVerification =
    (status === 'Pending Verification' &&
      domainJson.verification.find((x: any) => x.type === 'TXT')) ||
    null

  return (
    <div className="border-t border-foreground/20 pb-5 pt-7">
      <div className="mb-4 flex items-center space-x-2">
        <p className="text-lg font-semibold text-foreground">{status}</p>
        <DomainStatus domain={domain} />
      </div>
      {txtVerification ? (
        <>
          <p className="text-sm text-foreground">
            Please set the following TXT record on{' '}
            <InlineSnippet>{domainJson.apexName}</InlineSnippet> to prove
            ownership of <InlineSnippet>{domainJson.name}</InlineSnippet>:
          </p>
          <div className="my-5 flex items-start justify-start space-x-10 rounded-md bg-foreground/20 p-2 text-foreground">
            <div>
              <p className="text-sm font-bold">Type</p>
              <p className="mt-2 font-mono text-sm">{txtVerification.type}</p>
            </div>
            <div>
              <p className="text-sm font-bold">Name</p>
              <p className="mt-2 font-mono text-sm">
                {txtVerification.domain.slice(
                  0,
                  txtVerification.domain.length -
                    domainJson.apexName.length -
                    1,
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-bold">Value</p>
              <p className="mt-2 font-mono text-sm">
                <span className="text-ellipsis">{txtVerification.value}</span>
              </p>
            </div>
          </div>
          <p className="text-sm text-foreground/40">
            Warning: if you are using this domain for another site, setting this
            TXT record will transfer domain ownership away from that site and
            break it. Please exercise caution when setting this record.
          </p>
        </>
      ) : status === 'Unknown Error' ? (
        <p className="mb-5 text-sm text-foreground">
          {domainJson.error.message}
        </p>
      ) : (
        <>
          <div className="flex justify-start space-x-4">
            <button
              type="button"
              onClick={() => setRecordType('CNAME')}
              className={`${
                recordType == 'CNAME'
                  ? 'border-foreground text-foreground'
                  : 'border-background text-foreground/40'
              } ease border-b-2 pb-1 text-sm transition-all duration-150`}
            >
              CNAME Record{subdomain && ' (recommended)'}
            </button>

            <button
              type="button"
              onClick={() => setRecordType('A')}
              className={`${
                recordType == 'A'
                  ? 'border-foreground text-foreground'
                  : 'border-background text-foreground/40'
              } ease border-b-2 pb-1 text-sm transition-all duration-150`}
            >
              A Record
            </button>
          </div>
          <div className="my-3 text-left">
            <p className="my-5 text-sm text-foreground">
              To configure your{' '}
              {recordType === 'A' ? 'apex domain' : 'subdomain'} (
              <InlineSnippet>
                {recordType === 'A' ? domainJson.apexName : domainJson.name}
              </InlineSnippet>
              ), set the following {recordType} record on your DNS provider to
              continue:
            </p>
            <div className="flex items-center justify-start space-x-10 rounded-md bg-foreground/5 p-2 text-foreground">
              <div>
                <p className="text-sm font-bold">Type</p>
                <p className="mt-2 font-mono text-sm">{recordType}</p>
              </div>
              <div>
                <p className="text-sm font-bold">Name</p>
                <p className="mt-2 font-mono text-sm">
                  {recordType === 'A' ? '@' : (subdomain ?? 'www')}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold">Value</p>
                <p className="mt-2 font-mono text-sm">
                  {recordType === 'A'
                    ? `76.76.21.21`
                    : `cname.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold">TTL</p>
                <p className="mt-2 font-mono text-sm">86400</p>
              </div>
            </div>
            <p className="mt-5 text-sm text-foreground">
              Note: for TTL, if <InlineSnippet>86400</InlineSnippet> is not
              available, set the highest value possible. Also, domain
              propagation can take up to an hour.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

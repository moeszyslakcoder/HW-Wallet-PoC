import React, { Suspense } from 'react'
import { useAtom } from 'jotai'
import './Home.scss'
import { Chain, chainsAtom } from '../data/chains'
import { AccountInfo, accountInfoAtom } from '../data/accountinfo'

const AccountInfo = ({
  chainId,
  accountId,
}: {
  chainId: string
  accountId: string
}) => {
  const [accountInfoResponse] = useAtom(
    accountInfoAtom({
      chainId,
      accountId,
    }),
  )
  console.log('accountInfo', accountInfoResponse)

  if (!accountInfoResponse || accountInfoResponse.hasOwnProperty('error')) {
    return null
  }

  const accountInfo = accountInfoResponse as AccountInfo

  return (
    <p>{`balance: ${accountInfo.balance.amount} ${accountInfo.balance.currency}`}</p>
  )
}

const ChainElement = ({ chain }: { chain: Chain }) => {
  const accountId = process.env.DEV_ACCOUNT_ID

  return (
    <div
      style={{ backgroundColor: '#ededed', marginTop: 10, marginBottom: 10 }}
    >
      <p>{chain.chainId}</p>
      {chain.networks.map((network) => (
        <>
          {network.servers.map((server) => (
            <p>{`${server.host} status: ${server.status} (${server.lastCheck})`}</p>
          ))}
          <Suspense fallback="Loading...">
            <AccountInfo chainId={chain.chainId} accountId={accountId} />
          </Suspense>
        </>
      ))}
    </div>
  )
}

const ChainsList = () => {
  const [chains] = useAtom(chainsAtom)
  return (
    <>
      {chains.map((chain) => (
        <ChainElement key={chain.chainId} chain={chain} />
      ))}
    </>
  )
}

export default function Home() {
  return (
    <div className="container">
      <h2>Available Chains</h2>
      <Suspense fallback="Loading...">
        <ChainsList />
      </Suspense>
    </div>
  )
}

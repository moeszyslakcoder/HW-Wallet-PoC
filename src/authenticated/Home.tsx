import React, { useEffect } from 'react'
import { useObservable } from '@ngneat/use-observable'
import { Chain, chains$, watchChainStoreStatus } from '../data/chains'
import { fetchChains } from '../data/chains'
import './Home.scss'
import {
  accountInfoByIds$,
  fetchAccountInfo,
  watchAccountInfoStoreStatus,
} from '../data/accountInfo'

const AccountInfo = ({
  chainId,
  accountId,
}: {
  chainId: string
  accountId: string
}) => {
  useEffect(() => {
    fetchAccountInfo({
      chainId: chainId,
      accountId,
    }).subscribe()
  }, [chainId, accountId])

  const [{ value: status }] = useObservable(watchAccountInfoStoreStatus)
  const [accountInfo] = useObservable(accountInfoByIds$(chainId, accountId))
  console.log('accountinfo status', status)
  console.log('accountInfo', accountInfo)

  if (!accountInfo || !accountInfo.accountId) {
    return null
  }

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
          <AccountInfo chainId={chain.chainId} accountId={accountId} />
        </>
      ))}
    </div>
  )
}
export default function Home() {
  const [chains] = useObservable(chains$)
  const [{ value: status }] = useObservable(watchChainStoreStatus)
  useEffect(() => {
    fetchChains().subscribe()
  }, [])
  return (
    <div className="container">
      <h2>Available Chains</h2>
      {status === 'success' ? undefined : '...loading'}
      {chains.map((chain) => (
        <ChainElement key={chain.chainId} chain={chain} />
      ))}
    </div>
  )
}

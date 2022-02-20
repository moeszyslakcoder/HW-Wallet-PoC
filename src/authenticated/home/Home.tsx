import React, { Suspense, useRef } from 'react'
import { useAtom } from 'jotai'
import useScrollInfo from 'react-element-scroll-hook'
import './Home.scss'
import { Chain, chainsAtom } from '../../data/chains'
import { AccountInfo, accountInfoAtom } from '../../data/accountinfo'
import { ledgerAtom } from '../../data/ledger'

const capitalise = (str: string | undefined) => {
  if (!str) return str

  return str[0].toUpperCase() + str.slice(1)
}

const CurrentLedgerValue = () => {
  const [ledger] = useAtom(ledgerAtom)
  return <>{`${capitalise(ledger)} Ledger >`}</>
}

const CurrentLedger = () => {
  return (
    <div className="ledger-container">
      <Suspense fallback="...loading">
        <CurrentLedgerValue />
      </Suspense>
    </div>
  )
}

const TokenRow = ({ amount, currency }) => (
  <div className="token-row-container">
    <div className="logo" />
    <div className="token-name">{currency}</div>
    <div className="details">
      <p className="fiat-price">£141.48</p>
      <p className="token-quantity">{`${parseFloat(amount).toFixed(
        3,
      )} ${currency}`}</p>
    </div>
  </div>
)

const WalletBalance = () => {
  const [ledger] = useAtom(ledgerAtom)
  const [accountInfoResponse] = useAtom(
    accountInfoAtom({
      chainId: ledger,
      accountId: process.env.DEV_ACCOUNT_ID,
    }),
  )

  if (!accountInfoResponse || accountInfoResponse.hasOwnProperty('error')) {
    return null
  }

  const accountInfo = accountInfoResponse as AccountInfo

  return (
    <p className="balance-content">{`${parseFloat(
      accountInfo.balance.amount,
    ).toFixed(4)} ${accountInfo.balance.currency}`}</p>
  )
}

const Hero = ({ ...props }) => (
  <div className="hero" {...props}>
    <Suspense fallback="...">
      <WalletBalance />
    </Suspense>
    <p className="balance-subtitle">Wallet Balance</p>
    <div className="actions">
      <button className="action">
        <div>
          <div className="icon-send" />
          Send
        </div>
      </button>
      <div />
      <button className="action">
        <div>
          <div className="icon-receive" />
          Receive
        </div>
      </button>
    </div>
  </div>
)

const TokenRows = () => {
  const [ledger] = useAtom(ledgerAtom)
  const [accountInfoResponse] = useAtom(
    accountInfoAtom({
      chainId: ledger,
      accountId: process.env.DEV_ACCOUNT_ID,
    }),
  )

  if (!accountInfoResponse || accountInfoResponse.hasOwnProperty('error')) {
    const style = {
      marginTop: 10,
      marginBottom: 10,
      height: 100,
      backgroundColor: 'rosybrown',
      width: '100%',
    }
    return (
      <>
        <div style={style} />
        <div style={style} />
        <div style={style} />
        <div style={style} />
        <div style={style} />
        <div style={{ ...style, backgroundColor: 'blue' }} />
      </>
    )
  }

  const accountInfo = accountInfoResponse as AccountInfo

  return (
    <>
      {accountInfo.subAccounts.map(({ balance: { amount, currency } }) => (
        <TokenRow amount={amount} currency={currency} />
      ))}
    </>
  )
}

export default function Home() {
  const scrollOffset = 400
  const [scrollInfo, setRef] = useScrollInfo()

  const progress = Math.min(scrollInfo.y.value / 200, 1)
  const heroOpacity = 1 - progress

  return (
    <div className="home-container">
      <div className="header">
        <div className="logo-container">
          <div className="logo" />
        </div>
        <CurrentLedger />
      </div>
      <div className="content">
        <div ref={setRef} className="scrollContainer">
          <div className="scrollContent" style={{ marginTop: scrollOffset }}>
            <div className="scroll-hint">
              <div />
            </div>
            <Suspense fallback="">
              <TokenRows />
            </Suspense>
          </div>
        </div>
        <div className="overlay">
          <Hero style={{ opacity: heroOpacity }} />
        </div>
      </div>
      <div className="footer">
        <div className="footerSide">
          <div className="footerLink wallet active" />
          <div className="footerLink ledger" />
        </div>

        <div className="footerCenter">
          <div className="footerLink scan" />
        </div>
        <div className="footerSide">
          <div className="footerLink transfer" />
          <div className="footerLink vault" />
        </div>
      </div>
    </div>
  )
}

import { atom, Atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import axios from 'axios'

interface Balance {
  amount: string
  issuer: string
  currency: string
}

export interface AccountInfo {
  accountId: string
  chainId: string
  network: string
  server: string
  balance: Balance
  value: Balance
  subAccounts: {
    accountId: string
    balance: Balance
  }[]
  lastTransactionId: string
  nonce: string
  errors: {
    category: string
    severity: string
    message: string
  }[]
}

interface AccountParams {
  chainId: string
  accountId: string
}

interface AccountInfoError {
  timestamp: number
  status: number
  error: string
  message: string
  path: string
}

type AccountInfoResponse = AccountInfo | AccountInfoError

export const accountInfoAtom = atomFamily<
  AccountParams,
  Atom<AccountInfoResponse>
>(
  ({ chainId, accountId }) =>
    // @ts-ignore
    atom<AccountInfoResponse>(async (get) => {
      console.log('fetching account info')
      try {
        const response = await axios.get(
          `https://api.keyconnect.app/v1/blockchains/${chainId}/accounts/${accountId}`,
        )
        return response.data as AccountInfo
      } catch (err) {
        console.log(err.response.data)
        return err.response.data
      }
    }),
  (a, b) => a.chainId === b.chainId && a.accountId === b.accountId,
)

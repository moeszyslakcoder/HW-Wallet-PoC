import { Store, createState, withProps, select } from '@ngneat/elf'
import {
  withEntities,
  selectAll,
  selectEntityByPredicate,
  addEntities,
} from '@ngneat/elf-entities'
import { fromFetch } from 'rxjs/fetch'
import { tap } from 'rxjs/operators'
import {
  withRequestsStatus,
  selectRequestStatus,
  createRequestsStatusOperator,
  updateRequestStatus,
} from '@ngneat/elf-requests'

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

const { state, config } = createState(
  withEntities<AccountInfo, 'accountId'>({ idKey: 'accountId' }),
  withRequestsStatus<'accountinfos'>(),
)

const accountInfosStore = new Store({ name: 'accountinfos', state, config })

export const watchAccountInfoStoreStatus = accountInfosStore.pipe(
  selectRequestStatus('accountinfos', { groupKey: '' }),
)

watchAccountInfoStoreStatus.subscribe((status) => {
  console.log('accountinfo status', status)
})

export const accountInfoByIds$ = (chainId: string, accountId: string) =>
  accountInfosStore.pipe(
    selectEntityByPredicate(
      ({ accountId: thisAccountId, chainId: thisChainId }) =>
        thisAccountId === accountId && thisChainId === chainId,
    ),
  )

export const trackAccountInfosRequestsStatus = createRequestsStatusOperator(
  accountInfosStore,
)

export const setAccountInfos = (accountInfos: AccountInfo[]) =>
  accountInfosStore.update(
    addEntities(accountInfos),
    updateRequestStatus('accountinfos', 'success'),
  )

export const fetchAccountInfo = ({
  chainId,
  accountId,
}: {
  chainId: string
  accountId: string
}) => {
  console.log('fetchAccountInfo')
  return fromFetch<AccountInfo[]>(
    `https://api.keyconnect.app/v1/blockchains/${chainId}/accounts/${accountId}`,
    {
      selector: (response) => response.json(),
    },
  ).pipe(tap(setAccountInfos), trackAccountInfosRequestsStatus('accountinfos'))
}

import { Store, createState, withProps, select } from '@ngneat/elf'
import {
  withEntities,
  selectAll,
  setEntities,
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

export interface Chain {
  chainId: string
  networks: {
    group: string
    servers: {
      host: string
      status: 'healthy' | 'unhealthy'
      lastCheck: string
    }[]
  }[]
}

const { state, config } = createState(
  //   withProps<TodosProps>({ filter: 'ALL' }),
  withEntities<Chain, 'chainId'>({ idKey: 'chainId' }),
  withRequestsStatus<'chains'>(),
)

const chainsStore = new Store({ name: 'chains', state, config })

export const watchChainStoreStatus = chainsStore.pipe(
  selectRequestStatus('chains'),
)

watchChainStoreStatus.subscribe((status) => {
  console.log('chains status', status)
})

export const chains$ = chainsStore.pipe(selectAll())

export const trackChainsRequestsStatus = createRequestsStatusOperator(
  chainsStore,
)

export const setChains = (chains: Chain[]) =>
  chainsStore.update(
    addEntities(chains),
    updateRequestStatus('chains', 'success'),
  )

export const fetchChains = () => {
  console.log('fetchChains')
  return fromFetch<Chain[]>(
    'https://api.keyconnect.app/v1/blockchains/status',
    {
      selector: (response) => response.json().then((data) => data.blockchains),
    },
  ).pipe(tap(setChains), trackChainsRequestsStatus('chains'))
}

import { atom } from 'jotai'
import axios from 'axios'

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

// @ts-ignore
export const chainsAtom = atom<Chain[]>(async (get) => {
  console.log('fetching blockchains')
  const response = await axios.get(
    'https://api.keyconnect.app/v1/blockchains/status',
  )
  return response.data.blockchains as Chain[]
})

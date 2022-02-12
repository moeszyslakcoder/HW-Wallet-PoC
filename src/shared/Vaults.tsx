import { Store, createState, withProps, select } from '@ngneat/elf'
import { persistState, localStorageStrategy } from '@ngneat/elf-persist-state'
import crypto from 'webcrypto'
const bip39 = require('bip39')
import ethers from 'ethers'

interface VaultProps {
  encryptedSeedPhrase: string | undefined
  unencryptedSeedPhrase: string | undefined
}

const { state, config } = createState(
  withProps<VaultProps>({
    encryptedSeedPhrase: undefined,
    unencryptedSeedPhrase: undefined,
  }),
)

const vaultStore = new Store({ state, name: 'vault', config })

const persist = persistState(vaultStore, {
  key: 'vault',
  storage: localStorageStrategy,
  preStoreInit: (props) => {
    const data = {
      ...props,
      unencryptedSeedPhrase: undefined,
    }
    console.log('data', data)
    return data
  },
})

export const encryptedSeedPhrase$ = vaultStore.pipe(
  select((store) => store.encryptedSeedPhrase),
)

export const unencryptedSeedPhrase$ = vaultStore.pipe(
  select((store) => store.unencryptedSeedPhrase),
)

export const isVaultSetup$ = vaultStore.pipe(
  select((store) => store.encryptedSeedPhrase !== undefined),
)

export const isVaultUnlocked$ = vaultStore.pipe(
  select((store) => store.unencryptedSeedPhrase !== undefined),
)

export const wallet$ = vaultStore.pipe(
  select((store) => ethers.Wallet.fromMnemonic(store.unencryptedSeedPhrase)),
)

export const createNewWallet = (password: string) => {
  console.log('createNewWallet')
  const seedPhrase = bip39.generateMnemonic()
  console.log(seedPhrase)

  const cipher = crypto.createCipher('aes256', password)
  const encrypted =
    cipher.update(seedPhrase, 'utf8', 'hex') + cipher.final('hex')

  vaultStore.update((state) => ({
    ...state,
    encryptedSeedPhrase: encrypted,
    unencryptedSeedPhrase: seedPhrase,
  }))
}

export const unlockWallet = (encryptedSeedphrase: string, password: string) => {
  const decipher = crypto.createDecipher('aes256', password)
  const seedPhrase =
    decipher.update(encryptedSeedphrase, 'hex', 'utf8') + decipher.final('utf8')

  console.log('unlockWallet unlocking', seedPhrase)
  vaultStore.update((state) => ({
    ...state,
    unencryptedSeedPhrase: seedPhrase,
  }))
}

import React, { useState } from 'react'
import { useObservable } from '@ngneat/use-observable'
import {
  encryptedSeedPhrase$,
  unencryptedSeedPhrase$,
  unlockWallet,
} from '../shared/Vaults'
import RoutePaths from '../shared/Routes'
import { useNavigate } from 'react-router-dom'
import './UnlockWallet.scss'

export default function UnlockWallet() {
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [encryptedSeedPhrase] = useObservable(encryptedSeedPhrase$)
  const navigate = useNavigate()
  console.log('encryptedSeedPhrase', encryptedSeedPhrase)

  unencryptedSeedPhrase$.subscribe((seedPhrase) => {
    console.log('seed phrase unlock update', seedPhrase)
    if (seedPhrase !== undefined && seedPhrase.length > 0) {
      navigate(RoutePaths.SeedPhrase)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    unlockWallet(encryptedSeedPhrase, password)
  }
  return (
    <div className="container">
      <h3>Unlock your wallet</h3>
      <p>Please enter your passphrase</p>
      <form onSubmit={handleSubmit}>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordError('')
            }}
          />
        </label>
        <p className="error">{passwordError}</p>
        <input type="submit" value="Unlock" />
      </form>
    </div>
  )
}

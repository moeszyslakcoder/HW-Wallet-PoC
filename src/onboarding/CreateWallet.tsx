import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createNewWallet, unencryptedSeedPhrase$ } from '../shared/Vaults'
import RoutePaths from '../shared/Routes'
import './CreateWallet.scss'

export default function CreateWallet() {
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [passwordConfirmError, setPasswordConfirmError] = useState('')
  const navigate = useNavigate()

  unencryptedSeedPhrase$.subscribe((seedPhrase) => {
    console.log('seed phrase create update', seedPhrase)
    if (seedPhrase !== undefined && seedPhrase.length > 0) {
      navigate(RoutePaths.SeedPhrase)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== passwordConfirm) {
      setPasswordConfirmError('Passwords do not match. Please double check')
    } else {
      console.log('calling create wallet')
      createNewWallet(password)
    }
  }
  return (
    <div className="container">
      <h3>Create a new wallet</h3>
      <p>
        Please provide a secure password you'll use to access your wallet with
        in the future
      </p>
      <form onSubmit={handleSubmit}>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordConfirmError('')
            }}
          />
        </label>
        <label>
          Password Again:
          <input
            type="password"
            name="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => {
              setPasswordConfirm(e.target.value)
              setPasswordConfirmError('')
            }}
          />
        </label>
        <p className="error">{passwordConfirmError}</p>
        <input type="submit" value="Create wallet" />
      </form>
    </div>
  )
}

import React from 'react'
import { useObservable } from '@ngneat/use-observable'
import './SeedPhrase.scss'
import { unencryptedSeedPhrase$ } from '../shared/Vaults'

export default function SeedPhrase() {
  const [unencryptedSeedPhrase] = useObservable(unencryptedSeedPhrase$)
  return <div className="container">{unencryptedSeedPhrase}</div>
}

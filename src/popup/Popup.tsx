import React, { useEffect } from 'react'
import { useObservable } from '@ngneat/use-observable'
import Welcome from '../onboarding/Welcome'
import AddWallet from '../onboarding/AddWallet'
import CreateWallet from '../onboarding/CreateWallet'
import UnlockWallet from '../onboarding/UnlockWallet'
import SeedPhrase from '../onboarding/SeedPhrase'
import RoutePaths from '../shared/Routes'
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom'
import './Popup.scss'
import { isVaultSetup$, isVaultUnlocked$ } from '../shared/Vaults'

const LockedRoute = () => {
  const [isVaultUnlocked] = useObservable(isVaultUnlocked$)
  console.log('isVaultUnlocked', isVaultUnlocked)

  return isVaultUnlocked ? <Outlet /> : <Navigate to={RoutePaths.Welcome} />
}

export default function Popup() {
  useEffect(() => {
    // Example of how to send a message to eventPage.ts.
    chrome.runtime.sendMessage({ popupMounted: true })
  }, [])

  const [isVaultSetup] = useObservable(isVaultSetup$)
  const [isVaultUnlocked] = useObservable(isVaultUnlocked$)
  console.log('isVaultSetup', isVaultSetup)
  console.log('isVaultUnlocked', isVaultUnlocked)

  const initialEntries = isVaultSetup
    ? [RoutePaths.UnlockWallet]
    : [RoutePaths.Welcome]

  return (
    <div className="popupContainer">
      <Router initialEntries={initialEntries}>
        <Routes>
          <Route path={RoutePaths.Welcome} element={<Welcome />} />
          <Route path={RoutePaths.AddWallet} element={<AddWallet />} />
          <Route path={RoutePaths.CreateWallet} element={<CreateWallet />} />
          <Route path={RoutePaths.UnlockWallet} element={<UnlockWallet />} />
          <Route path={RoutePaths.SeedPhrase} element={<LockedRoute />}>
            <Route path={RoutePaths.SeedPhrase} element={<SeedPhrase />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

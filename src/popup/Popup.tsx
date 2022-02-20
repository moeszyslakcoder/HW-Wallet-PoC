import React, { useEffect } from 'react'
import { useObservable } from '@ngneat/use-observable'
import Welcome from '../unauthenticated/Welcome'
import AddWallet from '../unauthenticated/AddWallet'
import CreateWallet from '../unauthenticated/CreateWallet'
import UnlockWallet from '../unauthenticated/UnlockWallet'
import SeedPhrase from '../unauthenticated/SeedPhrase'
import Home from '../authenticated/home/Home'
import RoutePaths from '../shared/Routes'
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'
import './Popup.scss'
import { isVaultSetup$, isVaultUnlocked$ } from '../shared/Vaults'

const SetupRoute = () => {
  const [isVaultSetup] = useObservable(isVaultSetup$)

  const location = useLocation()
  console.log('location', location)

  if (!isVaultSetup) {
    return <Navigate to={RoutePaths.Welcome} />
  }

  return <Outlet />
}

const LockedRoute = () => {
  const [isVaultUnlocked] = useObservable(isVaultUnlocked$)

  if (!isVaultUnlocked) {
    return <Navigate to={RoutePaths.UnlockWallet} />
  }

  return <Outlet />
}

// const LockedRoute = ({ redirect } : {redirect: string}) => {
//   const [isVaultUnlocked] = useObservable(isVaultUnlocked$)
//   console.log('isVaultUnlocked', isVaultUnlocked)

//   return isVaultUnlocked ? <Outlet /> : <Navigate to={redirect} />
// }

export default function Popup() {
  // useEffect(() => {
  //   // Example of how to send a message to eventPage.ts.
  //   chrome.runtime.sendMessage({ popupMounted: true })
  // }, [])

  const [isVaultSetup] = useObservable(isVaultSetup$)
  const [isVaultUnlocked] = useObservable(isVaultUnlocked$)
  console.log('isVaultSetup', isVaultSetup)
  console.log('isVaultUnlocked', isVaultUnlocked)

  return (
    <div className="popupContainer">
      <Router initialEntries={[RoutePaths.Home]}>
        <Routes>
          <Route path={RoutePaths.Welcome} element={<Welcome />} />
          <Route path={RoutePaths.AddWallet} element={<AddWallet />} />
          <Route path={RoutePaths.CreateWallet} element={<CreateWallet />} />
          <Route path={RoutePaths.UnlockWallet} element={<SetupRoute />}>
            <Route path={RoutePaths.UnlockWallet} element={<UnlockWallet />} />
          </Route>
          <Route path={RoutePaths.Home} element={<LockedRoute />}>
            <Route path={RoutePaths.Home} element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

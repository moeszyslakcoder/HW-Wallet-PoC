import React, { useEffect } from 'react'
import Welcome from '../onboarding/Welcome'
import AddWallet from '../onboarding/AddWallet'
import CreateWallet from '../onboarding/CreateWallet'
import RoutePaths from '../shared/Routes'
import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './Popup.scss'

export default function Popup() {
  useEffect(() => {
    // Example of how to send a message to eventPage.ts.
    chrome.runtime.sendMessage({ popupMounted: true })
  }, [])

  return (
    <div className="popupContainer">
      <Router>
        <Routes>
          <Route path={RoutePaths.Welcome} element={<Welcome />} />
          <Route path={RoutePaths.AddWallet} element={<AddWallet />} />
          <Route path={RoutePaths.CreateWallet} element={<CreateWallet />} />
        </Routes>
      </Router>
    </div>
  )
}

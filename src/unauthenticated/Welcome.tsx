import React, { MouseEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'
import RoutePaths from '../shared/Routes'
import './Welcome.scss'

const Logo = () => (
  <div
    style={{
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    }}
  >
    <div className="logo" />
    <h2>Hash Works</h2>
  </div>
)

const Button = ({
  text,
  tertiary = false,
  onClick,
}: {
  text: string
  tertiary?: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
}) => {
  const classes = ['button']
  if (tertiary) {
    classes.push('tertiary')
  }
  return (
    <button onClick={onClick} className={classes.join(' ')}>
      {text}
    </button>
  )
}

export default function Welcome() {
  const navigate = useNavigate()
  return (
    <div className="container">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <Logo />
      </div>
      <div
        style={{
          flexDirection: 'column',
          display: 'flex',
        }}
      >
        <Button
          text="Create new wallet"
          onClick={() => navigate(RoutePaths.CreateWallet)}
        />
        <Button
          text="Already have a wallet"
          tertiary
          onClick={() => navigate(RoutePaths.AddWallet)}
        />
      </div>
    </div>
  )
}

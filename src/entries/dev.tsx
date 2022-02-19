import * as React from 'react'
import * as ReactDOM from 'react-dom'
// import reportWebVitals from './reportWebVitals'
import Popup from '../popup/Popup'

ReactDOM.render(
  <React.StrictMode>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Popup />
    </div>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
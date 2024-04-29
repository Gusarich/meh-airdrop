import React from 'react'
import ReactDOM from 'react-dom/client'
import * as buffer from "buffer";
import { BrowserRouter as Router } from "react-router-dom";
// @ts-ignore
window.Buffer = buffer.Buffer;
import './index.css'
import App from './App'
import { TonConnectUIProvider } from "@tonconnect/ui-react";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <TonConnectUIProvider manifestUrl="https://mishazhem.github.io/Anon_Meh/manifest.json">
    <React.StrictMode>
      <Router basename={"/meh-airdrop/"}>
        <App />
      </Router>
    </React.StrictMode>
  </TonConnectUIProvider>
)

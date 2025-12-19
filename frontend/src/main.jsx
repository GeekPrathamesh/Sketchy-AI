import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import {AppcontextProvider} from "./contexts/Appcontext.jsx"
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AppcontextProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </AppcontextProvider>
  </BrowserRouter>,
)

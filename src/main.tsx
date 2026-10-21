import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { CartProvider } from './store/cart'
import { shop } from './config/shop'
import './index.css'

const root = document.documentElement.style
root.setProperty('--brand-primary', shop.colors.primary)
root.setProperty('--brand-primary-soft', shop.colors.primarySoft)
root.setProperty('--brand-accent', shop.colors.accent)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)

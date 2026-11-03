import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/ui'

export default function NotFound() {
  usePageTitle('Page not found')
  return (
    <div className="container-x flex flex-col items-center py-20 text-center">
      <p className="eyebrow blink">Game over</p>
      <h1 className="mt-3 text-7xl text-ink">404</h1>
      <p className="mt-3 text-[17px] text-body">This page doesn’t exist. Insert coin to continue.</p>
      <div className="mt-6 grid gap-3 sm:flex">
        <Link to="/" className="btn btn-lime">Back to home</Link>
        <Link to="/shop" className="btn btn-ghost">Shop all products</Link>
      </div>
    </div>
  )
}

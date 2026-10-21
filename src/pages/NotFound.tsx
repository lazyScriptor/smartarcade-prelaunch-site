import { Gamepad2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-x flex flex-col items-center py-24 text-center">
      <Gamepad2 className="h-16 w-16 text-navy" strokeWidth={1.5} />
      <h1 className="mt-6 text-5xl font-extrabold text-navy">404</h1>
      <p className="mt-2 text-slate-600">Game over — this page doesn’t exist.</p>
      <Link to="/" className="btn btn-lime mt-6">Back to home</Link>
    </div>
  )
}

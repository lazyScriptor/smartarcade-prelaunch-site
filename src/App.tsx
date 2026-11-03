import { Component, lazy, Suspense, useEffect, useRef, type ReactNode } from 'react'
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import AddedToast from './components/AddedToast'
import CookieBanner from './components/CookieBanner'
import Footer from './components/Footer'
import Header from './components/Header'
import WhatsAppFloat from './components/WhatsAppFloat'
import Home from './pages/Home'

const CatalogPage = lazy(() => import('./pages/CatalogPage'))
const CatalogProductPage = lazy(() => import('./pages/CatalogProductPage'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Faq = lazy(() => import('./pages/Faq'))
const Policy = lazy(() => import('./pages/Policy'))
const NotFound = lazy(() => import('./pages/NotFound'))

// A page chunk can fail to load on a bad connection or just after a new deploy; offer a way out, not a blank screen.
class PageBoundary extends Component<{ children: ReactNode; resetKey: string }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidUpdate(previous: { resetKey: string }) {
    if (previous.resetKey !== this.props.resetKey && this.state.failed) this.setState({ failed: false })
  }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-2xl text-white">This page didn’t load</h1>
        <p className="mt-2 text-muted">Check your connection and try again.</p>
        <button className="btn btn-lime mt-6" onClick={() => window.location.reload()}>Reload page</button>
      </div>
    )
  }
}

function PageLoading() {
  return (
    <div className="container-x py-8" role="status" aria-label="Loading page">
      <div className="skeleton h-9 w-2/3 max-w-sm" />
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[0, 1, 2, 3].map(key => <div key={key} className="skeleton aspect-[3/4]" />)}
      </div>
    </div>
  )
}

function RouteEffects({ mainRef }: { mainRef: React.RefObject<HTMLElement | null> }) {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()
  const lastType = useRef(navigationType)
  lastType.current = navigationType
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    // Back and forward keep the browser's restored position; new pages start at the top.
    if (lastType.current !== 'POP') window.scrollTo({ top: 0, behavior: 'instant' })
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname, mainRef]) // only real page changes: filter and search updates keep the scroll position and focus
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-lime focus:px-4 focus:py-3 focus:font-semibold focus:text-navy">Skip to content</a>
      <RouteEffects mainRef={mainRef} />
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1} className="flex-1">
        <PageBoundary resetKey={pathname}>
          <Suspense fallback={<PageLoading />}>
            <div key={pathname} className="page-in">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<CatalogPage />} />
                <Route path="/shop/:category" element={<CatalogPage />} />
                <Route path="/product/:id" element={<CatalogProductPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/policies/:slug" element={<Policy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Suspense>
        </PageBoundary>
      </main>
      <Footer />
      <AddedToast />
      <WhatsAppFloat />
      <CookieBanner />
    </div>
  )
}

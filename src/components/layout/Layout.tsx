import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { FloatingWidgets } from '../widgets/FloatingWidgets'
import { CookieNotice } from './CookieNotice'
import { trackPageView } from '../../lib/analytics'

export function Layout() {
  const { pathname, hash } = useLocation()

  // A new page starts at the top, the way a server-rendered site would — but an
  // in-page anchor keeps its target.
  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, hash])

  // The counter sees one page load for the whole site, so every route change
  // is reported by hand. It no-ops until a visitor has accepted the notice.
  useEffect(() => {
    trackPageView(pathname + hash)
  }, [pathname, hash])

  // Anchors that arrive with the navigation need the target to exist first.
  useEffect(() => {
    if (!hash) return
    const target = document.querySelector(hash)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash, pathname])

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingWidgets />
      <CookieNotice />
    </div>
  )
}

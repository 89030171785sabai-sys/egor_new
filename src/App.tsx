import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { StaticPage } from './pages/StaticPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { routes } from './lib/routes'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={<StaticPage route={route} />} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

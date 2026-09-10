import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { ModelPage } from './pages/ModelPage'
import { LegalPage } from './pages/LegalPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { legalRoutes, modelRoutes } from './lib/routes'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        {modelRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<ModelPage slug={route.path.slice(1)} />}
          />
        ))}
        {legalRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<LegalPage slug={route.path.replace('/', '')} />}
          />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

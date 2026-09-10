import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { ModelPage } from './pages/ModelPage'
import { LegalPage } from './pages/LegalPage'
import {
  CatalogPage,
  ContactsPage,
  DeliveryPage,
  FaqPage,
  GuaranteesPage,
  ProductionPage,
} from './pages/SectionPages'
import { NotFoundPage } from './pages/NotFoundPage'
import { legalRoutes, modelRoutes } from './lib/routes'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/production" element={<ProductionPage />} />
        <Route path="/delivery" element={<DeliveryPage />} />
        <Route path="/guarantees" element={<GuaranteesPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
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

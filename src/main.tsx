import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import { Layout } from './components/Layout'
import { ServicePage } from './pages/ServicePage'
import { servicesData } from './pages/services'
import { LanguageProvider } from './hooks/useLanguage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          {Object.entries(servicesData).map(([slug, data]) => (
            <Route
              key={slug}
              path={`/servicos/${slug}`}
              element={
                <Layout>
                  <ServicePage data={data} slug={slug} />
                </Layout>
              }
            />
          ))}
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
)

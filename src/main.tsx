import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import { Layout } from './components/Layout'
import { ServicePage } from './pages/ServicePage'
import { WebsitesPage } from './pages/WebsitesPage'
import { servicesData } from './pages/services'
import { LanguageProvider } from './hooks/useLanguage'
import { ThemeProvider } from './hooks/useTheme'
import { PrivacyPage } from './pages/PrivacyPage'
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
    <ThemeProvider>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/privacidade" element={<Layout><PrivacyPage /></Layout>} />
          <Route path="/servicos/sites" element={<Layout><WebsitesPage /></Layout>} />
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
    </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
)

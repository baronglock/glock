import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import { Layout } from './components/Layout'
import { ServicePage } from './pages/ServicePage'
import { servicesData } from './pages/services'
import { LanguageProvider } from './hooks/useLanguage'
import { ThemeProvider } from './hooks/useTheme'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermosPage } from './pages/TermosPage'
import { CheckoutPage } from './pages/CheckoutPage'
import DemoSplashPage from './pages/DemoSplashPage'
import DemoListPage from './pages/DemoListPage'
import KillSpyLanding from './pages/killspy/KillSpyLanding'
import KillSpyLogin from './pages/killspy/KillSpyLogin'
import KillSpyRegister from './pages/killspy/KillSpyRegister'
import KillSpyDashboard from './pages/killspy/KillSpyDashboard'
import KillSpyAdmin from './pages/killspy/KillSpyAdmin'
import KillSpyForgotPassword from './pages/killspy/KillSpyForgotPassword'
import KillSpyResetPassword from './pages/killspy/KillSpyResetPassword'
import KillSpyPix from './pages/killspy/KillSpyPix'
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
          <Route path="/termos" element={<Layout><TermosPage /></Layout>} />
          <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
          <Route path="/killspy" element={<KillSpyLanding />} />
          <Route path="/conta/login" element={<KillSpyLogin />} />
          <Route path="/conta/register" element={<KillSpyRegister />} />
          <Route path="/conta/dashboard" element={<KillSpyDashboard />} />
          <Route path="/conta/admin" element={<KillSpyAdmin />} />
          <Route path="/conta/forgot-password" element={<KillSpyForgotPassword />} />
          <Route path="/conta/reset-password" element={<KillSpyResetPassword />} />
          <Route path="/conta/pix" element={<KillSpyPix />} />
          <Route path="/demo" element={<DemoListPage />} />
          <Route path="/demo/:slug" element={<DemoSplashPage />} />
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

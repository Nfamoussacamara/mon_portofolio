import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/features/Hero';
import { About } from './components/features/About';
import { Education } from './components/features/Education';
import { Skills } from './components/features/Skills';
import { Projects } from './components/features/Projects';
import { BlogPreview } from './components/features/BlogPreview';
import { CallToAction } from './components/features/CallToAction';
import { Contact } from './components/features/Contact';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { ToastProvider } from './context/ToastContext';

import { Login } from './pages/admin/Login';
import { AdminLayout } from './pages/admin/AdminLayout';

const queryClient = new QueryClient();

// Composant regroupant tout le site public
const PublicPortfolio = () => {
  useEffect(() => {
    // Scroller vers le haut (Hero) au chargement de la page
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] font-sans text-[var(--text-primary)] relative">
      <Navbar />
      <main className="w-full pt-12">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <BlogPreview />
        <CallToAction />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

// Portail d'administration avec token JWT
const AdminPortal = () => {
  const [token, setToken] = useState<string | null>(null);

  if (!token) {
    return <Login onLogin={(tk) => setToken(tk)} />;
  }

  return (
    <AdminLayout token={token} onLogout={() => setToken(null)} />
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/s-admin/*" element={<AdminPortal />} />
            <Route path="/*" element={<PublicPortfolio />} />
          </Routes>
        </Router>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;

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

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[var(--bg-primary)] font-sans text-[var(--text-primary)]">
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
    </QueryClientProvider>
  );
}

export default App;

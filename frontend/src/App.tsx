import { motion } from 'framer-motion';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Navbar } from './components/layout/Navbar';
import { Button } from './components/ui/Button';
import { About } from './components/features/About';
import { Skills } from './components/features/Skills';
import { Projects } from './components/features/Projects';
import { BlogPreview } from './components/features/BlogPreview';
import { Contact } from './components/features/Contact';
import { Footer } from './components/layout/Footer';

const TECHS = [
  { name: 'React',       icon: 'https://cdn.simpleicons.org/react/61DAFB' },
  { name: 'TypeScript',  icon: 'https://cdn.simpleicons.org/typescript/3178C6' },
  { name: 'Python',      icon: 'https://cdn.simpleicons.org/python/3776AB' },
  { name: 'Django',      icon: 'https://cdn.simpleicons.org/django/092E20' },
  { name: 'Docker',      icon: 'https://cdn.simpleicons.org/docker/2496ED' },
  { name: 'PostgreSQL',  icon: 'https://cdn.simpleicons.org/postgresql/4169E1' },
  { name: 'Redis',       icon: 'https://cdn.simpleicons.org/redis/FF4438' },
  { name: 'Linux',       icon: 'https://cdn.simpleicons.org/linux/FCC624' },
  { name: 'Git',         icon: 'https://cdn.simpleicons.org/git/F05032' },
  { name: 'Node.js',     icon: 'https://cdn.simpleicons.org/nodedotjs/339933' },
  { name: 'Tailwind',    icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
  { name: 'GraphQL',     icon: 'https://cdn.simpleicons.org/graphql/E10098' },
];

// ── Composant HeroText avec Intro Centrée & Transition ──────────────────────────────
function HeroText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.inOut" } });

      // Masquer tout au début
      gsap.set([".hero-title-1", ".hero-sub", ".hero-btns", ".navbar-anim", ".hero-photo-container", ".scroll-indicator"], { opacity: 0, y: 15 });
      gsap.set([".hero-name", ".hero-role"], { opacity: 0 });

      // 1. CALCUL DES OFFSETS DU CENTRE POUR LES DEUX
      const nameBounds = nameRef.current?.getBoundingClientRect();
      const roleBounds = roleRef.current?.getBoundingClientRect();

      if (nameBounds && roleBounds) {
        // Offset Nom
        const nameCX = window.innerWidth / 2 - (nameBounds.left + nameBounds.width / 2);
        const nameCY = window.innerHeight / 2 - (nameBounds.top + nameBounds.height / 2) - 30; // Un peu plus haut
        
        // Offset Rôle
        const roleCX = window.innerWidth / 2 - (roleBounds.left + roleBounds.width / 2);
        const roleCY = window.innerHeight / 2 - (roleBounds.top + roleBounds.height / 2) + 40; // Un peu plus bas

        gsap.set(".hero-name-container", { x: nameCX, y: nameCY });
        gsap.set(".hero-role-container", { x: roleCX, y: roleCY });
      }

      // 2. RÉVÉLATION DU NOM (CENTRE)
      tl.to(".reveal-bar-name", {
        scaleX: 1,
        duration: 0.6,
        transformOrigin: "left",
        delay: 0.6
      })
      .set(".hero-name", { opacity: 1 })
      .to(".reveal-bar-name", {
        scaleX: 0,
        duration: 0.6,
        transformOrigin: "right"
      })

      // 3. RÉVÉLATION DU MÉTIER (CENTRE)
      .to(".reveal-bar-role", {
        scaleX: 1,
        duration: 0.5,
        transformOrigin: "left"
      }, "-=0.1")
      .set(".hero-role", { opacity: 1 })
      .to(".reveal-bar-role", {
        scaleX: 0,
        duration: 0.5,
        transformOrigin: "right"
      })

      // 4. LES DEUX REJOIGNENT LEURS PLACES (Le nom en premier)
      .to(".hero-name-container", {
        x: 0,
        y: 0,
        duration: 1.2,
        ease: "power4.inOut",
        delay: 0.3
      })
      .to(".hero-role-container", {
        x: 0,
        y: 0,
        duration: 1.2,
        ease: "power4.inOut"
      }, "-=1")

      // 5. APPARITION FINALE DU RESTE
      .to(".navbar-anim", {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, "-=0.5")

      .to(".hero-title-1", {
        opacity: 0.6,
        y: 0,
        duration: 0.5
      }, "-=0.7")

      .to([".hero-sub", ".hero-btns"], {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8
      }, "-=0.4")

      .to(".hero-photo-container", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power2.out"
      }, "-=0.8")

      // Scroll indicator en dernier
      .to(".scroll-indicator", {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, "-=0.3");

    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="order-2 lg:order-1 pt-4">

      {/* Greeting */}
      <div className="hero-title-1 mb-2 opacity-0">
        <h1 className="text-xl md:text-2xl font-medium tracking-tight text-white/70">
          Bonjour, je suis
        </h1>
      </div>
      
      {/* LE NOM */}
      <div ref={nameRef} className="hero-name-container relative inline-block mb-4">
        <div className="relative inline-block overflow-hidden">
          <h1 className="hero-name text-4xl md:text-6xl lg:text-[80px] font-extrabold leading-tight tracking-tighter text-white whitespace-nowrap">
            N'famoussa Camara
          </h1>
          <div className="reveal-bar-name absolute inset-0 bg-blue-500 z-10 scale-x-0" />
        </div>
      </div>

      {/* LE MÉTIER */}
      <div ref={roleRef} className="hero-role-container mb-8 relative inline-block">
        <div className="relative inline-block overflow-hidden">
          <h2 className="hero-role block text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
            Développeur Full-Stack
          </h2>
          <div className="reveal-bar-role absolute inset-0 bg-indigo-500 z-10 scale-x-0" />
        </div>
      </div>

      {/* Sous-titre */}
      <p className="hero-sub opacity-0 text-lg text-[var(--text-muted)] max-w-md leading-relaxed mb-10">
        Spécialisé en Cybersécurité, React & Django. Je construis des applications
        robustes, sécurisées et prêtes pour la production.
      </p>

      {/* Boutons */}
      <div className="hero-btns opacity-0 flex flex-wrap gap-3">
        <Button size="lg" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
          Voir mes projets
        </Button>
        <Button size="lg" variant="outline" onClick={() => window.open('/cv.pdf', '_blank')}>
          Mon CV
        </Button>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] font-sans text-[var(--text-primary)]">
      <div className="navbar-anim opacity-0">
        <Navbar />
      </div>

      <main className="w-full pt-12">
        {/* ── HERO ────────────────────────────────── */}
        <section id="home" className="relative pt-0 pb-24 md:pb-32 overflow-hidden">
          {/* Ambient glow - déplacé vers le bas pour éviter la navbar */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-48 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/4 rounded-full blur-[100px]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left: Text */}
              <HeroText />

              {/* Right: Photo */}
              <div className="hero-photo-container opacity-0 relative w-full max-w-[520px] mx-auto lg:ml-auto lg:mr-0 order-1 lg:order-2 self-end">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-600/10 to-transparent rounded-full blur-3xl translate-y-20" />
                <div className="relative aspect-[4/5] flex items-end justify-center overflow-visible">
                  <img
                    src="/profil-removebg-preview.png"
                    alt="Photo de profil"
                    className="w-full h-full object-contain object-bottom transform scale-115 origin-bottom"
                  />
                </div>
              </div>
            </div>

            {/* Scroll Indicator - Déplacé au-dessus du marquee pour éviter le chevauchement */}
            <div className="scroll-indicator opacity-0 flex flex-col items-center gap-2 mb-6 -mt-16">
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Découvrir</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-500"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </motion.div>
            </div>

            {/* ── FUSED TECH MARQUEE ───────────────────── */}
            <div className="border-t border-white/5 pt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="marquee-wrapper flex select-none" aria-hidden="true">
                  <div className="flex shrink-0 animate-marquee items-center gap-16 pr-16">
                    {TECHS.map((tech, i) => (
                      <div key={`hero-tech1-${i}`} className="tech-logo-item">
                        <img src={tech.icon} alt={tech.name} className="tech-logo-img" />
                        <span className="tech-logo-label">{tech.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex shrink-0 animate-marquee items-center gap-16 pr-16">
                    {TECHS.map((tech, i) => (
                      <div key={`hero-tech2-${i}`} className="tech-logo-item">
                        <img src={tech.icon} alt={tech.name} className="tech-logo-img" />
                        <span className="tech-logo-label">{tech.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTIONS ──────────────────────────── */}
        <About />
        <Skills />
        <Projects />
        <BlogPreview />
        
        {/* ── FINAL CTA ─────────────────────────── */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/5 pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-12 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-black border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]" />
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Prêt à sécuriser & scaler<br />vos applications ?
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                Basé sur les standards de l'industrie, je transforme vos idées en produits robustes.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="primary" size="lg" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                  Démarrer un projet
                </Button>
                <Button variant="outline" size="lg" onClick={() => window.open('https://linkedin.com', '_blank')}>
                  Me suivre sur LinkedIn
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;

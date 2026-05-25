import { motion } from 'framer-motion';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '../ui/Button';

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

function HeroText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Bloquer le scroll au montage
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ 
        defaults: { ease: "expo.inOut" },
        onComplete: () => {
          // Débloquer le scroll quand l'animation est finie
          document.body.style.overflow = '';
        }
      });

      // Masquer tout au début
      gsap.set([".hero-title-1", ".hero-sub", ".hero-btns", ".hero-photo-container", ".scroll-indicator"], { opacity: 0, y: 40 });
      gsap.set([".hero-name", ".hero-role"], { opacity: 0 });

      // 1. CALCUL DES OFFSETS DU CENTRE POUR LES DEUX (TOUTES RÉSOLUTIONS)
      const nameBounds = nameRef.current?.getBoundingClientRect();
      const roleBounds = roleRef.current?.getBoundingClientRect();

      if (nameBounds && roleBounds) {
        // Animation cinématique qui part du centre pour tous les écrans
        const nameCX = window.innerWidth / 2 - (nameBounds.left + nameBounds.width / 2);
        const nameCY = window.innerHeight / 2 - (nameBounds.top + nameBounds.height / 2) - 30;
        
        const roleCX = window.innerWidth / 2 - (roleBounds.left + roleBounds.width / 2);
        const roleCY = window.innerHeight / 2 - (roleBounds.top + roleBounds.height / 2) + 40;

        gsap.set(".hero-name-container", { x: nameCX, y: nameCY });
        gsap.set(".hero-role-container", { x: roleCX, y: roleCY });
      }

      // Même ordre de révélation sur tous les écrans : NOM d'abord, puis MÉTIER
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

      // 4. DÉPLACEMENT VERS LES POSITIONS FINALES
      // Sur mobile : métier part EN PREMIER vers sa place, puis le nom
      // Sur desktop : nom part EN PREMIER vers sa place, puis le métier
      const isMobile = window.innerWidth < 1024;

      if (isMobile) {
        tl.to(".hero-role-container", {
          x: 0,
          y: 0,
          duration: 1.2,
          ease: "power4.inOut",
          delay: 0.3
        })
        .to(".hero-name-container", {
          x: 0,
          y: 0,
          duration: 1.2,
          ease: "power4.inOut"
        }, "-=1");
      } else {
        tl.to(".hero-name-container", {
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
        }, "-=1");
      }

      // 5. APPARITION FINALE DU RESTE
      tl.to(".hero-title-1", {
        opacity: 0.6,
        y: 0,
        duration: 0.7,
        ease: "power2.out"
      }, "-=0.5")

      tl.to([".hero-sub", ".hero-btns"], {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4")

      tl.to(".hero-photo-container", {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power2.out"
      }, "-=0.8")

      // Scroll indicator en dernier
      tl.to(".scroll-indicator", {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, "-=0.3");

    });

    return () => {
      document.body.style.overflow = '';
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="order-2 lg:order-1 pt-4 flex flex-col items-center lg:items-start text-center lg:text-left">

      {/* Greeting */}
      <div className="hero-title-1 mb-2 opacity-0">
        <h1 className="text-xl md:text-2xl font-medium tracking-tight text-white/70">
          Bonjour, je suis
        </h1>
      </div>
      
      {/* LE NOM */}
      <div ref={nameRef} className="hero-name-container relative mb-4">
        <div className="relative inline-block overflow-hidden">
          <h1 className="hero-name text-4xl md:text-6xl lg:text-[80px] font-extrabold leading-tight tracking-tighter text-white sm:whitespace-nowrap">
            N'famoussa Camara
          </h1>
          <div className="reveal-bar-name absolute inset-0 bg-blue-500 z-10 scale-x-0" />
        </div>
      </div>

      {/* LE MÉTIER */}
      <div ref={roleRef} className="hero-role-container mb-8 relative">
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
      <div className="hero-btns opacity-0 flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto">
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

export function Hero() {
  return (
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
          <div className="hero-photo-container opacity-0 relative w-4/5 max-w-[320px] mx-auto lg:w-full lg:max-w-[520px] lg:ml-auto lg:mr-0 order-1 lg:order-2 self-end">
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

        {/* Scroll Indicator */}
        <div className="scroll-indicator opacity-0 flex flex-col items-center gap-2 mb-6 mt-6 md:-mt-16">
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
        <motion.div
          className="border-t border-white/5 pt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
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
        </motion.div>
      </div>
    </section>
  );
}

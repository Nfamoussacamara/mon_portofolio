import { motion } from 'framer-motion';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '../ui/Button';
import { getSkillIconUrl, normalizeProfile, resolveMediaUrl, usePublicProfile, usePublicSkills } from '../../lib/siteContent';

function HeroText() {
  const { data: profile } = usePublicProfile();
  const content = normalizeProfile(profile);
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
      gsap.set([".hero-title-1", ".hero-sub", ".hero-btns", ".hero-photo-container", ".scroll-indicator", ".hero-badge"], { opacity: 0, y: 40 });
      gsap.set([".hero-name", ".hero-role"], { opacity: 0 });
      gsap.set(".navbar-anim", { opacity: 0, y: -20 });

      // 1. CALCUL DES OFFSETS DU CENTRE (TOUTES RÉSOLUTIONS)
      // ... (code existant)
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

      tl.to([".hero-badge", ".hero-sub", ".hero-btns"], {
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

      tl.to(".navbar-anim", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.6");

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
        <h1 className="text-xl md:text-2xl font-medium tracking-tight text-[var(--text-muted)]">
          Expertise & Innovation
        </h1>
      </div>
      
      {/* LE NOM */}
      <div ref={nameRef} className="hero-name-container relative mb-2 md:mb-4">
        <div className="relative inline-block overflow-hidden">
          <h1 className="hero-name text-3xl md:text-6xl lg:text-[80px] font-extrabold leading-tight tracking-tighter text-[var(--text-primary)] sm:whitespace-nowrap">
            {content.full_name}
          </h1>
          <div className="reveal-bar-name absolute inset-0 bg-blue-500 z-10 scale-x-0" />
        </div>
      </div>

      {/* LE MÉTIER */}
      <div ref={roleRef} className="hero-role-container mb-2 md:mb-4 relative">
        <div className="relative inline-block overflow-hidden">
          <h2 className="hero-role block text-xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
            {content.hero_title}
          </h2>
          <div className="reveal-bar-role absolute inset-0 bg-indigo-500 z-10 scale-x-0" />
        </div>
      </div>

      <div className="hero-badge mb-4 md:mb-6">
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] md:text-xs font-medium ${content.available_for_hire ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/20 bg-amber-500/10 text-amber-400'}`}>
          Ouvert aux collaborations stratégiques
        </span>
      </div>

      {/* Flèche scroll mobile uniquement - Toujours visible sur mobile au centre */}
      <div className="hero-btns lg:hidden flex justify-center mb-0 mt-4">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </div>

      {/* Sous-titre - Caché sur mobile, visible sur desktop */}
      <p className="hero-sub opacity-0 hidden md:block text-base md:text-lg text-[var(--text-muted)] max-w-md leading-relaxed mb-6 md:mb-10">
        Ingénieur Full-Stack spécialisé dans la conception d'architectures résilientes, d'APIs haute performance et de solutions cloud sécurisées. J'aide les entreprises à transformer leurs défis technologiques en succès numériques.
      </p>

      {/* Boutons - Visibles sur tous les écrans */}
      <div className="hero-btns opacity-0 flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto justify-center lg:justify-start mt-8 md:mt-10">
        <Button size="lg" className="px-8 py-4 text-sm md:text-base w-full sm:w-auto" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
          Voir mes projets
        </Button>
        <button
          onClick={async () => {
            const localPath = '/cv/Mon_CV.pdf';
            const dynamicUrl = resolveMediaUrl(content.cv_file);

            try {
              const res = await fetch(localPath, { method: 'HEAD' });
              if (res.ok) {
                window.location.href = localPath;
                return;
              }
            } catch (err) {
              console.warn('Local CV not found, trying fallback...', err);
            }

            if (dynamicUrl && dynamicUrl !== localPath) {
              window.open(dynamicUrl, '_blank');
            } else {
              alert('CV temporairement indisponible.');
            }
          }}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-slate-200 dark:border-white/15 text-sm font-semibold text-slate-900 dark:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-200 cursor-pointer w-full sm:w-auto"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Mon CV
        </button>
      </div>
    </div>
  );
}

export function Hero() {
  const { data: profile } = usePublicProfile();
  const { data: skills } = usePublicSkills();
  const content = normalizeProfile(profile);
  const techs = (skills?.length ? skills : []).map((skill) => ({
    name: skill.name,
    icon: getSkillIconUrl(skill),
  }));
  const techMarquee = techs.length ? techs : [
    { name: 'React', icon: getSkillIconUrl({ name: 'React', icon_name: 'react' }) },
    { name: 'TypeScript', icon: getSkillIconUrl({ name: 'TypeScript', icon_name: 'typescript' }) },
    { name: 'Python', icon: getSkillIconUrl({ name: 'Python', icon_name: 'python' }) },
    { name: 'Django', icon: getSkillIconUrl({ name: 'Django', icon_name: 'django' }) },
  ];

  return (
    <section id="home" className="relative pt-0 pb-0 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-48 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/4 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left: Text */}
          <HeroText />

          {/* Right: Photo */}
          <div className="hero-photo-container opacity-0 relative w-[240px] md:w-3/4 max-w-[320px] mx-auto lg:w-full lg:max-w-[520px] lg:ml-auto lg:mr-0 order-1 lg:order-2 self-end">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-600/10 to-transparent rounded-full blur-3xl translate-y-20" />
            <div className="relative aspect-[4/5] flex items-end justify-center overflow-visible">
              <img
                src={resolveMediaUrl(content.avatar_url) || '/profil-removebg-preview.png'}
                alt={`Photo de profil de ${content.full_name}`}
                className="w-full h-full object-contain object-bottom transform scale-110 md:scale-115 origin-bottom"
              />
            </div>
          </div>
        </div>


        {/* Scroll Indicator - Uniquement sur Desktop */}
        <div className="scroll-indicator opacity-0 hidden lg:flex flex-col items-center gap-2 mb-6 mt-6 md:-mt-16">
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-700 font-bold">Explorez mon univers</span>
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


        {/* TECH MARQUEE - Centrage parfait (Responsive) */}
        <motion.div
          className="border-t border-b border-[var(--border-card)] py-8 md:py-12 mt-10 md:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="marquee-wrapper flex items-center justify-center select-none" aria-hidden="true">
              <div className="flex shrink-0 animate-marquee items-center gap-16 pr-16">
                {techMarquee.map((tech, i) => (
                  <div key={`hero-tech1-${i}`} className="tech-logo-item">
                    <img src={tech.icon} alt={tech.name} className="tech-logo-img" />
                    <span className="tech-logo-label">{tech.name}</span>
                  </div>
                ))}
              </div>
              <div className="flex shrink-0 animate-marquee items-center gap-16 pr-16">
                {techMarquee.map((tech, i) => (
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

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fallbackEducation, usePublicEducation } from '../../lib/siteContent';

gsap.registerPlugin(ScrollTrigger);

export const Education = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const centralLineRef = useRef<HTMLDivElement>(null);
  const { data: education } = usePublicEducation();
  const educationList = (education?.length ? education : fallbackEducation)
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((item) => ({
      year: item.end_year === 'Présent' || item.end_year === item.start_year ? item.start_year : `${item.start_year} - ${item.end_year}`,
      degree: item.title,
      school: item.institution,
      description: item.description,
    }));

  useEffect(() => {
    if (!containerRef.current || !centralLineRef.current) return;
    
    // Animation de la grande ligne verticale
    gsap.fromTo(
      centralLineRef.current,
      { height: 0 },
      {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          end: 'bottom 80%',
          scrub: 1,
        }
      }
    );

    // Animation de chaque row (tiret + carte + noeud)
    const rows = gsap.utils.toArray<HTMLElement>('.timeline-row');
    
    rows.forEach((row, index) => {
      const isLeft = index % 2 === 0;
      const dot = row.querySelector('.timeline-dot');
      const point = row.querySelector('.timeline-inner-point');
      const line = row.querySelector('.timeline-line');
      const card = row.querySelector('.timeline-card');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      tl.fromTo(dot, 
        { scale: 0, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' },
        0
      )
      .fromTo(line,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.4, ease: 'power3.out' },
        0
      )
      .fromTo(card,
        { x: isLeft ? -30 : 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' },
        0
      )
      .to(point, { backgroundColor: '#ffffff', scale: 1.2, duration: 0.15, yoyo: true, repeat: 1 }, 0.2);
    });

  }, [educationList.length]);

  return (
    <section className="py-16 md:py-28 relative overflow-hidden bg-[var(--bg-primary)]" ref={containerRef}>
      {/* Glow d'arrière-plan */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <p className="text-sm font-mono font-medium text-blue-500 uppercase tracking-widest mb-3">
            // Parcours
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5 leading-tight">
            Éducation &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Parcours Académique</span>
          </h2>
        </div>

        {/* Ligne de temps */}
        <div className="relative max-w-3xl mx-auto pb-10">
          {/* Ligne verticale */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-white/10 md:-translate-x-1/2" />
          
          {/* Ligne lumineuse SCROLL (GSAP Scrub) */}
          <div 
            ref={centralLineRef}
            className="absolute left-6 md:left-1/2 top-0 w-px bg-gradient-to-b from-blue-500 via-indigo-500 to-transparent md:-translate-x-1/2 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
          />

          <div className="space-y-12 md:space-y-24">
            {educationList.map((item, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div key={index} className="timeline-row relative w-full group py-4 md:py-0 md:h-[120px]">
                  
                  {/* Ligne de connexion horizontale */}
                  <div className={`timeline-line hidden md:block absolute top-1/2 -translate-y-1/2 w-[calc(50%-45%)] h-px bg-indigo-500/80 transition-colors duration-500 ${isLeft ? 'left-[45%] origin-right group-hover:bg-indigo-300' : 'right-[45%] origin-left group-hover:bg-indigo-300'}`} />

                  {/* Nœud Central */}
                  <div className="absolute left-6 md:left-1/2 top-8 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center z-20">
                    <div className="timeline-dot w-4 h-4 rounded-full bg-slate-200 dark:bg-[#1a1a1a] border-[2px] border-indigo-500 flex items-center justify-center group-hover:scale-150 group-hover:bg-indigo-500 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all duration-300 relative">
                      <div className="timeline-inner-point w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:bg-white transition-colors" />
                    </div>
                  </div>

                  {/* Carte */}
                  <div className={`ml-16 md:ml-0 md:absolute md:top-1/2 md:-translate-y-1/2 w-[calc(100%-5rem)] md:w-[45%] ${isLeft ? 'md:left-0 md:text-right' : 'md:right-0 md:text-left'} text-left`}>
                    <div className="timeline-card bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 p-6 rounded-2xl hover:border-indigo-500/40 dark:hover:border-white/25 transition-all duration-300 w-full relative z-10 cursor-default">
                      <span className="text-indigo-400 font-mono text-sm block mb-1">{item.year}</span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{item.degree}</h3>
                      <div className="text-slate-700 dark:text-white/40 text-sm font-medium mb-3 uppercase tracking-wider">{item.school}</div>
                      <p className="text-slate-700 dark:text-white/60 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

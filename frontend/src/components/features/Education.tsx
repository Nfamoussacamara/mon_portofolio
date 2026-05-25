import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EDUCATION_DATA = [
  {
    year: 'Actuellement',
    degree: 'Licence en Informatique',
    school: 'Université de Labé',
    description: 'Développement d\'algorithmes complexes, architecture web et cybersécurité.',
    align: 'left',
  },
  {
    year: '2021',
    degree: 'Baccalauréat Scientifique',
    school: 'Lycée',
    description: 'Forte dominante en mathématiques et sciences physiques.',
    align: 'right',
  },
  {
    year: '2018',
    degree: 'Brevet d\'Études du Premier Cycle',
    school: 'Collège',
    description: 'Formation générale et bases scientifiques.',
    align: 'left',
  },
  {
    year: '2014',
    degree: 'Certificat d\'Études Primaires',
    school: 'École Primaire',
    description: 'Premiers pas dans l\'apprentissage formel.',
    align: 'right',
  }
];

export const Education = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const centralLineRef = useRef<HTMLDivElement>(null);

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
          scrub: 1, // L'animation avance et recule de manière ultra fluide avec le scroll
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

      // TOUT s'enclenche immédiatement à la milliseconde '0' du déclenchement
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

  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-[var(--bg-primary)]" ref={containerRef}>
      {/* Glow d'arrière-plan */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <p className="text-sm font-mono font-medium text-blue-500 uppercase tracking-widest mb-3">
            // Parcours
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Éducation & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Parcours Académique</span>
          </h2>
        </div>

        {/* L'arbre / La ligne de temps */}
        <div className="relative max-w-3xl mx-auto pb-10">
          {/* Ligne verticale centrale statique */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
          
          {/* Ligne lumineuse SCROLL (GSAP Scrub) */}
          <div 
            ref={centralLineRef}
            className="absolute left-1/2 top-0 w-px bg-gradient-to-b from-blue-500 via-indigo-500 to-transparent -translate-x-1/2 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
          />

          <div className="space-y-24">
            {EDUCATION_DATA.map((item, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div key={index} className="timeline-row relative flex items-center justify-between w-full group">
                  
                  {/* Ligne de connexion horizontale animée GSAP */}
                  <div className={`timeline-line absolute top-1/2 -translate-y-1/2 w-[calc(50%-45%)] h-px bg-indigo-500/80 transition-colors duration-500 ${isLeft ? 'left-[45%] origin-right group-hover:bg-indigo-300' : 'right-[45%] origin-left group-hover:bg-indigo-300'}`} />

                  {/* Côté Gauche */}
                  <div className={`w-[45%] flex ${isLeft ? 'justify-end text-right' : 'justify-start'}`}>
                    {isLeft && (
                      <div className="timeline-card bg-[#111111] border border-white/10 p-6 rounded-2xl hover:border-white/25 transition-all duration-300 w-full relative z-10">
                        <span className="text-indigo-400 font-mono text-sm block mb-1">{item.year}</span>
                        <h3 className="text-xl font-bold text-white mb-1">{item.degree}</h3>
                        <div className="text-white/40 text-sm font-medium mb-3 uppercase tracking-wider">{item.school}</div>
                        <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Nœud Central */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20">
                    <div className="timeline-dot w-4 h-4 rounded-full bg-[#111111] border-[2px] border-indigo-500 flex items-center justify-center group-hover:scale-150 group-hover:bg-indigo-500 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all duration-300 relative">
                      <div className="timeline-inner-point w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:bg-white transition-colors" />
                    </div>
                  </div>

                  {/* Côté Droit */}
                  <div className={`w-[45%] flex ${!isLeft ? 'justify-start text-left' : 'justify-end'}`}>
                    {!isLeft && (
                      <div className="timeline-card bg-[#111111] border border-white/10 p-6 rounded-2xl hover:border-white/25 transition-all duration-300 w-full relative z-10">
                        <span className="text-indigo-400 font-mono text-sm block mb-1">{item.year}</span>
                        <h3 className="text-xl font-bold text-white mb-1">{item.degree}</h3>
                        <div className="text-white/40 text-sm font-medium mb-3 uppercase tracking-wider">{item.school}</div>
                        <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    )}
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

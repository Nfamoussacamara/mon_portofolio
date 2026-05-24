import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

const CountUp = ({ value, duration: _duration = 2 }: { value: string; duration?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const numericValue = parseInt(value);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(numericValue);
    }
  }, [isInView, numericValue, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        (ref.current as HTMLElement).textContent = Math.floor(latest).toString() + (value.includes('+') ? '+' : '');
      }
    });
  }, [springValue, value]);

  return <span ref={ref}>0</span>;
};

export const About = () => {
  const stats = [
    { label: 'Projets livrés', value: '12+' },
    { label: "Ans d'expérience", value: '3+' },
    { label: 'Technologies', value: '20+' }
  ];

  const highlights = [
    { title: 'Architecture Enterprise', desc: 'Conception SOLID, patterns DDD et Clean Architecture appliqués sur chaque projet.' },
    { title: 'DevSecOps First', desc: 'Intégration de la sécurité dès la phase de conception, pas en option.' },
    { title: 'Full-Stack & Cloud', desc: 'React, Django, Docker, CI/CD — un pipeline complet de la DB à la prod.' },
  ];

  return (
    <section id="about" className="py-28 relative overflow-hidden bg-[var(--bg-secondary)] border-y border-white/5">
      {/* Fond ambiant subtil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <p className="text-sm font-mono font-medium text-blue-500 dark:text-blue-400 mb-3 tracking-widest uppercase">
            // about me
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5 leading-tight text-center">
            Développeur Full-Stack<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
              & Spécialiste Cybersécurité
            </span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto leading-relaxed">
            Je conçois des architectures robustes, sécurisées et évolutives. Mon approche combine
            performance, maintenabilité et expérience utilisateur d'avant-garde.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Col gauche: Highlights */}
          <div className="space-y-5">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group flex gap-4 p-5 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-sm bg-blue-500" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">{h.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{h.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Col droite: Stats + Texte */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[var(--text-muted)] text-base leading-relaxed mb-4"
            >
              Passionné par la conception logicielle et la cybersécurité, j'accompagne les entreprises
              dans la création d'écosystèmes web robustes, scalables et dotés d'une expérience
              utilisateur d'avant-garde.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[var(--text-muted)] text-base leading-relaxed mb-10"
            >
              Mon code est régi par les principes SOLID et la culture DevSecOps. Je ne code pas juste
              pour faire marcher l'application — je code pour qu'elle résiste au temps et aux failles.
            </motion.p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-center p-4 rounded-2xl border border-white/8 bg-white/3 dark:bg-white/2"
                >
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    <CountUp value={stat.value} />
                  </div>
                  <div className="text-xs text-[var(--text-muted)] leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { fadeLeft, fadeRight, staggerContainer, staggerItem, sectionHeader, defaultViewport } from '../../lib/animations';

const CountUp = ({ value }: { value: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const numericValue = parseInt(value);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });

  useEffect(() => { if (isInView) motionValue.set(numericValue); }, [isInView, numericValue, motionValue]);
  useEffect(() => {
    springValue.on('change', (latest) => {
      if (ref.current) ref.current.textContent = Math.floor(latest).toString() + (value.includes('+') ? '+' : '');
    });
  }, [springValue, value]);

  return <span ref={ref}>0</span>;
};

export const About = () => {
  const stats = [
    { label: 'Projets livrés', value: '12+' },
    { label: "Ans d'expérience", value: '3+' },
    { label: 'Technologies', value: '20+' },
  ];

  return (
    <section id="about" className="py-16 md:py-28 relative overflow-hidden bg-[var(--bg-secondary)] border-y border-white/5">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          variants={sectionHeader}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="mb-16 flex flex-col items-center text-center"
        >
          <p className="text-sm font-mono font-medium text-blue-500 mb-3 tracking-widest uppercase">
            // about me
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Développeur <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Full-Stack</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Col gauche */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="space-y-6"
          >
            <motion.p variants={fadeLeft} className="text-[var(--text-muted)] text-[1.1rem] leading-relaxed">
              Je suis <strong className="text-white">N'Famoussa Camara</strong>, développeur full-stack passionné par la conception d'applications web modernes, performantes et évolutives.
              Actuellement étudiant en informatique à l'Université de Labé, je développe des solutions numériques orientées résolution de problèmes réels avec une forte attention portée à l'architecture logicielle, à la qualité du code et à l'expérience utilisateur.
            </motion.p>
            <motion.p variants={fadeLeft} className="text-[var(--text-muted)] text-[1.1rem] leading-relaxed">
              Je travaille principalement avec <strong className="text-blue-400">React, Django REST Framework et PostgreSQL</strong> pour construire des applications full-stack rapides, maintenables et scalables.
              Je m'intéresse particulièrement au développement backend, aux APIs REST, aux architectures propres, aux principes SOLID ainsi qu'à l'optimisation des performances web.
            </motion.p>
          </motion.div>

          {/* Col droite */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            <motion.p variants={fadeRight} className="text-[var(--text-muted)] text-[1.1rem] leading-relaxed mb-12">
              Au-delà du développement, je m'intéresse également à la <strong className="text-indigo-400">cybersécurité, aux réseaux informatiques</strong> et à la conception de plateformes capables d'avoir un impact concret dans des domaines comme l'éducation, la santé numérique, l'immobilier et les services digitaux en Guinée.
            </motion.p>

            {/* Stats */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="grid grid-cols-3 gap-4"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={staggerItem}
                  className="text-center p-4 rounded-2xl border border-white/8 bg-white/2"
                >
                  <div className="text-3xl font-bold text-white mb-1">
                    <CountUp value={stat.value} />
                  </div>
                  <div className="text-xs text-[var(--text-muted)] leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

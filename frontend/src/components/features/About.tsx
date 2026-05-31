import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { fadeLeft, fadeRight, staggerContainer, staggerItem, sectionHeader, defaultViewport } from '../../lib/animations';
import { normalizeProfile, usePublicProfile } from '../../lib/siteContent';

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
  const { data: profile } = usePublicProfile();
  const content = normalizeProfile(profile);

  const stats = [
    { label: 'Projets livrés', value: `${content.projects_count}+` },
    { label: "Ans d'expérience", value: `${content.experience_years}+` },
    { label: 'Technologies', value: `${content.technologies_count}+` },
  ];

  const aboutParagraphs = content.about_text.split('\n\n').filter(Boolean);

  return (
    <section id="about" className="py-16 md:py-28 relative overflow-hidden bg-[var(--bg-secondary)] border-y border-slate-200 dark:border-white/5">
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
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5 leading-tight">
            À propos de moi
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
            {aboutParagraphs.map((paragraph, index) => {
              // Détection du nom (insensible à la casse par sécurité)
              const nameRegex = new RegExp(`(${content.full_name})`, 'gi');
              const parts = paragraph.split(nameRegex);
              
              const contentToRender = parts.map((part, i) => 
                part.toLowerCase() === content.full_name.toLowerCase() ? (
                  <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 font-extrabold uppercase">
                    {part}
                  </span>
                ) : part
              );

              return (
                <motion.p key={index} variants={fadeLeft} className="text-[var(--text-muted)] text-[1.1rem] leading-relaxed">
                  {contentToRender}
                </motion.p>
              );
            })}
          </motion.div>

          {/* Col droite */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            <motion.p variants={fadeRight} className="text-[var(--text-muted)] text-[1.1rem] leading-relaxed mb-12">
              {content.hero_subtitle}
            </motion.p>

            {/* Stats */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={staggerItem}
                  whileHover="hovered"
                  className="text-center p-4 rounded-2xl border border-slate-300 dark:border-white/5 bg-slate-100 dark:bg-white/5 hover:border-[#377BFF]/30 dark:hover:border-[#377BFF]/30 transition-all duration-300 group cursor-default"
                >
                  <motion.div 
                    className="text-3xl font-bold text-slate-900 dark:text-white mb-1"
                    variants={{
                      hovered: { scale: [1, 1.25, 1], transition: { duration: 0.4, ease: "easeInOut" } }
                    }}
                  >
                    <CountUp value={stat.value} />
                  </motion.div>
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

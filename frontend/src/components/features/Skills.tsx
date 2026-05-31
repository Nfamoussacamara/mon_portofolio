import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { sectionHeader, fadeLeft, fadeRight, defaultViewport } from '../../lib/animations';
import { fallbackSkills, usePublicSkills } from '../../lib/siteContent';
import { Skeleton } from '../ui/Skeleton';


// badgeVariants is now generated inside component to be theme-aware

export const Skills = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { data: skills, isLoading } = usePublicSkills();
  const skillList = skills?.length ? skills : fallbackSkills;

  const groupedSkills = {
    Backend: skillList.filter((skill) => skill.category === 'Backend'),
    Frontend: skillList.filter((skill) => skill.category === 'Frontend'),
    DevOps: skillList.filter((skill) => skill.category === 'DevOps'),
    Security: skillList.filter((skill) => skill.category === 'Soft' || skill.category === 'Other'),
  };
  const securitySkills = groupedSkills.Security.length ? groupedSkills.Security : groupedSkills.DevOps.slice(0, 5);

  const badgeVariants = (hoverBg: string, hoverBorder: string, hoverText?: string) => ({
    initial: {
      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)',
      color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(15,23,42,0.85)',
    },
    hover: {
      backgroundColor: hoverBg,
      borderColor: hoverBorder,
      ...(hoverText ? { color: hoverText } : { color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(15,23,42,1)' }),
      transition: { duration: 0.2 }
    }
  });

  return (
    <section id="skills" className="py-16 md:py-28 bg-[var(--bg-primary)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionHeader}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="mb-16 flex flex-col items-center text-center"
        >
          <p className="text-sm font-mono font-medium text-indigo-500 mb-3 tracking-widest uppercase text-center">
            // tech stack
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5 text-center">
            Mon arsenal <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">technique</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto leading-relaxed text-center">
            Une infrastructure asymétrique orientée performance, architecture cloud et sécurité absolue.
          </p>
        </motion.div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[auto]">

          {/* 1. BACKEND (Wide) */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            whileHover={{ 
              y: -8, 
              borderColor: 'rgba(139, 92, 246, 0.3)', 
              transition: { duration: 0.3 } 
            }}
            whileTap={{ 
              scale: 0.98,
              borderColor: 'rgba(139, 92, 246, 0.3)',
            }}
            viewport={defaultViewport}
            className="md:col-span-2 rounded-3xl border border-slate-200 dark:border-white/25 bg-white dark:bg-[#1a1a1a] relative min-h-[320px] will-change-transform cursor-pointer transition-colors duration-300"
          >
            <div className="p-8 relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Logic &amp; Backend</h3>
              </div>
              <p className="text-slate-700 dark:text-white/60 text-sm mb-8 max-w-md">Architecture distribuée, APIs RESTful, WebSockets et micro-services. Conception selon les principes SOLID pour des systèmes scalables.</p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20 rounded-xl" />
                  ))
                ) : (
                  groupedSkills.Backend.map((skill) => (
                    <motion.span
                      key={skill.id}
                      variants={badgeVariants('rgba(139,92,246,0.2)', 'rgba(139,92,246,0.3)')}
                      initial="initial"
                      whileHover="hover"
                      whileTap="hover"
                      className="px-4 py-2 rounded-xl font-mono text-xs font-semibold border cursor-pointer will-change-transform"
                    >
                      {skill.name}
                    </motion.span>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* 2. CYBERSECURITE (Square) */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            whileHover={{ 
              y: -8, 
              borderColor: 'rgba(239, 68, 68, 0.3)', 
              transition: { duration: 0.3 } 
            }}
            whileTap={{ 
              scale: 0.98,
              borderColor: 'rgba(239, 68, 68, 0.3)',
            }}
            viewport={defaultViewport}
            className="md:col-span-1 rounded-3xl border border-slate-200 dark:border-white/25 bg-white dark:bg-[#1a1a1a] relative min-h-[320px] will-change-transform cursor-pointer transition-colors duration-300"
          >
            <div className="p-8 relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center relative">
                  <motion.div
                    className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">DevSecOps</h3>
              </div>
              <p className="text-slate-700 dark:text-white/60 text-sm mb-8">Audits de sécurité, gestion des vulnérabilités (OWASP) et implémentation Zero Trust.</p>

              <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-16 rounded-lg" />
                  ))
                ) : (
                  [...securitySkills, ...groupedSkills.DevOps.filter((skill) => !securitySkills.some((item) => item.id === skill.id))].map((skill) => (
                    <motion.span
                      key={skill.id}
                      variants={badgeVariants('rgba(255,255,255,0.05)', 'rgba(239,68,68,0.5)', 'rgba(248,113,113,1)')}
                      initial="initial"
                      whileHover="hover"
                      whileTap="hover"
                      className="px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold border cursor-pointer will-change-transform"
                    >
                      {skill.name}
                    </motion.span>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* 3. FRONTEND (Square) */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            whileHover={{ 
              y: -8, 
              borderColor: 'rgba(6, 182, 212, 0.3)', 
              transition: { duration: 0.3 } 
            }}
            whileTap={{ 
              scale: 0.98,
              borderColor: 'rgba(6, 182, 212, 0.3)',
            }}
            viewport={defaultViewport}
            className="md:col-span-1 rounded-3xl border border-slate-200 dark:border-white/25 bg-white dark:bg-[#1a1a1a] relative min-h-[320px] will-change-transform cursor-pointer transition-colors duration-300"
          >
            <div className="p-8 relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-500"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Frontend</h3>
              </div>
              <p className="text-slate-700 dark:text-white/60 text-sm mb-8">Interfaces utilisateur ultra-réactives, animations fluides (60fps) et design pixel-perfect.</p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-7 w-16 rounded-lg" />
                  ))
                ) : (
                  groupedSkills.Frontend.map((skill) => (
                    <motion.span
                      key={skill.id}
                      variants={badgeVariants('rgba(6,182,212,0.2)', 'rgba(6,182,212,0.3)')}
                      initial="initial"
                      whileHover="hover"
                      whileTap="hover"
                      className="px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold border cursor-pointer will-change-transform"
                    >
                      {skill.name}
                    </motion.span>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* 4. DATA & CLOUD (Wide) */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            whileHover={{ 
              y: -8, 
              borderColor: 'rgba(16, 185, 129, 0.3)', 
              transition: { duration: 0.3 } 
            }}
            whileTap={{ 
              scale: 0.98,
              borderColor: 'rgba(16, 185, 129, 0.3)',
            }}
            viewport={defaultViewport}
            className="md:col-span-2 rounded-3xl border border-slate-200 dark:border-white/25 bg-white dark:bg-[#1a1a1a] relative min-h-[320px] will-change-transform cursor-pointer transition-colors duration-300"
          >
            <div className="p-8 relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Data &amp; Cloud</h3>
              </div>
              <p className="text-slate-700 dark:text-white/60 text-sm mb-6 max-w-md">Modélisation relationnelle complexe, indexation avancée, cache en mémoire et déploiement cloud résilient.</p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20 rounded-xl" />
                  ))
                ) : (
                  groupedSkills.DevOps.map((skill) => (
                    <motion.span
                      key={skill.id}
                      variants={badgeVariants('rgba(16,185,129,0.2)', 'rgba(16,185,129,0.3)')}
                      initial="initial"
                      whileHover="hover"
                      whileTap="hover"
                      className="px-4 py-2 rounded-xl font-mono text-xs font-semibold border cursor-pointer will-change-transform"
                    >
                      {skill.name}
                    </motion.span>
                  ))
                )}
              </div>
            </div>
          </motion.div>

        </div>  {/* fin grille */}
      </div>
    </section>
  );
};

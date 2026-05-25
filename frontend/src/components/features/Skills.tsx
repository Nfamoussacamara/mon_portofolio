import { motion } from 'framer-motion';
import { sectionHeader, fadeLeft, fadeRight, defaultViewport } from '../../lib/animations';
import type { Variants } from 'framer-motion';

const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];


// Variants pour les badges skill
const badgeVariants = (hoverBg: string, hoverBorder: string, hoverText?: string) => ({
  initial: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' },
  hover: {
    backgroundColor: hoverBg,
    borderColor: hoverBorder,
    ...(hoverText ? { color: hoverText } : {}),
    transition: { duration: 0.2 }
  }
});

export const Skills = () => {
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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 text-center">
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
            whileHover="hover"
            viewport={defaultViewport}
            className="md:col-span-2 rounded-[2rem] border border-white/10 bg-[#0d0d0d] overflow-hidden relative min-h-[320px]"
          >
            {/* Effet code en hologramme — Framer Motion via whileHover */}
            <motion.div
              variants={{ initial: { opacity: 0 }, hover: { opacity: 1, transition: { duration: 0.4 } } }}
              className="absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-t from-violet-500/10 via-transparent to-transparent pointer-events-none"
            />
            <div className="absolute -right-10 -bottom-10 opacity-10 font-mono text-[10px] leading-tight select-none pointer-events-none text-violet-500 max-w-xs break-all hidden sm:block">
              {`def authenticate(self, request):\n  auth = get_authorization_header(request).split()\n  if not auth or auth[0].lower() != b'bearer':\n    return None`}
            </div>

            <div className="p-8 relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Logic & Backend</h3>
              </div>
              <p className="text-white/60 text-sm mb-8 max-w-md">Architecture distribuée, APIs RESTful, WebSockets et micro-services. Conception selon les principes SOLID pour des systèmes scalables.</p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {['Python', 'Django', 'Django REST Framework', 'Node.js', 'GraphQL', 'Celery', 'RabbitMQ'].map((skill) => (
                  <motion.span
                    key={skill}
                    variants={badgeVariants('rgba(139,92,246,0.2)', 'rgba(139,92,246,0.3)')}
                    initial="initial"
                    whileHover="hover"
                    className="px-4 py-2 rounded-xl font-mono text-xs font-semibold border cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 2. CYBERSECURITE (Square) */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={defaultViewport}
            className="md:col-span-1 rounded-[2rem] border border-white/10 bg-[#0d0d0d] overflow-hidden relative min-h-[320px]"
          >
            {/* Scanner laser — Framer Motion animate */}
            <motion.div
              className="absolute inset-x-0 h-[2px] bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,1)] z-0"
              animate={{ y: ['0%', '3200%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
            />

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
                <h3 className="text-2xl font-bold text-white">DevSecOps</h3>
              </div>
              <p className="text-white/60 text-sm mb-8">Audits de sécurité, gestion des vulnérabilités (OWASP) et implémentation Zero Trust.</p>

              <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                {['OWASP Top 10', 'Pentesting', 'JWT / OAuth2', 'Docker', 'CI/CD (GitLab)'].map((skill) => (
                  <motion.span
                    key={skill}
                    variants={badgeVariants('rgba(255,255,255,0.05)', 'rgba(239,68,68,0.5)', 'rgba(248,113,113,1)')}
                    initial="initial"
                    whileHover="hover"
                    className="px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold border cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 3. FRONTEND (Square) */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={defaultViewport}
            className="md:col-span-1 rounded-[2rem] border border-white/10 bg-[#0d0d0d] overflow-hidden relative min-h-[320px]"
          >
            <motion.div
              variants={{ initial: { opacity: 0 }, hover: { opacity: 1, transition: { duration: 0.4 } } }}
              className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent pointer-events-none"
            />
            <div className="p-8 relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-500"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Frontend</h3>
              </div>
              <p className="text-white/60 text-sm mb-8">Interfaces utilisateur ultra-réactives, animations fluides (60fps) et design pixel-perfect.</p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {['React', 'TypeScript', 'Tailwind', 'Framer Motion', 'Zustand', 'React Query'].map((skill) => (
                  <motion.span
                    key={skill}
                    variants={badgeVariants('rgba(6,182,212,0.2)', 'rgba(6,182,212,0.3)')}
                    initial="initial"
                    whileHover="hover"
                    className="px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold border cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 4. DATA & CLOUD (Wide) */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={defaultViewport}
            className="md:col-span-2 rounded-[2rem] border border-white/10 bg-[#0d0d0d] overflow-hidden relative min-h-[320px]"
          >
            {/* Grid de fond animée au hover */}
            <motion.div
              variants={{
                initial: { opacity: 0.5 },
                hover: { opacity: 1, transition: { duration: 0.7 } }
              } as Variants}
              className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGg0MHYxSDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+CjxwYXRoIGQ9Ik0wIDB2NDBoMVYweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPgo8L3N2Zz4=')] pointer-events-none"
            />

            <div className="p-8 relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Data & Cloud</h3>
              </div>
              <p className="text-white/60 text-sm mb-6 max-w-md">Modélisation relationnelle complexe, indexation avancée, cache en mémoire et déploiement cloud résilient.</p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {['PostgreSQL', 'Redis', 'Elasticsearch', 'Prisma ORM', 'AWS / S3', 'NGINX'].map((skill) => (
                  <motion.span
                    key={skill}
                    variants={badgeVariants('rgba(16,185,129,0.2)', 'rgba(16,185,129,0.3)')}
                    initial="initial"
                    whileHover="hover"
                    className="px-4 py-2 rounded-xl font-mono text-xs font-semibold border cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

        </div>  {/* fin grille */}
      </div>
    </section>
  );
};

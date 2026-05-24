import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

export const Skills = () => {
  const skillCategories = [
    {
      title: 'Frontend',
      accent: 'from-blue-500 to-cyan-500',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite', 'React Query']
    },
    {
      title: 'Backend',
      accent: 'from-violet-500 to-purple-500',
      skills: ['Django', 'Python', 'Node.js', 'REST API', 'GraphQL', 'Celery']
    },
    {
      title: 'Base de données',
      accent: 'from-emerald-500 to-teal-500',
      skills: ['PostgreSQL', 'Redis', 'MySQL', 'Prisma', 'MongoDB']
    },
    {
      title: 'Cybersécurité',
      accent: 'from-orange-500 to-red-500',
      skills: ['OWASP Top 10', 'Linux', 'Pentest', 'JWT / OAuth', 'DevSecOps', 'Docker']
    }
  ];

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  };

  return (
    <section id="skills" className="py-28 bg-[var(--bg-primary)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <p className="text-sm font-mono font-medium text-indigo-500 dark:text-indigo-400 mb-3 tracking-widest uppercase text-center">
            // tech stack
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5 text-center">
            Mon arsenal <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">technique</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto leading-relaxed text-center">
            Une stack technique orientée performance, architecture d'entreprise et sécurité absolue.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-white/8 bg-white/2 dark:bg-white/[0.02] p-7 hover:border-white/15 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${cat.accent}`} />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{cat.title}</h3>
              </div>

              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-wrap gap-2"
              >
                {cat.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    variants={item}
                    className="px-3 py-1.5 rounded-lg font-mono text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-white/5 dark:border-white/8 dark:text-slate-300 hover:dark:bg-white/10 transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

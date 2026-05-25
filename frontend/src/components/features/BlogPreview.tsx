import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { sectionHeader, defaultViewport } from '../../lib/animations';
import type { Variants } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const mockPosts = [
  {
    id: 1,
    title: "Pourquoi l'architecture Clean est vitale en 2026",
    excerpt: "Découvrez comment structurer vos projets Django et React pour qu'ils durent des années sans devenir une dette technique.",
    date: "24 Mai 2026",
    category: "Architecture",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "Securing JWT: Les erreurs que vous faites probablement",
    excerpt: "HttpOnly, SameSite, Refresh Tokens... On fait le tour des bonnes pratiques pour sécuriser vos APIs Django REST.",
    date: "18 Mai 2026",
    category: "Cybersécurité",
    readTime: "8 min"
  }
];

// Variants typés explicitement pour éviter les erreurs TS
const headerVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } }
};

const leftCard: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.1, ease: EASE } }
};

const rightCard: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.1, ease: EASE } }
};

const titleHover: Variants = {
  initial: { color: 'rgba(255,255,255,1)' },
  hover: { color: '#a855f7', transition: { duration: 0.25 } }
};

const lineHover: Variants = {
  initial: { width: 24 },
  hover: { width: 40, transition: { duration: 0.25 } }
};

export const BlogPreview = () => {
  const cardVariantsList: Variants[] = [leftCard, rightCard];

  return (
    <section id="blog" className="py-16 md:py-28 bg-[var(--bg-primary)] border-t border-white/5 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          variants={sectionHeader}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="flex flex-col items-center mb-12 gap-6 text-center"
        >
          <div>
            <p className="text-sm font-mono font-medium text-purple-500 mb-3 tracking-widest uppercase">
              // technical blog
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              Pensées & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Articles</span>
            </h2>
          </div>
          <Button variant="outline">Voir tout le blog</Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockPosts.map((post, i) => (
            <motion.article
              key={post.id}
              variants={cardVariantsList[i]}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={defaultViewport}
              className="p-8 rounded-2xl border border-white/8 bg-white/2 flex flex-col h-full cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] px-2 py-1 rounded border border-white/10">
                  {post.category}
                </span>
                <span className="text-xs text-[var(--text-muted)]">{post.date}</span>
                <span className="text-xs text-[var(--text-muted)] ml-auto">{post.readTime}</span>
              </div>

              <motion.h3
                variants={titleHover}
                initial="initial"
                className="text-xl font-bold mb-4"
              >
                {post.title}
              </motion.h3>

              <p className="text-[var(--text-muted)] leading-relaxed mb-8 flex-1">
                {post.excerpt}
              </p>

              <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                Lire l'article
                <motion.div
                  variants={lineHover}
                  initial="initial"
                  className="h-px bg-current"
                />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

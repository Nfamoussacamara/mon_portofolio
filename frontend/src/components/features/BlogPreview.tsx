import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { sectionHeader, defaultViewport } from '../../lib/animations';
import type { Variants } from 'framer-motion';
import { fallbackBlogPosts, usePublicBlogPosts } from '../../lib/siteContent';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const leftCard: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.1, ease: EASE } }
};

const rightCard: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.1, ease: EASE } }
};



export const BlogPreview = () => {
  const { data: blogPosts } = usePublicBlogPosts();
  const cardVariantsList: Variants[] = [leftCard, rightCard];
  const posts = (blogPosts?.length ? blogPosts : fallbackBlogPosts).slice(0, 2);

  return (
    <section id="blog" className="py-16 md:py-28 bg-[var(--bg-primary)] border-t border-slate-200 dark:border-white/5 relative overflow-hidden">
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
              Pensées &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Articles</span>
            </h2>
          </div>
          <Button variant="outline">Voir tout le blog</Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              variants={cardVariantsList[i]}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="p-8 rounded-2xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/2 flex flex-col h-full cursor-pointer group hover:border-purple-500/30 dark:hover:border-purple-500/30 transition-colors duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] px-2 py-1 rounded border border-slate-200 dark:border-white/10">
                  {post.category}
                </span>
                <span className="text-xs text-[var(--text-muted)]">{post.date}</span>
                <span className="text-xs text-[var(--text-muted)] ml-auto">{post.readTime}</span>
              </div>

              <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors duration-300">
                {post.title}
              </h3>

              <p className="text-[var(--text-muted)] leading-relaxed mb-8 flex-1">
                {post.excerpt}
              </p>

              <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                Lire l'article
                <div className="h-px bg-current w-6 group-hover:w-10 transition-all duration-300" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

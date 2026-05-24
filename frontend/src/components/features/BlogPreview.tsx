import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

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

export const BlogPreview = () => {
  return (
    <section id="blog" className="py-28 bg-[var(--bg-primary)] border-t border-white/5 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-12 gap-6 text-center"
        >
          <div>
            <p className="text-sm font-mono font-medium text-purple-500 dark:text-purple-400 mb-3 tracking-widest uppercase">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-8 rounded-2xl border border-white/8 bg-white/2 hover:bg-white/4 hover:border-white/12 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] px-2 py-1 rounded border border-white/10">
                  {post.category}
                </span>
                <span className="text-xs text-[var(--text-muted)]">{post.date}</span>
                <span className="text-xs text-[var(--text-muted)] ml-auto">{post.readTime}</span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-purple-500 transition-colors">
                {post.title}
              </h3>
              
              <p className="text-[var(--text-muted)] leading-relaxed mb-8 flex-1">
                {post.excerpt}
              </p>
              
              <button className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 group/btn">
                Lire l'article
                <div className="w-6 h-px bg-current group-hover/btn:w-10 transition-all" />
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

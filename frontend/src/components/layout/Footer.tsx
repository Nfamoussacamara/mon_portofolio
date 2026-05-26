import { motion } from 'framer-motion';

const linkVariants = {
  initial: { color: 'rgba(161,161,170,1)' },
  hover: { color: 'rgba(255,255,255,1)', transition: { duration: 0.2 } }
};

export const Footer = () => {
  const links = [
    { label: 'À propos', href: '#about' },
    { label: 'Compétences', href: '#skills' },
    { label: 'Projets', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="border-t border-slate-200 dark:border-white/5 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-6 md:gap-8">
          
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-7 h-7 rounded bg-slate-900 dark:bg-white flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white dark:bg-black rounded-full" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Portofolio.
            </span>
          </motion.div>

          {/* Nav Links */}
          <nav className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {links.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                variants={linkVariants}
                initial="initial"
                whileHover="hover"
                className="text-sm"
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-sm text-center text-[var(--text-muted)] w-full md:w-auto">
            © {new Date().getFullYear()} — Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

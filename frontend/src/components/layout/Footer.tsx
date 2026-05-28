import { motion } from 'framer-motion';
import { normalizeProfile, usePublicProfile } from '../../lib/siteContent';

const IconFacebook = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M22 12C22 6.48 17.52 2 12 2S2 6.48 2 12c0 4.84 3.44 8.85 7.94 9.76v-6.91H7.9v-2.85h2.04V9.41c0-2.02 1.2-3.14 3.03-3.14.88 0 1.8.16 1.8.16v1.98h-1.01c-1 0-1.31.62-1.31 1.26v1.51h2.23l-.36 2.85h-1.87V21.8C18.56 20.85 22 16.84 22 12z" fill="currentColor"/>
  </svg>
);

const IconPhone = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M21 16.5a16 16 0 0 1-6.5-6.5l2.2-2.2a1 1 0 0 0 .24-1.05l-2-5a1 1 0 0 0-1-0.65C10.6 1 4 7.6 4 15.5a1 1 0 0 0 .65 1c1.7.7 3.5 1 5.3 1 1.2 0 2.1-.9 2.1-2v-2.2a1 1 0 0 0-.7-.98l-2.3-.7a11 11 0 0 0 4.9 4.9l.7-2.3a1 1 0 0 0-.98-.7H18c-1.1 0-2 .9-2 2 0 1.8.3 3.6 1 5.3a1 1 0 0 0 1 .65c7.9 0 14.5-6.6 14.5-14.5V6c0-.55-.45-1-1-1h-2.5c-.55 0-1 .45-1 1v2.5z" fill="currentColor"/>
  </svg>
);

const IconLinkedin = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.98h5V24H0V8.98zM8.98 8.98h4.79v2.04h.07c.67-1.27 2.31-2.61 4.75-2.61 5.09 0 6.03 3.35 6.03 7.7V24h-5V16.5c0-1.78-.03-4.07-2.48-4.07-2.48 0-2.86 1.94-2.86 3.95V24h-5V8.98z" fill="currentColor"/>
  </svg>
);

const linkVariants = {
  initial: { color: 'rgba(161,161,170,1)' },
  hover: { color: 'rgba(255,255,255,1)', transition: { duration: 0.2 } }
};

export const Footer = () => {
  const { data: profile } = usePublicProfile();
  const content = normalizeProfile(profile);

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
              {content.full_name}
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

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href={content.facebook_url || '#'} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-blue-600 transition-colors">
              <IconFacebook />
            </a>
            <a href={content.whatsapp_url || '#'} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-emerald-500 transition-colors">
              <IconPhone />
            </a>
            <a href={content.linkedin_url || '#'} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-blue-700 transition-colors">
              <IconLinkedin />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-center text-[var(--text-muted)] w-full md:w-auto">
            {content.footer_copyright 
              ? content.footer_copyright.replace('{year}', new Date().getFullYear().toString())
              : `© ${new Date().getFullYear()} — Tous droits réservés.`
            }
          </p>
        </div>
      </div>
    </footer>
  );
};

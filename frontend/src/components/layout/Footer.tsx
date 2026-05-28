import { motion } from 'framer-motion';
import { normalizeProfile, usePublicProfile } from '../../lib/siteContent';

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

  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

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
            <a href={content.whatsapp_url || '#'} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-emerald-500 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M20.52 3.48A11.95 11.95 0 0 0 12 0C5.37 0 .03 5.34.03 12c0 2.11.55 4.08 1.52 5.84L0 24l6.41-1.55A11.96 11.96 0 0 0 12 24c6.63 0 11.97-5.34 11.97-12 0-1.97-.46-3.84-1.45-5.52zM12 21.5c-1.75 0-3.47-.45-4.98-1.3l-.36-.21-3.8.92.95-3.7-.23-.38A9.49 9.49 0 0 1 2.5 12C2.5 6.14 6.64 2 12 2s9.5 4.14 9.5 10-4.14 9.5-9.5 9.5z" fill="currentColor"/>
                <path d="M17.2 14.1c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.18.2-.36.22-.66.07-.3-.15-1.27-.47-2.42-1.48-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.45 1.06 2.85 1.2 3.05.13.2 2.08 3.3 5.04 4.62 2.96 1.33 2.96.89 3.5.83.54-.06 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.08-.13-.3-.2-.6-.35z" fill="currentColor"/>
              </svg>
            </a>
            <a href={content.linkedin_url || '#'} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-blue-700 transition-colors">
              <IconLinkedin />
            </a>

            <a href="#contact" onClick={scrollToContact} className="ml-3 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              Contactez moi
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

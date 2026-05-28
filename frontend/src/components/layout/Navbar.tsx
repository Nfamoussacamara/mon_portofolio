import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { normalizeProfile, usePublicProfile } from '../../lib/siteContent';

export const Navbar = () => {
  const { data: profile } = usePublicProfile();
  const content = normalizeProfile(profile);
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'À propos', href: '#about' },
    { name: 'Compétences', href: '#skills' },
    { name: 'Projets', href: '#projects' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (href.startsWith('#')) {
      setTimeout(() => {
        const element = document.getElementById(href.substring(1));
        if (element) {
          const navbarHeight = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
          window.scrollTo({
             top: offsetPosition,
             behavior: 'smooth'
          });
        }
      }, 150);
    } else {
      window.location.href = href;
    }
  };

  return (
    <motion.nav
      animate={{
        backgroundColor: scrolled 
          ? (theme === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)') 
          : 'rgba(0,0,0,0)',
        backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
        borderBottomColor: scrolled 
          ? (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)') 
          : 'rgba(255,255,255,0)',
        boxShadow: scrolled 
          ? (theme === 'dark' ? '0 1px 0 rgba(255,255,255,0.05)' : '0 1px 0 rgba(0,0,0,0.05)') 
          : 'none',
      }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="navbar-anim fixed top-0 left-0 right-0 z-[100] w-full border-b border-transparent"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">

        {/* Left: Logo */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 cursor-pointer flex items-center gap-3 relative z-10"
        >
          <div className="w-8 h-8 rounded bg-slate-900 dark:bg-white flex items-center justify-center">
            <span className="text-sm font-semibold text-white dark:text-black">NC</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Portofolio.
          </span>
        </motion.div>

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-[15px] font-medium text-[var(--text-primary)] transition-opacity duration-200 hover:opacity-80"
            >
              {link.name}
            </motion.a>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-6 relative z-10">
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle Theme"
            className="flex items-center justify-center text-[var(--text-primary)] transition-opacity duration-200 hover:opacity-80"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          <div className="w-px h-6 bg-slate-200 dark:bg-[#333333]" />
          <a href={content.whatsapp_url || '#'} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-emerald-500 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M20.52 3.48A11.95 11.95 0 0 0 12 0C5.37 0 .03 5.34.03 12c0 2.11.55 4.08 1.52 5.84L0 24l6.41-1.55A11.96 11.96 0 0 0 12 24c6.63 0 11.97-5.34 11.97-12 0-1.97-.46-3.84-1.45-5.52zM12 21.5c-1.75 0-3.47-.45-4.98-1.3l-.36-.21-3.8.92.95-3.7-.23-.38A9.49 9.49 0 0 1 2.5 12C2.5 6.14 6.64 2 12 2s9.5 4.14 9.5 10-4.14 9.5-9.5 9.5z" fill="currentColor"/>
              <path d="M17.2 14.1c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.18.2-.36.22-.66.07-.3-.15-1.27-.47-2.42-1.48-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.45 1.06 2.85 1.2 3.05.13.2 2.08 3.3 5.04 4.62 2.96 1.33 2.96.89 3.5.83.54-.06 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.08-.13-.3-.2-.6-.35z" fill="currentColor"/>
            </svg>
          </a>

          <a href={content.linkedin_url || '#'} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-blue-700 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.98h5V24H0V8.98zM8.98 8.98h4.79v2.04h.07c.67-1.27 2.31-2.61 4.75-2.61 5.09 0 6.03 3.35 6.03 7.7V24h-5V16.5c0-1.78-.03-4.07-2.48-4.07-2.48 0-2.86 1.94-2.86 3.95V24h-5V8.98z" fill="currentColor"/>
            </svg>
          </a>

          <motion.a
            href="#contact"
            whileTap={{ scale: 0.97 }}
            onClick={(e) => scrollToSection(e, '#contact')}
            className="px-5 py-2.5 rounded-md text-[15px] font-medium transition-colors duration-200 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200"
          >
            Me Contacter
          </motion.a>
        </div>

        {/* Mobile: Burger */}
        <div className="md:hidden flex items-center gap-4">
          <a href={content.whatsapp_url || '#'} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-emerald-500 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M20.52 3.48A11.95 11.95 0 0 0 12 0C5.37 0 .03 5.34.03 12c0 2.11.55 4.08 1.52 5.84L0 24l6.41-1.55A11.96 11.96 0 0 0 12 24c6.63 0 11.97-5.34 11.97-12 0-1.97-.46-3.84-1.45-5.52zM12 21.5c-1.75 0-3.47-.45-4.98-1.3l-.36-.21-3.8.92.95-3.7-.23-.38A9.49 9.49 0 0 1 2.5 12C2.5 6.14 6.64 2 12 2s9.5 4.14 9.5 10-4.14 9.5-9.5 9.5z" fill="currentColor"/>
              <path d="M17.2 14.1c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.18.2-.36.22-.66.07-.3-.15-1.27-.47-2.42-1.48-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.45 1.06 2.85 1.2 3.05.13.2 2.08 3.3 5.04 4.62 2.96 1.33 2.96.89 3.5.83.54-.06 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.08-.13-.3-.2-.6-.35z" fill="currentColor"/>
            </svg>
          </a>

          <a href={content.linkedin_url || '#'} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-blue-700 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.98h5V24H0V8.98zM8.98 8.98h4.79v2.04h.07c.67-1.27 2.31-2.61 4.75-2.61 5.09 0 6.03 3.35 6.03 7.7V24h-5V16.5c0-1.78-.03-4.07-2.48-4.07-2.48 0-2.86 1.94-2.86 3.95V24h-5V8.98z" fill="currentColor"/>
            </svg>
          </a>

          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            className="text-slate-600 dark:text-[#a1a1aa]"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
            className="text-slate-900 dark:text-white"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden border-t border-black/5 dark:border-white/10 bg-white dark:bg-[#000000] overflow-hidden"
          >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="block text-base font-medium text-slate-700 dark:text-[#a1a1aa]"
                  onClick={(e) => scrollToSection(e, link.href)}
                >
                  {link.name}
                </motion.a>
              ))}
              <div className="pt-4 border-t border-slate-100 dark:border-[#333333] space-y-4">
                <div className="flex items-center gap-4">
                  <a href={content.whatsapp_url || '#'} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-emerald-500 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M20.52 3.48A11.95 11.95 0 0 0 12 0C5.37 0 .03 5.34.03 12c0 2.11.55 4.08 1.52 5.84L0 24l6.41-1.55A11.96 11.96 0 0 0 12 24c6.63 0 11.97-5.34 11.97-12 0-1.97-.46-3.84-1.45-5.52zM12 21.5c-1.75 0-3.47-.45-4.98-1.3l-.36-.21-3.8.92.95-3.7-.23-.38A9.49 9.49 0 0 1 2.5 12C2.5 6.14 6.64 2 12 2s9.5 4.14 9.5 10-4.14 9.5-9.5 9.5z" fill="currentColor"/>
                      <path d="M17.2 14.1c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.18.2-.36.22-.66.07-.3-.15-1.27-.47-2.42-1.48-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.45 1.06 2.85 1.2 3.05.13.2 2.08 3.3 5.04 4.62 2.96 1.33 2.96.89 3.5.83.54-.06 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.08-.13-.3-.2-.6-.35z" fill="currentColor"/>
                    </svg>
                  </a>
                  <a href={content.linkedin_url || '#'} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-blue-700 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.98h5V24H0V8.98zM8.98 8.98h4.79v2.04h.07c.67-1.27 2.31-2.61 4.75-2.61 5.09 0 6.03 3.35 6.03 7.7V24h-5V16.5c0-1.78-.03-4.07-2.48-4.07-2.48 0-2.86 1.94-2.86 3.95V24h-5V8.98z" fill="currentColor"/>
                    </svg>
                  </a>
                </div>
                {/* 'Discuter' link removed as requested */}
                <motion.a
                  href="#contact"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.24, duration: 0.3 }}
                  className="block w-full text-center px-5 py-2.5 bg-[#eb5424] text-white dark:bg-white dark:text-black rounded-md font-medium"
                  onClick={(e) => scrollToSection(e, '#contact')}
                >
                  Me Contacter
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

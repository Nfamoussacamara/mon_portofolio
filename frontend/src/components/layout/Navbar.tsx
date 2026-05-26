import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
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
            <div className="w-3 h-3 bg-white dark:bg-black rounded-full" />
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

          <motion.a
            href="#contact"
            onClick={(e) => scrollToSection(e, '#contact')}
            className="text-[15px] font-medium text-[var(--text-primary)] transition-opacity duration-200 hover:opacity-80"
          >
            Discuter
          </motion.a>

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
                <motion.a
                  href="#contact"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18, duration: 0.3 }}
                  className="block text-base font-medium text-slate-700 dark:text-[#a1a1aa]"
                  onClick={(e) => scrollToSection(e, '#contact')}
                >
                  Discuter
                </motion.a>
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

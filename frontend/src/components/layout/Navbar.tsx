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
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 w-full ${
        scrolled 
          ? 'bg-white/80 dark:bg-[#000000]/90 backdrop-blur-md shadow-sm border-b border-black/5 dark:border-white/10' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
        
        {/* Left Side: Logo */}
        <div className="flex-shrink-0 cursor-pointer flex items-center gap-3 relative z-10">
           <div className="w-8 h-8 rounded bg-slate-900 dark:bg-white flex items-center justify-center">
              <div className="w-3 h-3 bg-white dark:bg-black rounded-full" />
           </div>
           <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Portofolio.
           </span>
        </div>

        {/* Center: Main Links */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[15px] font-medium text-slate-600 hover:text-slate-900 dark:text-[#a1a1aa] dark:hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Side: Secondary Links & CTA */}
        <div className="hidden md:flex items-center gap-6 relative z-10">
          <button 
            onClick={toggleTheme} 
            className="text-slate-500 hover:text-slate-900 dark:text-[#a1a1aa] dark:hover:text-white transition-colors flex items-center justify-center"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <div className="w-px h-6 bg-slate-200 dark:bg-[#333333]"></div>

          <a 
            href="#contact" 
            className="text-[15px] font-medium text-slate-600 hover:text-slate-900 dark:text-[#a1a1aa] dark:hover:text-white transition-colors"
          >
            Discuter
          </a>
          
          <a 
            href="#contact" 
            className="px-5 py-2.5 bg-[#eb5424] hover:bg-[#d04a20] text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black rounded-md text-[15px] font-medium transition-colors"
          >
            Me Contacter
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="text-slate-600 dark:text-[#a1a1aa]">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 dark:text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-black/5 dark:border-white/10 bg-white dark:bg-[#000000]"
          >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-base font-medium text-slate-700 hover:text-slate-900 dark:text-[#a1a1aa] dark:hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-100 dark:border-[#333333] space-y-4">
                 <a href="#contact" className="block text-base font-medium text-slate-700 dark:text-[#a1a1aa]" onClick={() => setIsOpen(false)}>Discuter</a>
                 <a href="#contact" className="block w-full text-center px-5 py-2.5 bg-[#eb5424] text-white dark:bg-white dark:text-black rounded-md font-medium" onClick={() => setIsOpen(false)}>Me Contacter</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

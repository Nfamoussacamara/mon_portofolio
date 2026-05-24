export const Footer = () => {
  const links = [
    { label: 'À propos', href: '#about' },
    { label: 'Compétences', href: '#skills' },
    { label: 'Projets', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="border-t border-white/5 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-slate-900 dark:bg-white flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white dark:bg-black rounded-full" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Portofolio.
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-[var(--text-muted)] hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-sm text-[var(--text-muted)]">
            © {new Date().getFullYear()} — Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

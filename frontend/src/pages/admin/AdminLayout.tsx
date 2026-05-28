import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { AdminConfiguration } from './AdminConfiguration';
import { AdminProjects } from './AdminProjects';
import { AdminSkills } from './AdminSkills';
import { AdminEducation } from './AdminEducation';
import { AdminBlog } from './AdminBlog';
import { AdminMessages } from './AdminMessages';
import { API_BASE, BACKEND_BASE } from '../../lib/api';

type Section = 'overview' | 'configuration' | 'projects' | 'skills' | 'education' | 'blog' | 'messages';

interface NavItem { id: Section; label: string; icon: string; }

const navItems: NavItem[] = [
  { id: 'overview',       label: 'Vue d\'ensemble', icon: '📊' },
  { id: 'configuration',  label: 'Configuration',   icon: '⚙️' },
  { id: 'projects',       label: 'Projets',          icon: '📁' },
  { id: 'skills',         label: 'Compétences',      icon: '⚡' },
  { id: 'education',      label: 'Parcours',         icon: '🎓' },
  { id: 'blog',           label: 'Blog',             icon: '📝' },
  { id: 'messages',       label: 'Messages',         icon: '💬' },
];

const sectionTitles: Record<Section, string> = {
  overview:      'Tableau de bord',
  configuration: 'Configuration Globale',
  projects:      'Gestion des Projets',
  skills:        'Expertise Technique',
  education:     'Parcours & Expérience',
  blog:          'Articles de Blog',
  messages:      'Boîte de réception',
};

const Overview = ({ token }: { token: string }) => {
  const fetchStats = async () => {
    const headers = { 'Authorization': `Bearer ${token}` };
    const urls = ['projects/', 'skills/', 'education/', 'contact/'];
    const [p, s, e, m] = await Promise.all(
      urls.map(u => fetch(`${API_BASE}/${u}`, { headers }).then(r => r.json()))
    );
    return {
      projects: Array.isArray(p) ? p.length : 0,
      skills: Array.isArray(s) ? s.length : 0,
      education: Array.isArray(e) ? e.length : 0,
      messages: Array.isArray(m) ? m.length : 0,
      unreadMessages: Array.isArray(m) ? m.filter?.((x: any) => !x.is_read).length : 0,
    };
  };

  const { data, isLoading } = useQuery({ queryKey: ['admin-stats'], queryFn: fetchStats, retry: 1, staleTime: 30_000 });

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-white mb-1">Tableau de bord</h1>
      <p className="text-slate-400 text-sm mb-8">Bienvenue dans votre Mission Control 🚀</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Projets" value={isLoading ? '…' : (data?.projects ?? 0)} icon={<span className="text-xl">📁</span>} color="blue" delay={0.1} trend={{ value: 12, label: 'ce mois' }} />
        <StatCard title="Compétences" value={isLoading ? '…' : (data?.skills ?? 0)} icon={<span className="text-xl">⚡</span>} color="emerald" delay={0.2} />
        <StatCard title="Parcours" value={isLoading ? '…' : (data?.education ?? 0)} icon={<span className="text-xl">🎓</span>} color="purple" delay={0.3} />
        <StatCard title="Messages (Non lus)" value={isLoading ? '…' : `${data?.unreadMessages ?? 0} / ${data?.messages ?? 0}`} icon={<span className="text-xl">💬</span>} color={(data?.unreadMessages ?? 0) > 0 ? "rose" : "amber"} delay={0.4} />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Configurer le site',    desc: 'Hero, À propos, liens sociaux…', icon: '⚙️' },
          { label: 'Gérer les projets',     desc: 'Ajouter / éditer vos réalisations', icon: '📁' },
          { label: 'Gérer les compétences', desc: 'Vos skills techniques', icon: '⚡' },
        ].map(q => (
          <div key={q.label} className="p-5 bg-[#161616] border border-white/10 rounded-2xl hover:border-white/20 transition-colors cursor-default">
            <span className="text-2xl">{q.icon}</span>
            <h3 className="text-white font-medium mt-3 mb-1 text-sm">{q.label}</h3>
            <p className="text-slate-500 text-xs">{q.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-5 bg-[#161616] border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-white font-medium mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Portail Django Admin
          </h3>
          <p className="text-slate-400 text-sm">Accès direct à la base de données et aux paramétrages avancés.</p>
        </div>
        <a href={`${BACKEND_BASE}/admin`} target="_blank" rel="noreferrer" className="flex-shrink-0">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 w-full sm:w-auto">Ouvrir ↗</Button>
        </a>
      </div>
    </div>
  );
};

export const AdminLayout = ({ onLogout, token }: { onLogout: () => void; token: string }) => {
  const [section, setSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (section) {
      case 'configuration': return <AdminConfiguration token={token} />;
      case 'projects':      return <AdminProjects token={token} />;
      case 'skills':        return <AdminSkills token={token} />;
      case 'education':     return <AdminEducation token={token} />;
      case 'blog':          return <AdminBlog token={token} />;
      case 'messages':      return <AdminMessages token={token} />;
      default:              return <Overview token={token} />;
    }
  };

  const handleNav = (id: Section) => {
    setSection(id);
    setSidebarOpen(false);
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-5 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          </div>
          <div>
            <p className="font-bold text-xs tracking-wider uppercase text-slate-200">Mission Control</p>
            <p className="text-slate-600 text-[10px]">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = section === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors rounded-xl ${
                isActive ? 'text-blue-300' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavBackground"
                  className="absolute inset-0 bg-blue-500/15 border border-blue-500/20 rounded-xl"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 text-base">{item.icon}</span>
              <span className="relative z-10 truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Déconnexion */}
      <div className="p-3 border-t border-white/5 flex-shrink-0">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300 text-sm"
          onClick={onLogout}
        >
          <span className="mr-2">🚪</span> Déconnexion
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#000000] font-sans text-white flex">

      {/* ── Sidebar Desktop (toujours visible ≥ lg) ── */}
      <aside className="hidden lg:flex w-60 border-r border-white/5 bg-[#161616] h-screen flex-col fixed left-0 top-0 z-30">
        <NavContent />
      </aside>

      {/* ── Sidebar Mobile (drawer) ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="fixed left-0 top-0 h-screen w-60 bg-[#161616] border-r border-white/5 flex flex-col z-50 lg:hidden"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Zone Principale ── */}
      <div className="flex-1 min-h-screen lg:ml-60 flex flex-col">

        {/* En-tête */}
        <header className="h-14 border-b border-white/5 bg-[#000000]/90 backdrop-blur-md flex items-center px-4 sm:px-8 sticky top-0 z-20 flex-shrink-0">
          {/* Burger mobile */}
          <button
            className="lg:hidden mr-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2 text-sm min-w-0">
            <span className="text-slate-500 hidden sm:inline">Dashboard</span>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <span className="text-white font-medium truncate">{sectionTitles[section]}</span>
          </div>
        </header>

        {/* Contenu centré */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="w-full max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

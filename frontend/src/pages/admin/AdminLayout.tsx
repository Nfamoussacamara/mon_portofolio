import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { AdminProjects } from './AdminProjects';
import { AdminSkills } from './AdminSkills';
import { AdminEducation } from './AdminEducation';
import { AdminMessages } from './AdminMessages';

type Section = 'overview' | 'projects' | 'skills' | 'education' | 'messages';

interface NavItem { id: Section; label: string; icon: string; }

const navItems: NavItem[] = [
  { id: 'overview',   label: 'Vue d\'ensemble', icon: '📊' },
  { id: 'projects',   label: 'Projets',          icon: '📁' },
  { id: 'skills',     label: 'Compétences',      icon: '⚡' },
  { id: 'education',  label: 'Parcours',          icon: '🎓' },
  { id: 'messages',   label: 'Messages',          icon: '💬' },
];

const sectionTitles: Record<Section, string> = {
  overview:  'Vue d\'ensemble',
  projects:  'Projets',
  skills:    'Compétences',
  education: 'Parcours (CV)',
  messages:  'Messages de Contact',
};

const Overview = ({ token }: { token: string }) => {
  const fetchStats = async () => {
    const headers = { 'Authorization': `Bearer ${token}` };
    const urls = ['projects/', 'skills/', 'education/', 'contact/'];
    const [p, s, e, m] = await Promise.all(
      urls.map(u => fetch(`http://localhost:8000/api/${u}`, { headers }).then(r => r.json()))
    );
    return {
      projects: p.length || 0,
      skills: s.length || 0,
      education: e.length || 0,
      messages: m.length || 0,
      unreadMessages: m.filter?.((x: any) => !x.is_read).length || 0
    };
  };

  const { data } = useQuery({ queryKey: ['admin-stats'], queryFn: fetchStats });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Tableau de bord</h1>
      <p className="text-slate-400 text-sm mb-8">Bienvenue dans votre Mission Control 🚀</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Projets Publics" 
          value={data?.projects ?? '-'} 
          icon={<span className="text-xl">📁</span>} 
          color="blue" 
          delay={0.1}
          trend={{ value: 12, label: 'ce mois' }} 
        />
        <StatCard 
          title="Compétences" 
          value={data?.skills ?? '-'} 
          icon={<span className="text-xl">⚡</span>} 
          color="emerald" 
          delay={0.2} 
        />
        <StatCard 
          title="Parcours" 
          value={data?.education ?? '-'} 
          icon={<span className="text-xl">🎓</span>} 
          color="purple" 
          delay={0.3} 
        />
        <StatCard 
          title="Messages (Non lus)" 
          value={`${data?.unreadMessages ?? '-'} / ${data?.messages ?? '-'}`} 
          icon={<span className="text-xl">💬</span>} 
          color={data?.unreadMessages > 0 ? "rose" : "amber"} 
          delay={0.4} 
        />
      </div>

      <div className="mt-8 p-5 bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Accès Base de données (Django)
          </h3>
          <p className="text-slate-400 text-sm">Paramétrages vitaux et gestion Serveur.</p>
        </div>
        <a href="http://localhost:8000/admin" target="_blank" rel="noreferrer">
          <Button variant="outline" className="border-white/10 hover:bg-white/5">Ouvrir le portail Django</Button>
        </a>
      </div>
    </div>
  );
};
export const AdminLayout = ({ onLogout, token }: { onLogout: () => void; token: string }) => {
  const [section, setSection] = useState<Section>('overview');

  const renderSection = () => {
    switch (section) {
      case 'projects':   return <AdminProjects token={token} />;
      case 'skills':     return <AdminSkills token={token} />;
      case 'education':  return <AdminEducation token={token} />;
      case 'messages':   return <AdminMessages token={token} />;
      default:           return <Overview token={token} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] font-sans text-white flex">
      {/* Barre Latérale */}
      <div className="w-60 border-r border-white/5 bg-[#0a0a0a] h-screen flex flex-col fixed left-0 top-0 z-20">
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
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
                onClick={() => setSection(item.id)}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-blue-300'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 rounded-xl'
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
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Déconnexion */}
        <div className="p-3 border-t border-white/5">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300 text-sm"
            onClick={onLogout}
          >
            <span className="mr-2">🚪</span> Déconnexion
          </Button>
        </div>
      </div>

      {/* Zone Principale */}
      <div className="flex-1 ml-60 min-h-screen">
        {/* En-tête */}
        <header className="h-14 border-b border-white/5 bg-[#000000]/90 backdrop-blur-md flex items-center px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Dashboard</span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-medium">{sectionTitles[section]}</span>
          </div>
        </header>

        {/* Contenu */}
        <main className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="max-w-5xl mx-auto"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

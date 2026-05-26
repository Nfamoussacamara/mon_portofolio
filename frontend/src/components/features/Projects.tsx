import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ProjectCard } from './ProjectCard';
import { sectionHeader, defaultViewport, staggerContainer } from '../../lib/animations';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  stack: string[];
  category: string;
  linkGithub?: string;
  linkDemo?: string;
}

const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: 'IdentiGuinée Secure Core',
    description: "Système d'identité nationale certifié. Architecture complexe avec gestion de documents asynchrone et vérification biométrique.",
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=700',
    stack: ['Django', 'React', 'Cybersécurité'],
    category: 'Full-Stack',
    linkGithub: '#',
    linkDemo: '#'
  },
  {
    id: 2,
    title: 'API Rate Limiter Pro',
    description: 'Middleware haute performance pour bloquer les attaques DDoS et bruteforce sur des endpoints critiques. Basé sur Redis.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=700',
    stack: ['Python', 'Redis', 'Cybersécurité'],
    category: 'Backend',
    linkGithub: '#'
  },
  {
    id: 3,
    title: 'Dashboard Analytics Premium',
    description: "Interface Mission Control avec rendu Glassmorphism, graphiques en temps réel et thème adaptatif dark/light.",
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=700',
    stack: ['React', 'Framer Motion', 'Tailwind CSS'],
    category: 'Frontend',
    linkDemo: '#'
  }
];

const fetchProjects = async () => {
  const res = await fetch('http://localhost:8000/api/projects/');
  if (!res.ok) throw new Error('API Error');
  const data = await res.json();
  
  // Formatage des clés de l'API vers les clés du Frontend
  return data.map((p: any) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    image: p.image_url || 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=700',
    stack: p.stack || [],
    category: p.category,
    linkGithub: p.link_github,
    linkDemo: p.link_demo,
  }));
};

const filters = ['Tous', 'Frontend', 'Backend', 'Full-Stack'];

export const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('Tous');

  // Architecture hybride avancée : Si le backend ne répond pas (ou est vide),
  // initialData affiche les données codées en dur sans jamais casser le site.
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    initialData: DEFAULT_PROJECTS,
    staleTime: 60000 // Pas de refresh avant 1 minute
  });

  const filteredProjects = (projects as Project[]).filter((project: Project) => {
    if (activeFilter === 'Tous') return true;
    return project.category === activeFilter;
  });

  return (
    <section id="projects" className="py-16 md:py-28 bg-[var(--bg-secondary)] border-y border-slate-200 dark:border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionHeader}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="mb-12 flex flex-col items-center text-center"
        >
          <p className="text-sm font-mono font-medium text-blue-500 dark:text-blue-400 mb-3 tracking-widest uppercase text-center">
            // projects
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5 text-center">
            Réalisations <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">sélectionnées</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto leading-relaxed text-center">
            Découvrez mes projets les plus impactants, de l'architecture backend à l'interface utilisateur.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeFilter === filter
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-transparent text-slate-700 border border-slate-200 hover:border-slate-300 dark:text-[#a1a1aa] dark:border-white/10 dark:hover:border-white/20 dark:hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="overflow-hidden">
          <motion.div
            layout
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => {
                const col = index % 3;
                const initial =
                  col === 0 ? { opacity: 0, x: -50, y: 0 } :
                  col === 2 ? { opacity: 0, x: 50, y: 0 } :
                              { opacity: 0, x: 0, y: 50 };
                
                const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
                const variants = {
                  hidden: initial,
                  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 1.1, ease: EASE } }
                };

                return (
                  <motion.div
                    key={project.id}
                    layout
                    variants={variants}
                    initial="hidden"
                    whileInView="visible"
                    exit={{ opacity: 0, scale: 0.95 }}
                    viewport={defaultViewport}
                  >
                    <ProjectCard {...project} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

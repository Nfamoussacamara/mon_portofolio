import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  stack: string[];
  category: string;
  linkGithub?: string;
  linkDemo?: string;
}

export const ProjectCard = ({ title, description, image, stack, category, linkGithub, linkDemo }: ProjectCardProps) => {
  return (
    <motion.div 
      initial="initial"
      whileHover="hover"
      className="flex flex-col h-full rounded-3xl overflow-hidden border border-white/25 bg-[#111111] relative group"
    >
      {/* ── ZONE PRINCIPALE (Image + Contenu) ── */}
      <div className="relative flex-1 flex flex-col overflow-hidden">
        
        {/* Section haute : Preview */}
        <div className="bg-[#0a0a0a] p-4 flex-shrink-0">
          <div className="rounded-2xl overflow-hidden bg-[#161616] border border-white/10">
            <div className="p-4 flex justify-between items-start">
              <p className="text-[11px] text-white/40 font-mono uppercase tracking-widest">Projet</p>
              <div className="flex flex-wrap gap-1 justify-end">
                {stack.slice(0, 2).map((tech) => (
                  <span key={tech} className="text-[9px] font-mono text-white/30 bg-white/5 px-1.5 py-0.5 rounded-md">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="h-36 overflow-hidden">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Section basse : Infos statiques */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40">
               <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
               <line x1="3" y1="9" x2="21" y2="9"/>
               <line x1="9" y1="21" x2="9" y2="9"/>
             </svg>
             <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">{category}</span>
          </div>
          <h3 className="text-white font-bold text-lg mb-3 line-clamp-2">{title}</h3>
          <p className="text-sm text-white/40 leading-relaxed line-clamp-3">{description}</p>
        </div>

        {/* ── RIDEAU MONTANT (Framer Motion) ── */}
        <motion.div 
          variants={{
            initial: { y: "100%" },
            hover: { y: 0 }
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-20 backdrop-blur-xl bg-black/80 flex flex-col justify-center items-center p-6 gap-4"
        >
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-400">{category}</span>
          <h3 className="text-white font-bold text-lg text-center">{title}</h3>
          <p className="text-white/90 text-sm text-center leading-relaxed px-2">{description}</p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {stack.map((tech) => (
              <span key={tech} className="text-[10px] font-mono text-white/60 bg-white/10 border border-white/15 px-2 py-0.5 rounded-md">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── BOUTONS (Bas) ── */}
      <div className="flex gap-2 p-4 border-t border-white/10 bg-[#111111] relative z-30">
        {linkGithub && (
          <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => window.open(linkGithub, '_blank')}>
            GitHub
          </Button>
        )}
        {linkDemo && (
          <Button variant="primary" size="sm" className="flex-1 text-xs" onClick={() => window.open(linkDemo, '_blank')}>
            Démo
          </Button>
        )}
      </div>
    </motion.div>
  );
};

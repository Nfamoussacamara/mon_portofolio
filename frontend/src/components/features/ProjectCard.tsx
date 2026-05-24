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

export const ProjectCard = ({ title, description, image, stack, linkGithub, linkDemo }: ProjectCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col rounded-2xl overflow-hidden border border-white/8 bg-white/2 dark:bg-white/[0.02] hover:border-white/15 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900 flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Stack tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {stack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-white/5 border border-white/8 text-slate-400 dark:text-slate-400"
            >
              {tech}
            </span>
          ))}
        </div>

        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2 leading-snug">
          {title}
        </h3>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed flex-1 mb-6 line-clamp-3">
          {description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          {linkGithub && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(linkGithub, '_blank')}
            >
              GitHub
            </Button>
          )}
          {linkDemo && (
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => window.open(linkDemo, '_blank')}
            >
              Démo live
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

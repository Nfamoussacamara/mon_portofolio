import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose';
  delay?: number;
}



export const StatCard = ({ 
  title, 
  value, 
  // On accepte les props pour ne pas casser AdminLayout.tsx mais on ne les rend pas selon la demande.
  icon: _icon, 
  trend, 
  color: _color, 
  delay = 0 
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-[#111111] border border-white/10 p-6 rounded-2xl hover:border-white/25 transition-all duration-300 w-full relative z-10"
    >
      {/* Reproduction exacte de l'intérieur de la timeline-card de la section Education */}
      <span className="text-indigo-400 font-mono text-sm block mb-1 hover:text-indigo-300 transition-colors">{title}</span>
      <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
      
      {trend && (
        <p className="text-white/60 text-sm leading-relaxed flex items-center gap-2">
          <span className={`text-xs font-semibold ${trend.value >= 0 ? 'text-indigo-300' : 'text-red-400'}`}>
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="uppercase tracking-wider text-[10px] text-white/40">{trend.label}</span>
        </p>
      )}
    </motion.div>
  );
};

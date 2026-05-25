import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { fadeUp, defaultViewport } from '../../lib/animations';

export function CallToAction() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600/5 pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="p-12 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-black border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]" />
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Prêt à sécuriser & scaler<br />vos applications ?
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Basé sur les standards de l'industrie, je transforme vos idées en produits robustes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="primary" size="lg" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Démarrer un projet
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.open('https://linkedin.com', '_blank')}>
              Me suivre sur LinkedIn
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

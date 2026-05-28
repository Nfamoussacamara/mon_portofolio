import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { fadeUp, defaultViewport } from '../../lib/animations';
import { normalizeProfile, usePublicProfile } from '../../lib/siteContent';

export function CallToAction() {
  const { data: profile } = usePublicProfile();
  const content = normalizeProfile(profile);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="p-12 rounded-3xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 relative overflow-hidden"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-950 dark:text-white mb-6">
            {content.available_for_hire
              ? content.cta_headline_active || 'Prêt à sécuriser & scaler vos applications ?'
              : content.cta_headline_inactive || 'Découvrez mon portfolio'
            }
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            {content.available_for_hire
              ? content.cta_description_active || "Basé sur les standards de l'industrie, je transforme vos idées en produits robustes."
              : content.cta_description_inactive || 'Le portfolio reste consultable en continu, avec des contenus éditables depuis le dashboard.'
            }
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="primary" size="lg" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Démarrer un projet
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.open(content.linkedin_url || 'https://linkedin.com', '_blank')}>
              {content.linkedin_url ? 'Me suivre sur LinkedIn' : 'LinkedIn'}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

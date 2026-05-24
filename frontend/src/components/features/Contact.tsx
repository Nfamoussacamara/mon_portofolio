import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

const inputClass = "w-full px-4 py-3 rounded-xl border text-sm bg-transparent outline-none transition-all duration-200 border-white/10 text-white placeholder-[#555] focus:border-white/30 focus:bg-white/5";
const labelClass = "block text-sm font-medium mb-2 text-slate-400";

export const Contact = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 4000);
    }, 1500);
  };

  const infos = [
    { label: 'Email', value: 'contact@votre-email.com' },
    { label: 'Localisation', value: 'Conakry, Guinée' },
    { label: 'Disponibilité', value: 'Ouvert aux projets' },
  ];

  return (
    <section id="contact" className="py-28 bg-[var(--bg-primary)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-mono font-medium text-blue-500 dark:text-blue-400 mb-3 tracking-widest uppercase">
            // contact
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Parlons de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">votre projet</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto leading-relaxed">
            Architecture d'entreprise, audit de sécurité ou produit web innovant — n'hésitez 
            pas à me contacter. Je réponds dans les 24h.
          </p>
        </motion.div>
 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
 
          {/* Gauche: Informations */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >

            <div className="space-y-5">
              {infos.map((info) => (
                <div key={info.label} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0 group-hover:border-blue-500/30 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-muted)] mb-0.5">{info.label}</div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{info.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Droite: Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-white/8 bg-white/2 dark:bg-white/[0.02] p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>Nom complet</label>
                <input type="text" required className={inputClass} placeholder="Jean Dupont" />
              </div>
              <div>
                <label className={labelClass}>Adresse Email</label>
                <input type="email" required className={inputClass} placeholder="jean@example.com" />
              </div>
              <div>
                <label className={labelClass}>Sujet</label>
                <input type="text" required className={inputClass} placeholder="Votre sujet..." />
              </div>
              <div>
                <label className={labelClass}>Message</label>
                <textarea
                  required
                  rows={4}
                  className={inputClass + ' resize-none'}
                  placeholder="Décrivez votre projet ou votre besoin..."
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={status === 'loading' || status === 'success'}
              >
                {status === 'loading' ? 'Envoi en cours...' : status === 'success' ? 'Message envoyé !' : 'Envoyer le message'}
              </Button>

              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-emerald-500 text-sm text-center pt-2"
                >
                  Message envoyé. Je vous réponds très bientôt.
                </motion.p>
              )}
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

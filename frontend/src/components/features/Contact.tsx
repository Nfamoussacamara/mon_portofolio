import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { sectionHeader, fadeLeft, fadeRight, defaultViewport } from '../../lib/animations';

const inputClass = "w-full px-4 py-3 rounded-xl border text-sm bg-transparent outline-none transition-all duration-200 border-white/10 text-white placeholder-[#555] focus:border-white/30 focus:bg-white/5";
const labelClass = "block text-sm font-medium mb-2 text-slate-400";

export const Contact = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('http://localhost:8000/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
        e.currentTarget.reset();
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        const errorData = await response.json();
        setStatus('error');
        setErrorMessage(errorData.message || 'Une erreur est survenue.');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Impossible de contacter le serveur.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const infos = [
    { label: 'Email', value: 'contact@votre-email.com' },
    { label: 'Localisation', value: 'Conakry, Guinée' },
    { label: 'Disponibilité', value: 'Ouvert aux projets' },
  ];

  return (
    <section id="contact" className="py-16 md:py-28 bg-[var(--bg-primary)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionHeader}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
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
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
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
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="rounded-2xl border border-white/8 bg-white/2 dark:bg-white/[0.02] p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>Nom complet</label>
                <input type="text" name="name" required className={inputClass} placeholder="Jean Dupont" />
              </div>
              <div>
                <label className={labelClass}>Adresse Email</label>
                <input type="email" name="email" required className={inputClass} placeholder="jean@example.com" />
              </div>
              <div>
                <label className={labelClass}>Sujet</label>
                <input type="text" name="subject" required className={inputClass} placeholder="Votre sujet..." />
              </div>
              <div>
                <label className={labelClass}>Message</label>
                <textarea
                  name="message"
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
                  className="text-emerald-500 text-sm text-center pt-2 font-medium"
                >
                  Message envoyé. Je vous réponds très bientôt.
                </motion.p>
              )}

              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm text-center pt-2 font-medium"
                >
                  {errorMessage}
                </motion.p>
              )}
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

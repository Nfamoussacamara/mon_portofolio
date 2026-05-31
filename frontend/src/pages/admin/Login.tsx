import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { API_BASE } from '../../lib/api';

export const Login = ({ onLogin }: { onLogin: (token: string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        onLogin(data.access); // On passe le token JWT au parent
      } else {
        setError("Identifiants incorrects. Vérifiez vos accès.");
      }
    } catch {
      setError("Serveur indisponible.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border text-sm bg-transparent outline-none transition-all border-white/10 text-white placeholder-[#444] focus:border-blue-500/60 focus:bg-white/5";

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-500/15 border border-blue-500/25 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <div className="w-5 h-5 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.7)]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1.5">Accès Restreint</h1>
          <p className="text-sm text-slate-500">Mission Control — Portfolio Admin</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-xs font-medium mb-2 text-slate-400">Identifiant</label>
            <input type="text" className={inputClass} value={username} onChange={e => setUsername(e.target.value)} required placeholder="admin" autoComplete="username" />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2 text-slate-400">Mot de passe</label>
            <input type="password" className={inputClass} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" autoComplete="current-password" />
          </div>

          <Button type="submit" isLoading={loading} size="lg" className="w-full !bg-blue-600 hover:!bg-blue-700 text-white border-0 mt-2">
            {loading ? 'Vérification...' : 'Entrer dans le système →'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

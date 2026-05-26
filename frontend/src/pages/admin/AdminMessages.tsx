import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';

const API = 'http://localhost:8000/api';

export const AdminMessages = ({ token }: { token: string }) => {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [selected, setSelected] = useState<any>(null);

  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const res = await fetch(`${API}/contact/`, { headers });
      return res.json();
    }
  });

  const remove = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API}/contact/${id}/`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-messages'] }); setSelected(null); showToast('Message supprimé.', 'info'); },
    onError: () => showToast('Suppression échouée.', 'error'),
  });

  const unread = messages?.filter((m: any) => !m.is_read)?.length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Messages de Contact</h1>
          <p className="text-slate-400 text-sm mt-1">
            {unread > 0 ? <span className="text-blue-400">{unread} message{unread > 1 ? 's' : ''} non lu{unread > 1 ? 's' : ''}</span> : 'Tous les messages ont été lus'}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-[#111111] border border-white/5 p-6 rounded-2xl h-48 animate-pulse flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-1/3 h-3 bg-white/10 rounded" />
                <div className="w-2/3 h-5 bg-white/10 rounded" />
                <div className="w-1/2 h-3 bg-white/10 rounded" />
              </div>
              <div className="w-full h-8 bg-white/5 rounded mt-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {messages?.map((m: any) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`bg-[#111111] border p-6 rounded-2xl hover:border-white/25 transition-all duration-300 w-full relative z-10 flex flex-col justify-between ${!m.is_read ? 'border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-white/10'}`}
            >
              <div>
                <div className="flex items-start justify-between mb-1">
                  <span className="text-indigo-400 font-mono text-sm block">{new Date(m.created_at).toLocaleDateString('fr-FR')}</span>
                  {!m.is_read && <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">Nouveau</span>}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 truncate">{m.name}</h3>
                <div className="text-white/40 text-sm font-medium mb-3 uppercase tracking-wider truncate">{m.email}</div>
                <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-6">{m.subject || '(sans sujet)'}</p>
              </div>
              <div className="flex gap-2 mt-auto">
                <Button variant="outline" size="sm" className="text-xs border-white/10 hover:bg-white/5 flex-1" onClick={() => setSelected(m)}>Lire</Button>
                <Button variant="ghost" size="sm" className="text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 flex-none px-3" onClick={() => { if(confirm('Supprimer ce message ?')) remove.mutate(m.id); }}>✕</Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de lecture du message */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Message reçu">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-500 text-xs mb-0.5">De</p>
                <p className="text-white font-medium">{selected.name}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Email</p>
                <p className="text-blue-400">{selected.email}</p>
              </div>
            </div>
            {selected.subject && (
              <div>
                <p className="text-slate-500 text-xs mb-0.5">Sujet</p>
                <p className="text-white text-sm font-medium">{selected.subject}</p>
              </div>
            )}
            <div>
              <p className="text-slate-500 text-xs mb-1.5">Message</p>
              <div className="bg-white/5 rounded-xl p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap border border-white/8">
                {selected.message}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" className="flex-1 border border-white/10" onClick={() => setSelected(null)}>Fermer</Button>
              <Button variant="ghost" className="text-red-400 hover:bg-red-500/10" onClick={() => remove.mutate(selected.id)}>Supprimer</Button>
              <a href={`mailto:${selected.email}`}>
                <Button className="bg-blue-600 text-white border-0">Répondre par Email</Button>
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

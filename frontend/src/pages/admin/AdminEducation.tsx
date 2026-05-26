import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';

const API = 'http://localhost:8000/api';
const inputClass = "w-full px-4 py-2.5 rounded-xl border text-sm bg-white/5 outline-none transition-all border-white/10 text-white placeholder-slate-600 focus:border-blue-500/50";
const labelClass = "block text-xs font-medium mb-1.5 text-slate-400";

interface EduForm { title: string; institution: string; start_year: string; end_year: string; description: string; entry_type: string; order: number; }
const emptyForm: EduForm = { title: '', institution: '', start_year: '', end_year: 'Présent', description: '', entry_type: 'Education', order: 0 };

export const AdminEducation = ({ token }: { token: string }) => {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<EduForm>(emptyForm);

  const { data: entries, isLoading } = useQuery({ queryKey: ['admin-education'], queryFn: async () => (await fetch(`${API}/education/`)).json() });
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const save = useMutation({
    mutationFn: async (data: EduForm) => {
      const url = editing ? `${API}/education/${editing.id}/` : `${API}/education/`;
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-education'] }); showToast(editing ? 'Parcours modifié !' : 'Entrée ajoutée !'); setIsOpen(false); setEditing(null); setForm(emptyForm); },
    onError: () => showToast('Erreur lors de l\'enregistrement.', 'error'),
  });

  const remove = useMutation({
    mutationFn: async (id: number) => { const res = await fetch(`${API}/education/${id}/`, { method: 'DELETE', headers }); if (!res.ok) throw new Error(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-education'] }); showToast('Entrée supprimée.', 'info'); },
    onError: () => showToast('Suppression échouée.', 'error'),
  });

  const typeColors: Record<string, string> = { Education: 'text-blue-400 bg-blue-500/10', Experience: 'text-emerald-400 bg-emerald-500/10' };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Parcours (CV)</h1>
          <p className="text-slate-400 text-sm mt-1">Diplômes & Expériences professionnelles</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyForm); setIsOpen(true); }} className="bg-blue-600 text-white border-0">+ Ajouter</Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <CardSkeleton key={i} />)}</div>
      ) : (
        <div className="space-y-4">
          {entries?.map((e: any) => (
            <motion.div key={e.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#111111] border border-white/10 p-6 rounded-2xl hover:border-white/25 transition-all duration-300 w-full relative z-10 flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-indigo-400 font-mono text-sm block">{e.start_year} — {e.end_year || 'Présent'}</span>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border border-white/5 ${typeColors[e.entry_type]}`}>{e.entry_type}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{e.title}</h3>
                <div className="text-white/40 text-sm font-medium mb-3 uppercase tracking-wider">{e.institution}</div>
                {e.description && <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-4">{e.description}</p>}
              </div>
              <div className="flex sm:flex-col gap-2 sm:ml-4 flex-shrink-0 mt-auto">
                <Button variant="outline" size="sm" className="text-xs border-white/10 hover:bg-white/5 flex-1" onClick={() => { setEditing(e); setForm({ title: e.title, institution: e.institution, start_year: e.start_year, end_year: e.end_year || '', description: e.description || '', entry_type: e.entry_type, order: e.order }); setIsOpen(true); }}>Éditer</Button>
                <Button variant="ghost" size="sm" className="text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 flex-1" onClick={() => { if(confirm('Supprimer ?')) remove.mutate(e.id); }}>Supprimer</Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Modifier le Parcours' : 'Nouvelle Entrée'}>
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="space-y-4">
          <div>
            <label className={labelClass}>Type d'entrée</label>
            <select className={inputClass} value={form.entry_type} onChange={e => setForm({...form, entry_type: e.target.value})}>
              <option value="Education">Diplôme / École</option>
              <option value="Experience">Expérience professionnelle</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Titre (Rôle ou Diplôme)</label>
            <input className={inputClass} value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="Master en Cybersécurité..." />
          </div>
          <div>
            <label className={labelClass}>Établissement / Entreprise</label>
            <input className={inputClass} value={form.institution} onChange={e => setForm({...form, institution: e.target.value})} required placeholder="Université de Conakry..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Année de début</label>
              <input className={inputClass} value={form.start_year} onChange={e => setForm({...form, start_year: e.target.value})} required placeholder="2022" />
            </div>
            <div>
              <label className={labelClass}>Année de fin</label>
              <input className={inputClass} value={form.end_year} onChange={e => setForm({...form, end_year: e.target.value})} placeholder="2024 ou Présent" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description (optionnel)</label>
            <textarea className={inputClass + ' resize-none'} rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Vos missions, apprentissages clés..." />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1 border border-white/10" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={save.isPending} className="flex-1 bg-blue-600 text-white border-0">{save.isPending ? '...' : 'Enregistrer'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

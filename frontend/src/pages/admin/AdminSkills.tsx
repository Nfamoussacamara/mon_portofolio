import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';
import { API_BASE as API } from '../../lib/api';

const inputClass = "w-full px-4 py-2.5 rounded-xl border text-sm bg-white/5 outline-none transition-all border-white/10 text-white placeholder-slate-600 focus:border-blue-500/50";
const labelClass = "block text-xs font-medium mb-1.5 text-slate-400";

interface SkillForm { name: string; category: string; mastery_percentage: number; icon_name: string; order: number; }
const emptyForm: SkillForm = { name: '', category: 'Backend', mastery_percentage: 80, icon_name: '', order: 0 };

export const AdminSkills = ({ token }: { token: string }) => {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<SkillForm>(emptyForm);

  const { data: skills, isLoading, isError } = useQuery({ queryKey: ['admin-skills'], queryFn: async () => (await fetch(`${API}/skills/`)).json(), retry: 1 });
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const save = useMutation({
    mutationFn: async (data: SkillForm) => {
      const url = editing ? `${API}/skills/${editing.id}/` : `${API}/skills/`;
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-skills'] }); showToast(editing ? 'Compétence modifiée !' : 'Compétence ajoutée !'); setIsOpen(false); setEditing(null); setForm(emptyForm); },
    onError: () => showToast('Erreur lors de l\'enregistrement.', 'error'),
  });

  const remove = useMutation({
    mutationFn: async (id: number) => { const res = await fetch(`${API}/skills/${id}/`, { method: 'DELETE', headers }); if (!res.ok) throw new Error(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-skills'] }); showToast('Compétence supprimée.', 'info'); },
    onError: () => showToast('Suppression échouée.', 'error'),
  });

  const categories: Record<string, string> = { Frontend: 'text-blue-400 bg-blue-500/10', Backend: 'text-emerald-400 bg-emerald-500/10', DevOps: 'text-purple-400 bg-purple-500/10', Soft: 'text-amber-400 bg-amber-500/10', Other: 'text-slate-400 bg-slate-500/10' };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Compétences</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez vos skills techniques</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyForm); setIsOpen(true); }} className="bg-blue-600 text-white border-0">+ Ajouter</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <TableRowSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <div className="text-sm text-slate-400">Impossible de charger les compétences. Réessayez plus tard.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(skills ?? []).map((s: any) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl hover:border-white/25 transition-all duration-300 w-full relative z-10 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-2 pr-8">
                  <span className="text-indigo-400 font-mono text-sm block">{s.category}</span>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border border-white/5 ${categories[s.category] || categories.Other}`}>
                    {s.mastery_percentage}%
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="absolute top-2 right-2 w-8 h-8 p-0 flex items-center justify-center rounded-full text-red-400/70 hover:bg-red-500/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all z-20" onClick={() => { if (confirm('Supprimer ?')) remove.mutate(s.id); }}>✕</Button>
                <h3 className="text-xl font-bold text-white mb-4">{s.name}</h3>
                
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${s.mastery_percentage}%` }} />
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                <Button variant="outline" size="sm" className="text-xs border-white/10 hover:bg-white/5 flex-1" onClick={() => { setEditing(s); setForm({ name: s.name, category: s.category, mastery_percentage: s.mastery_percentage, icon_name: s.icon_name || '', order: s.order }); setIsOpen(true); }}>Éditer</Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Modifier la Compétence' : 'Nouvelle Compétence'}>
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nom</label>
              <input className={inputClass} value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="React, Python..." />
            </div>
            <div>
              <label className={labelClass}>Catégorie</label>
              <select className={inputClass} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {['Frontend', 'Backend', 'DevOps', 'Soft', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Maîtrise : {form.mastery_percentage}%</label>
            <input type="range" min={10} max={100} step={5} className="w-full accent-blue-500" value={form.mastery_percentage} onChange={e => setForm({...form, mastery_percentage: Number(e.target.value)})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Icône (optionnel)</label>
              <input className={inputClass} value={form.icon_name} onChange={e => setForm({...form, icon_name: e.target.value})} placeholder="react, python..." />
            </div>
            <div>
              <label className={labelClass}>Ordre (0 = premier)</label>
              <input type="number" className={inputClass} value={form.order} onChange={e => setForm({...form, order: Number(e.target.value)})} />
            </div>
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

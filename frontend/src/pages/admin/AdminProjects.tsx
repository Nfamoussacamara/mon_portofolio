import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';

const API = 'http://localhost:8000/api';

const fetchProjects = async () => {
  const res = await fetch(`${API}/projects/`);
  return res.json();
};

const inputClass = "w-full px-4 py-2.5 rounded-xl border text-sm bg-white/5 outline-none transition-all border-white/10 text-white placeholder-slate-600 focus:border-blue-500/50 focus:bg-white/8";
const labelClass = "block text-xs font-medium mb-1.5 text-slate-400";

interface ProjectForm { title: string; description: string; category: string; link_github: string; link_demo: string; is_featured: boolean; }

const emptyForm: ProjectForm = { title: '', description: '', category: 'Full-Stack', link_github: '', link_demo: '', is_featured: false };

export const AdminProjects = ({ token }: { token: string }) => {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);

  const { data: projects, isLoading } = useQuery({ queryKey: ['admin-projects'], queryFn: fetchProjects });

  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const save = useMutation({
    mutationFn: async (data: ProjectForm) => {
      const url = editing ? `${API}/projects/${editing.id}/` : `${API}/projects/`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Erreur');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-projects'] });
      qc.invalidateQueries({ queryKey: ['projects'] });
      showToast(editing ? 'Projet mis à jour !' : 'Projet créé avec succès !');
      setIsOpen(false);
      setEditing(null);
      setForm(emptyForm);
    },
    onError: () => showToast('Une erreur est survenue.', 'error'),
  });

  const remove = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API}/projects/${id}/`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Erreur');
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-projects'] }); showToast('Projet supprimé.', 'info'); },
    onError: () => showToast('Suppression échouée.', 'error'),
  });

  const openCreate = () => { setEditing(null); setForm(emptyForm); setIsOpen(true); };
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, category: p.category, link_github: p.link_github || '', link_demo: p.link_demo || '', is_featured: p.is_featured });
    setIsOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projets</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez vos réalisations</p>
        </div>
        <Button onClick={openCreate} className="bg-blue-600 text-white border-0">
          + Nouveau Projet
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects?.map((p: any) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111111] border border-white/10 p-6 rounded-2xl hover:border-white/25 transition-all duration-300 w-full relative z-10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-1">
                  <span className="text-indigo-400 font-mono text-sm block">{p.category}</span>
                  {p.is_featured && <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">Featured</span>}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-5">{p.description}</p>
              </div>
              <div className="flex gap-2 mt-auto">
                <Button variant="outline" size="sm" onClick={() => openEdit(p)} className="text-xs border-white/10 flex-1 hover:bg-white/5">Modifier</Button>
                <Button variant="ghost" size="sm" onClick={() => { if(confirm('Supprimer ce projet ?')) remove.mutate(p.id); }} className="text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300">Supprimer</Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Modifier le Projet' : 'Nouveau Projet'}>
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="space-y-4">
          <div>
            <label className={labelClass}>Titre</label>
            <input className={inputClass} value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="Ex: IdentiGuinée" />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea className={inputClass + ' resize-none'} rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required placeholder="Description du projet..." />
          </div>
          <div>
            <label className={labelClass}>Catégorie</label>
            <select className={inputClass} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {['Full-Stack', 'Frontend', 'Backend', 'Cybersécurité'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Lien GitHub</label>
              <input className={inputClass} value={form.link_github} onChange={e => setForm({...form, link_github: e.target.value})} placeholder="https://github.com/..." />
            </div>
            <div>
              <label className={labelClass}>Lien Démo</label>
              <input className={inputClass} value={form.link_demo} onChange={e => setForm({...form, link_demo: e.target.value})} placeholder="https://..." />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-blue-500" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} />
            <span className="text-sm text-slate-300">Mettre en avant (Featured)</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1 border border-white/10" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={save.isPending} className="flex-1 bg-blue-600 text-white border-0">{save.isPending ? 'Enregistrement...' : 'Enregistrer'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

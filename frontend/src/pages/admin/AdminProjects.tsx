import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';
import { API_BASE as API } from '../../lib/api';


const fetchProjects = async () => {
  const res = await fetch(`${API}/projects/`);
  return res.json();
};

const inputClass = "w-full px-4 py-2.5 rounded-xl border text-sm bg-white/5 outline-none transition-all border-white/10 text-white placeholder-slate-600 focus:border-blue-500/50 focus:bg-white/8";
const labelClass = "block text-xs font-medium mb-1.5 text-slate-400";

interface ProjectForm { 
  title: string; 
  description: string; 
  category: string; 
  image: File | null;
  image_url: string;
  link_github: string; 
  link_demo: string; 
  is_featured: boolean; 
  technologies: number[]; 
}

const emptyForm: ProjectForm = { 
  title: '', 
  description: '', 
  category: 'Full-Stack', 
  image: null,
  image_url: '',
  link_github: '', 
  link_demo: '', 
  is_featured: false,
  technologies: []
};

export const AdminProjects = ({ token }: { token: string }) => {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: projects, isLoading } = useQuery({ queryKey: ['admin-projects'], queryFn: fetchProjects, retry: 1 });
  const { data: skills } = useQuery({ queryKey: ['admin-skills-list'], queryFn: async () => (await fetch(`${API}/skills/`)).json() });

  const headers = { 'Authorization': `Bearer ${token}` };

  const save = useMutation({
    mutationFn: async (data: ProjectForm) => {
      const url = editing ? `${API}/projects/${editing.id}/` : `${API}/projects/`;
      const method = editing ? 'PATCH' : 'POST';
      
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      if (data.image) formData.append('image', data.image);
      formData.append('image_url', data.image_url);
      formData.append('link_github', data.link_github);
      formData.append('link_demo', data.link_demo);
      formData.append('is_featured', String(data.is_featured));
      
      // DRF handles many-to-many by appending each ID separately or as a list
      data.technologies.forEach(id => formData.append('technologies', String(id)));

      const res = await fetch(url, { 
        method, 
        headers, 
        body: formData 
      });
      if (!res.ok) throw new Error('Erreur');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-projects'] });
      showToast(editing ? 'Projet mis à jour !' : 'Projet créé !');
      setIsOpen(false);
      setPreviewUrl(null);
    },
    onError: () => showToast('Erreur lors de l\'enregistrement.', 'error'),
  });

  const remove = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API}/projects/${id}/`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('Erreur');
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-projects'] }); showToast('Projet supprimé.', 'info'); },
    onError: () => showToast('Suppression échouée.', 'error'),
  });

  const openCreate = () => { setEditing(null); setForm(emptyForm); setPreviewUrl(null); setIsOpen(true); };
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({ 
      title: p.title, 
      description: p.description, 
      category: p.category, 
      image: null,
      image_url: p.image_url || '',
      link_github: p.link_github || '', 
      link_demo: p.link_demo || '', 
      is_featured: p.is_featured,
      technologies: p.technologies || []
    });
    setPreviewUrl(p.image_url || null);
    setIsOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTech = (id: number) => {
    const current = [...form.technologies];
    if (current.includes(id)) {
      setForm({ ...form, technologies: current.filter(t => t !== id) });
    } else {
      setForm({ ...form, technologies: [...current, id] });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projets</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez vos réalisations et associez vos compétences</p>
        </div>
        <Button onClick={openCreate} className="bg-blue-600 text-white border-0">+ Nouveau Projet</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(projects ?? []).map((p: any) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1a1a1a] border border-white/10 rounded-2xl hover:border-white/25 transition-all flex flex-col justify-between group relative overflow-hidden">
              {/* Image thumbnail */}
              <div className="relative h-36 bg-white/5 overflow-hidden">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                )}
                <Button variant="ghost" size="sm" className="absolute top-2 right-2 w-7 h-7 p-0 flex items-center justify-center rounded-full text-red-400/80 hover:bg-red-500/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all z-20 bg-black/40" onClick={() => { if(confirm('Supprimer ?')) remove.mutate(p.id); }}>✕</Button>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-indigo-400 font-mono text-sm block">{p.category}</span>
                  {p.is_featured && <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">Featured</span>}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(p.stack || []).map((s: string) => (
                    <span key={s} className="bg-white/5 border border-white/5 text-slate-400 text-[10px] px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={() => openEdit(p)} className="text-xs border-white/10 w-full hover:bg-white/5">Modifier</Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Modifier le Projet' : 'Nouveau Projet'}>
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="space-y-4">
          <div>
            <label className={labelClass}>Titre</label>
            <input className={inputClass} value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea className={inputClass + ' resize-none'} rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
          </div>
          <div>
            <label className={labelClass}>Catégorie</label>
            <select className={inputClass} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {['Full-Stack', 'Frontend', 'Backend', 'Cybersécurité', 'Mobile'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Image Upload + Aperçu */}
          <div>
            <label className={labelClass}>Image du projet</label>
            <div className="flex flex-col gap-3">
              <div className="flex gap-4 items-center">
                <label className="flex-1 cursor-pointer">
                  <div className="px-4 py-2 bg-white/5 border border-white/10 border-dashed rounded-xl text-xs text-slate-400 hover:bg-white/10 transition-all text-center">
                    {form.image ? form.image.name : 'Cliquez pour uploader un fichier'}
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
                <div className="text-slate-600 text-[10px] font-mono">OU</div>
                <input
                  className={inputClass + " flex-[1.5]"}
                  value={form.image_url}
                  onChange={e => { setForm({...form, image_url: e.target.value}); setPreviewUrl(e.target.value); }}
                  placeholder="Collez une URL externe"
                />
              </div>

              {previewUrl && (
                <div className="relative rounded-xl overflow-hidden border border-white/10 h-32 bg-black/20">
                  <img
                    src={previewUrl}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <button 
                    type="button"
                    onClick={() => { setForm({...form, image: null, image_url: ''}); setPreviewUrl(null); }}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] hover:bg-black"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass}>Technologies utilisées</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-white/5 border border-white/10 rounded-xl max-h-40 overflow-y-auto thin-scrollbar">
              {(skills ?? []).map((s: any) => (
                <label key={s.id} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border cursor-pointer transition-all ${form.technologies.includes(s.id) ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'border-transparent text-slate-500 hover:bg-white/5'}`}>
                  <input type="checkbox" className="hidden" checked={form.technologies.includes(s.id)} onChange={() => toggleTech(s.id)} />
                  <span className="text-[11px] font-medium truncate">{s.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input className={inputClass} value={form.link_github} onChange={e => setForm({...form, link_github: e.target.value})} placeholder="GitHub URL" />
            <input className={inputClass} value={form.link_demo} onChange={e => setForm({...form, link_demo: e.target.value})} placeholder="Demo URL" />
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input type="checkbox" className="w-4 h-4 accent-blue-500" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} />
            <span className="text-sm text-slate-300">Mettre en avant</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1 border border-white/10" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={save.isPending} className="flex-1 bg-blue-600 text-white border-0">{save.isPending ? '...' : 'Enregistrer'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};


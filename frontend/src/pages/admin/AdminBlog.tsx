import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';
import type { BlogPostRecord } from '../../lib/siteContent';
import { fallbackBlogPosts } from '../../lib/siteContent';

const API = 'http://localhost:8000/api';
const inputClass = "w-full px-4 py-2.5 rounded-xl border text-sm bg-white/5 outline-none transition-all border-white/10 text-white placeholder-slate-600 focus:border-blue-500/50";
const labelClass = "block text-xs font-medium mb-1.5 text-slate-400";

interface BlogForm {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  read_time: string;
  featured_image_url: string;
  is_published: boolean;
  order: number;
}

const emptyForm: BlogForm = {
  title: '',
  excerpt: '',
  content: '',
  category: 'Architecture',
  read_time: '5 min',
  featured_image_url: '',
  is_published: true,
  order: 0,
};

function toForm(post?: BlogPostRecord | null): BlogForm {
  if (!post) return emptyForm;
  return {
    title: post.title ?? '',
    excerpt: post.excerpt ?? '',
    content: post.content ?? '',
    category: post.category ?? 'Architecture',
    read_time: post.readTime ?? '5 min',
    featured_image_url: post.featured_image_url ?? '',
    is_published: post.is_published ?? true,
    order: post.order ?? 0,
  };
}

export const AdminBlog = ({ token }: { token: string }) => {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPostRecord | null>(null);
  const [form, setForm] = useState<BlogForm>(emptyForm);

  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ['admin-blog'],
    queryFn: async () => (await fetch(`${API}/blog/`)).json(),
    retry: 1,
  });

  const currentPosts = Array.isArray(posts) && posts.length ? posts : fallbackBlogPosts;
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const save = useMutation({
    mutationFn: async (data: BlogForm) => {
      const url = editing?.id ? `${API}/blog/${editing.id}/` : `${API}/blog/`;
      const res = await fetch(url, {
        method: editing?.id ? 'PATCH' : 'POST',
        headers,
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-blog'] });
      showToast(editing ? 'Article mis à jour !' : 'Article ajouté !');
      setIsOpen(false);
      setEditing(null);
      setForm(emptyForm);
    },
    onError: () => showToast('Erreur lors de l\'enregistrement de l\'article.', 'error'),
  });

  const remove = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API}/blog/${id}/`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-blog'] });
      showToast('Article supprimé.', 'info');
    },
    onError: () => showToast('Suppression échouée.', 'error'),
  });

  const openEditor = (post?: BlogPostRecord) => {
    setEditing(post ?? null);
    setForm(toForm(post ?? null));
    setIsOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog / Articles</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez les articles affichés dans la section blog du portfolio</p>
        </div>
        <Button onClick={() => openEditor()} className="bg-blue-600 text-white border-0">+ Ajouter</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => <TableRowSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <div className="text-sm text-slate-400">Impossible de charger les articles. Réessayez plus tard.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl hover:border-white/25 transition-all duration-300 group flex flex-col justify-between relative"
            >
              <div className="flex items-center justify-between gap-3 mb-4 pr-8">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border border-white/5 text-indigo-300">{post.category}</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border border-white/5 text-slate-400">{post.readTime}</span>
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${post.is_published ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/20 bg-amber-500/10 text-amber-400'}`}>
                  {post.is_published ? 'Publié' : 'Brouillon'}
                </span>
              </div>
              <Button variant="ghost" size="sm" className="absolute top-2 right-2 w-8 h-8 p-0 flex items-center justify-center rounded-full text-red-400/70 hover:bg-red-500/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all z-20" onClick={() => { if (confirm('Supprimer ?')) remove.mutate(post.id); }}>✕</Button>
              <h3 className="text-xl font-bold text-white mb-3">{post.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center gap-2 mt-auto">
                <Button variant="outline" size="sm" className="text-xs border-white/10 hover:bg-white/5 flex-1" onClick={() => openEditor(post)}>Éditer</Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Modifier l\'article' : 'Nouvel article'}>
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="space-y-4">
          <div>
            <label className={labelClass}>Titre</label>
            <input className={inputClass} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Pourquoi l'architecture Clean est vitale en 2026" />
          </div>
          <div>
            <label className={labelClass}>Résumé</label>
            <textarea className={inputClass + ' resize-none'} rows={3} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} required />
          </div>
          <div>
            <label className={labelClass}>Contenu</label>
            <textarea className={inputClass + ' resize-none'} rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Contenu complet de l'article" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Catégorie</label>
              <input className={inputClass} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
            </div>
            <div>
              <label className={labelClass}>Temps de lecture</label>
              <input className={inputClass} value={form.read_time} onChange={e => setForm({ ...form, read_time: e.target.value })} placeholder="5 min" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Image mise en avant</label>
              <input className={inputClass} value={form.featured_image_url} onChange={e => setForm({ ...form, featured_image_url: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <label className={labelClass}>Ordre</label>
              <input type="number" className={inputClass} value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
          </div>
          <label className="flex items-center gap-3 text-sm text-slate-300 pt-1">
            <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} />
            Publié
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

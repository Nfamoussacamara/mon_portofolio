import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';
import { defaultProfile } from '../../lib/siteContent';
import type { ProfileRecord } from '../../lib/siteContent';

const API = 'http://localhost:8000/api';
const inputClass = "w-full px-4 py-2.5 rounded-xl border text-sm bg-white/5 outline-none transition-all border-white/10 text-white placeholder-slate-600 focus:border-blue-500/50";
const labelClass = "block text-xs font-medium mb-1.5 text-slate-400";

interface ProfileForm {
  full_name: string;
  hero_title: string;
  hero_subtitle: string;
  avatar_url: string;
  about_text: string;
  github_url: string;
  linkedin_url: string;
  facebook_url: string;
  whatsapp_url: string;
  contact_email: string;
  location: string;
  projects_count: number;
  experience_years: number;
  technologies_count: number;
  available_for_hire: boolean;
}

const emptyForm: ProfileForm = {
  full_name: defaultProfile.full_name,
  hero_title: defaultProfile.hero_title,
  hero_subtitle: defaultProfile.hero_subtitle,
  avatar_url: defaultProfile.avatar_url,
  about_text: defaultProfile.about_text,
  github_url: defaultProfile.github_url,
  linkedin_url: defaultProfile.linkedin_url,
  facebook_url: defaultProfile.facebook_url,
  whatsapp_url: defaultProfile.whatsapp_url,
  contact_email: defaultProfile.contact_email,
  location: defaultProfile.location,
  projects_count: defaultProfile.projects_count,
  experience_years: defaultProfile.experience_years,
  technologies_count: defaultProfile.technologies_count,
  available_for_hire: defaultProfile.available_for_hire,
};

function toForm(profile?: ProfileRecord | null): ProfileForm {
  if (!profile) return emptyForm;
  return {
    full_name: profile.full_name ?? defaultProfile.full_name,
    hero_title: profile.hero_title ?? defaultProfile.hero_title,
    hero_subtitle: profile.hero_subtitle ?? defaultProfile.hero_subtitle,
    avatar_url: profile.avatar_url ?? defaultProfile.avatar_url,
    about_text: profile.about_text ?? defaultProfile.about_text,
    github_url: profile.github_url ?? defaultProfile.github_url,
    linkedin_url: profile.linkedin_url ?? defaultProfile.linkedin_url,
    facebook_url: profile.facebook_url ?? defaultProfile.facebook_url,
    whatsapp_url: profile.whatsapp_url ?? defaultProfile.whatsapp_url,
    contact_email: profile.contact_email ?? defaultProfile.contact_email,
    location: profile.location ?? defaultProfile.location,
    projects_count: profile.projects_count ?? defaultProfile.projects_count,
    experience_years: profile.experience_years ?? defaultProfile.experience_years,
    technologies_count: profile.technologies_count ?? defaultProfile.technologies_count,
    available_for_hire: profile.available_for_hire ?? defaultProfile.available_for_hire,
  };
}

export const AdminProfile = ({ token }: { token: string }) => {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<ProfileRecord | null>(null);
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const { data: profiles, isLoading, isError } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => (await fetch(`${API}/profile/`)).json(),
    retry: 1,
  });

  const profile = (profiles?.[0] ?? null) as ProfileRecord | null;
  const headers = { 'Authorization': `Bearer ${token}` };

  const save = useMutation({
    mutationFn: async (data: ProfileForm) => {
      const formData = new FormData();
      formData.append('full_name', data.full_name);
      formData.append('hero_title', data.hero_title);
      formData.append('hero_subtitle', data.hero_subtitle);
      formData.append('avatar_url', data.avatar_url);
      formData.append('about_text', data.about_text);
      formData.append('github_url', data.github_url);
      formData.append('linkedin_url', data.linkedin_url);
      formData.append('facebook_url', data.facebook_url);
      formData.append('whatsapp_url', data.whatsapp_url);
      formData.append('contact_email', data.contact_email);
      formData.append('location', data.location);
      formData.append('projects_count', String(data.projects_count));
      formData.append('experience_years', String(data.experience_years));
      formData.append('technologies_count', String(data.technologies_count));
      formData.append('available_for_hire', String(data.available_for_hire));
      if (cvFile) formData.append('cv_file', cvFile);

      const url = editing?.id ? `${API}/profile/${editing.id}/` : `${API}/profile/`;
      const res = await fetch(url, {
        method: editing?.id ? 'PATCH' : 'POST',
        headers,
        body: formData,
      });

      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-profile'] });
      showToast(editing ? 'Profil mis à jour !' : 'Profil créé !');
      setIsOpen(false);
      setEditing(null);
      setCvFile(null);
      setForm(emptyForm);
    },
    onError: () => showToast('Erreur lors de l\'enregistrement du profil.', 'error'),
  });

  const openEditor = () => {
    const current = profile ?? null;
    setEditing(current);
    setForm(toForm(current));
    setCvFile(null);
    setIsOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Profil global</h1>
          <p className="text-slate-400 text-sm mt-1">Modifiez le nom, le hero, l'about et les liens personnels</p>
        </div>
        <Button onClick={openEditor} className="bg-blue-600 text-white border-0">{profile ? 'Modifier' : '+ Créer le profil'}</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1].map(i => <TableRowSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <div className="text-sm text-slate-400">Impossible de charger le profil. Réessayez plus tard.</div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-xl font-bold text-white">{profile?.full_name ?? defaultProfile.full_name}</h3>
              <p className="text-slate-400 text-sm mt-1">{profile?.hero_title ?? defaultProfile.hero_title}</p>
            </div>
            <div className={`text-xs px-3 py-1 rounded-full border ${profile?.available_for_hire ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/20 bg-amber-500/10 text-amber-400'}`}>
              {profile?.available_for_hire ? 'Disponible' : 'Indisponible'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">Projets: <span className="text-white font-semibold">{profile?.projects_count ?? defaultProfile.projects_count}</span></div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">Expérience: <span className="text-white font-semibold">{profile?.experience_years ?? defaultProfile.experience_years} ans</span></div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">Technologies: <span className="text-white font-semibold">{profile?.technologies_count ?? defaultProfile.technologies_count}</span></div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{profile?.about_text ?? defaultProfile.about_text}</p>
        </motion.div>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Modifier le profil global' : 'Créer le profil global'}>
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nom complet</label>
              <input className={inputClass} value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required />
            </div>
            <div>
              <label className={labelClass}>Titre principal</label>
              <input className={inputClass} value={form.hero_title} onChange={e => setForm({ ...form, hero_title: e.target.value })} required />
            </div>
          </div>

          <div>
            <label className={labelClass}>Sous-titre / accroche</label>
            <textarea rows={3} className={inputClass + ' resize-none'} value={form.hero_subtitle} onChange={e => setForm({ ...form, hero_subtitle: e.target.value })} />
          </div>

          <div>
            <label className={labelClass}>Texte À propos</label>
            <textarea rows={8} className={inputClass + ' resize-none'} value={form.about_text} onChange={e => setForm({ ...form, about_text: e.target.value })} placeholder="Sépare les paragraphes avec une ligne vide." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>URL photo de profil</label>
              <input className={inputClass} value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })} placeholder="/profil-removebg-preview.png" />
            </div>
            <div>
              <label className={labelClass}>CV (PDF)</label>
              <input type="file" accept="application/pdf" className={inputClass} onChange={e => setCvFile(e.target.files?.[0] ?? null)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Lien GitHub</label>
              <input className={inputClass} value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." />
            </div>
            <div>
              <label className={labelClass}>Lien LinkedIn</label>
              <input className={inputClass} value={form.linkedin_url} onChange={e => setForm({ ...form, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Lien Facebook</label>
              <input className={inputClass} value={form.facebook_url} onChange={e => setForm({ ...form, facebook_url: e.target.value })} placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className={labelClass}>Lien WhatsApp</label>
              <input className={inputClass} value={form.whatsapp_url} onChange={e => setForm({ ...form, whatsapp_url: e.target.value })} placeholder="https://wa.me/..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Adresse email de contact</label>
              <input className={inputClass} value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} placeholder="contact@exemple.com" />
            </div>
            <div>
              <label className={labelClass}>Localisation</label>
              <input className={inputClass} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Conakry, Guinée" />
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-slate-300 pt-1">
            <input type="checkbox" checked={form.available_for_hire} onChange={e => setForm({ ...form, available_for_hire: e.target.checked })} />
            Disponible pour de nouveaux projets
          </label>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Années d'exp.</label>
              <input type="number" className={inputClass} value={form.experience_years} onChange={e => setForm({ ...form, experience_years: Number(e.target.value) })} required />
            </div>
            <div>
              <label className={labelClass}>Projets finis</label>
              <input type="number" className={inputClass} value={form.projects_count} onChange={e => setForm({ ...form, projects_count: Number(e.target.value) })} required />
            </div>
            <div>
              <label className={labelClass}>Techs maîtrisées</label>
              <input type="number" className={inputClass} value={form.technologies_count} onChange={e => setForm({ ...form, technologies_count: Number(e.target.value) })} required />
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

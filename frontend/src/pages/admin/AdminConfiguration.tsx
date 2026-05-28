import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';

const API = 'http://localhost:8000/api';
const inp = "w-full px-4 py-2.5 rounded-xl border text-sm bg-white/5 outline-none transition-all border-white/10 text-white placeholder-slate-600 focus:border-blue-500/50";
const lbl = "block text-xs font-medium mb-1.5 text-slate-400";

type ConfigTab = 'identity' | 'hero' | 'about' | 'contact' | 'cta' | 'footer';

const configTabs: { id: ConfigTab; label: string; icon: string }[] = [
  { id: 'identity', label: 'Identité',  icon: '👤' },
  { id: 'hero',     label: 'Hero',      icon: '🧭' },
  { id: 'about',    label: 'À propos',  icon: 'ℹ️'  },
  { id: 'contact',  label: 'Contact',   icon: '📨' },
  { id: 'cta',      label: 'CTA',       icon: '🎯' },
  { id: 'footer',   label: 'Footer',    icon: '⚓' },
];

function SaveBar({ isPending, isError, saved }: { isPending: boolean; isError: boolean; saved: boolean }) {
  return (
    <div className="flex items-center gap-4 pt-2">
      <Button type="submit" disabled={isPending} className="bg-blue-600 text-white border-0 px-6">
        {isPending ? 'Enregistrement...' : 'Enregistrer'}
      </Button>
      {saved && <span className="text-emerald-400 text-sm flex items-center gap-1.5"><span>✓</span> Enregistré</span>}
      {isError && <span className="text-red-400 text-sm flex items-center gap-1.5"><span>✗</span> Erreur</span>}
    </div>
  );
}

export const AdminConfiguration = ({ token }: { token: string }) => {
  const [activeTab, setActiveTab] = useState<ConfigTab>('identity');

  const qc = useQueryClient();

  const { data: profileList, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => (await fetch(`${API}/profile/`, { headers: { 'Authorization': `Bearer ${token}` } })).json(),
    staleTime: 60_000,
  });

  const profile = profileList?.[0] ?? null;

  const patch = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      if (!profile?.id) throw new Error('Pas de profil');
      
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => formData.append(key, String(v)));
          } else {
            formData.append(key, value instanceof File ? value : String(value));
          }
        }
      });

      const res = await fetch(`${API}/profile/${profile.id}/`, { 
        method: 'PATCH', 
        headers: { 'Authorization': `Bearer ${token}` }, // No content-type for FormData
        body: formData 
      });

      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-profile'] }),
  });

  if (isLoading) return <div className="text-slate-400 text-sm">Chargement...</div>;
  if (!profile) return <div className="text-slate-400 text-sm">Aucun profil trouvé. Lancez <code className="bg-white/5 px-1 rounded">seed_data</code> depuis le backend.</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Configuration Globale</h1>
        <p className="text-slate-400 text-sm mt-1">Gérez tous les textes et paramètres du site</p>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl mb-8 overflow-x-auto w-full">
        {configTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="configTabBg"
                className="absolute inset-0 bg-blue-500/20 border border-blue-500/30 rounded-lg"
                initial={false}
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10">{tab.icon}</span>
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'identity' && <IdentityPanel profile={profile} patch={patch} />}
          {activeTab === 'hero'     && <HeroPanel profile={profile} patch={patch} />}
          {activeTab === 'about'    && <AboutPanel profile={profile} patch={patch} />}
          {activeTab === 'contact'  && <ContactPanel profile={profile} patch={patch} />}
          {activeTab === 'cta'      && <CTAPanel profile={profile} patch={patch} />}
          {activeTab === 'footer'   && <FooterPanel profile={profile} patch={patch} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ─── Identité ─── */
function IdentityPanel({ profile, patch }: { profile: any; patch: any }) {
  const [form, setForm] = useState<any>({ 
    full_name: '', avatar: null as File | null, avatar_url: '', 
    location: '', available_for_hire: true, 
    experience_years: 0, projects_count: 0, technologies_count: 0,
    cv_file: null as File | null
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? '',
        avatar: null,
        avatar_url: profile.avatar_url ?? '',
        location: profile.location ?? '',
        available_for_hire: profile.available_for_hire ?? true,
        experience_years: profile.experience_years ?? 0,
        projects_count: profile.projects_count ?? 0,
        technologies_count: profile.technologies_count ?? 0,
        cv_file: null
      });
      setPreviewUrl(profile.avatar_url || null);
    }
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'cv_file') => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, [field]: file });
      if (field === 'avatar') {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await patch.mutateAsync(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={submit} className="space-y-5 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Nom complet</label>
          <input className={inp} value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required />
        </div>
        <div>
          <label className={lbl}>Localisation</label>
          <input className={inp} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Conakry, Guinée" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 w-full">
          <label className={lbl}>Photo de profil</label>
          <div className="flex flex-col gap-3">
            <div className="flex gap-4 items-center">
              <label className="flex-1 cursor-pointer">
                <div className="px-4 py-2 bg-white/5 border border-white/10 border-dashed rounded-xl text-xs text-slate-400 hover:bg-white/10 transition-all text-center">
                  {form.avatar ? form.avatar.name : 'Uploader une photo'}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={e => handleFileChange(e, 'avatar')} />
              </label>
              <div className="text-slate-600 text-[10px] font-mono">OU</div>
              <input
                className={inp + " flex-[1.5]"}
                value={form.avatar_url}
                onChange={e => { setForm({ ...form, avatar_url: e.target.value }); setPreviewUrl(e.target.value); }}
                placeholder="URL (externe)"
              />
            </div>
            
            <label className={lbl + " mt-2"}>Fichier CV (PDF)</label>
            <label className="cursor-pointer">
              <div className="px-4 py-2 bg-white/5 border border-white/10 border-dashed rounded-xl text-xs text-slate-400 hover:bg-white/10 transition-all">
                {form.cv_file ? form.cv_file.name : profile.cv_file ? 'Changer le CV (PDF)' : 'Uploader le CV (PDF)'}
              </div>
              <input type="file" className="hidden" accept=".pdf" onChange={e => handleFileChange(e, 'cv_file')} />
            </label>
          </div>
        </div>

        {previewUrl && (
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500/30 flex-shrink-0 bg-white/5">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={lbl}>Années d'expérience</label>
          <input type="number" className={inp} value={form.experience_years} onChange={e => setForm({ ...form, experience_years: Number(e.target.value) })} required />
        </div>
        <div>
          <label className={lbl}>Projets réalisés</label>
          <input type="number" className={inp} value={form.projects_count} onChange={e => setForm({ ...form, projects_count: Number(e.target.value) })} required />
        </div>
        <div>
          <label className={lbl}>Technologies</label>
          <input type="number" className={inp} value={form.technologies_count} onChange={e => setForm({ ...form, technologies_count: Number(e.target.value) })} required />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer pt-1">
        <div
          onClick={() => setForm({ ...form, available_for_hire: !form.available_for_hire })}
          className={`relative w-10 h-5 rounded-full transition-colors ${form.available_for_hire ? 'bg-emerald-500' : 'bg-slate-600'}`}
        >
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.available_for_hire ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
        <span className={`text-sm font-medium ${form.available_for_hire ? 'text-emerald-400' : 'text-slate-400'}`}>
          {form.available_for_hire ? 'Disponible pour des projets' : 'Indisponible actuellement'}
        </span>
      </label>
      <SaveBar isPending={patch.isPending} isError={patch.isError} saved={saved} />
    </form>
  );
}

/* ─── Hero ─── */
function HeroPanel({ profile, patch }: { profile: any; patch: any }) {
  const [form, setForm] = useState({ hero_title: '', hero_subtitle: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setForm({ hero_title: profile.hero_title ?? '', hero_subtitle: profile.hero_subtitle ?? '' });
  }, [profile]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await patch.mutateAsync(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={submit} className="space-y-5 max-w-2xl mx-auto">
      {/* Live preview */}
      <div className="p-5 bg-gradient-to-r from-blue-600/15 to-indigo-600/15 border border-blue-500/20 rounded-xl mb-2">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Aperçu en direct</p>
        <h3 className="text-2xl font-bold text-white mb-1">{form.hero_title || '—'}</h3>
        <p className="text-slate-400 text-sm">{form.hero_subtitle || '—'}</p>
      </div>
      <div>
        <label className={lbl}>Titre d'accroche</label>
        <input className={inp} value={form.hero_title} onChange={e => setForm({ ...form, hero_title: e.target.value })} placeholder="ex: Développeur Full-Stack" required />
      </div>
      <div>
        <label className={lbl}>Sous-titre</label>
        <textarea rows={4} className={inp + ' resize-none'} value={form.hero_subtitle} onChange={e => setForm({ ...form, hero_subtitle: e.target.value })} placeholder="Décrivez votre expertise..." />
      </div>
      <SaveBar isPending={patch.isPending} isError={patch.isError} saved={saved} />
    </form>
  );
}

/* ─── About ─── */
function AboutPanel({ profile, patch }: { profile: any; patch: any }) {
  const [form, setForm] = useState({ about_text: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setForm({ about_text: profile.about_text ?? '' });
  }, [profile]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await patch.mutateAsync(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={submit} className="space-y-5 max-w-2xl mx-auto">
      <div className="p-4 bg-white/3 border border-white/5 rounded-xl text-xs text-slate-500">
        💡 Séparez les paragraphes avec une ligne vide pour un meilleur rendu sur le site.
      </div>
      <div>
        <label className={lbl}>Texte « À propos »</label>
        <textarea rows={10} className={inp + ' resize-none'} value={form.about_text} onChange={e => setForm({ ...form, about_text: e.target.value })} placeholder="Je suis..." />
      </div>
      <SaveBar isPending={patch.isPending} isError={patch.isError} saved={saved} />
    </form>
  );
}

/* ─── Contact ─── */
function ContactPanel({ profile, patch }: { profile: any; patch: any }) {
  const [form, setForm] = useState({ contact_page_title: '', contact_page_description: '', contact_email: '', location: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setForm({
      contact_page_title: profile.contact_page_title ?? '',
      contact_page_description: profile.contact_page_description ?? '',
      contact_email: profile.contact_email ?? '',
      location: profile.location ?? '',
    });
  }, [profile]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await patch.mutateAsync(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={submit} className="space-y-5 max-w-2xl mx-auto">
      <div>
        <label className={lbl}>Titre de la page Contact</label>
        <input className={inp} value={form.contact_page_title} onChange={e => setForm({ ...form, contact_page_title: e.target.value })} placeholder="Parlons de votre projet" />
      </div>
      <div>
        <label className={lbl}>Description</label>
        <textarea rows={4} className={inp + ' resize-none'} value={form.contact_page_description} onChange={e => setForm({ ...form, contact_page_description: e.target.value })} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={lbl}>Email de contact</label>
          <input type="email" className={inp} value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} placeholder="contact@example.com" />
        </div>
        <div>
          <label className={lbl}>Localisation</label>
          <input className={inp} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Conakry, Guinée" />
        </div>
      </div>
      <SaveBar isPending={patch.isPending} isError={patch.isError} saved={saved} />
    </form>
  );
}

/* ─── CTA ─── */
function CTAPanel({ profile, patch }: { profile: any; patch: any }) {
  const [form, setForm] = useState({ cta_headline_active: '', cta_headline_inactive: '', cta_description_active: '', cta_description_inactive: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setForm({
      cta_headline_active: profile.cta_headline_active ?? '',
      cta_headline_inactive: profile.cta_headline_inactive ?? '',
      cta_description_active: profile.cta_description_active ?? '',
      cta_description_inactive: profile.cta_description_inactive ?? '',
    });
  }, [profile]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await patch.mutateAsync(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-2xl mx-auto">
      <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-4">
        <h3 className="text-emerald-400 text-sm font-semibold flex items-center gap-2"><span>🟢</span> Quand vous êtes disponible</h3>
        <div>
          <label className={lbl}>Titre</label>
          <input className={inp} value={form.cta_headline_active} onChange={e => setForm({ ...form, cta_headline_active: e.target.value })} />
        </div>
        <div>
          <label className={lbl}>Description</label>
          <textarea rows={2} className={inp + ' resize-none'} value={form.cta_description_active} onChange={e => setForm({ ...form, cta_description_active: e.target.value })} />
        </div>
      </div>
      <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-4">
        <h3 className="text-amber-400 text-sm font-semibold flex items-center gap-2"><span>🟡</span> Quand vous êtes indisponible</h3>
        <div>
          <label className={lbl}>Titre</label>
          <input className={inp} value={form.cta_headline_inactive} onChange={e => setForm({ ...form, cta_headline_inactive: e.target.value })} />
        </div>
        <div>
          <label className={lbl}>Description</label>
          <textarea rows={2} className={inp + ' resize-none'} value={form.cta_description_inactive} onChange={e => setForm({ ...form, cta_description_inactive: e.target.value })} />
        </div>
      </div>
      <SaveBar isPending={patch.isPending} isError={patch.isError} saved={saved} />
    </form>
  );
}

/* ─── Footer ─── */
function FooterPanel({ profile, patch }: { profile: any; patch: any }) {
  const [form, setForm] = useState({ github_url: '', linkedin_url: '', facebook_url: '', whatsapp_url: '', footer_copyright: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setForm({
      github_url: profile.github_url ?? '',
      linkedin_url: profile.linkedin_url ?? '',
      facebook_url: profile.facebook_url ?? '',
      whatsapp_url: profile.whatsapp_url ?? '',
      footer_copyright: profile.footer_copyright ?? '',
    });
  }, [profile]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await patch.mutateAsync(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const socials = [
    { field: 'github_url', label: 'GitHub', placeholder: 'https://github.com/...' },
    { field: 'linkedin_url', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
    { field: 'facebook_url', label: 'Facebook', placeholder: 'https://facebook.com/...' },
    { field: 'whatsapp_url', label: 'WhatsApp', placeholder: 'https://wa.me/...' },
  ];

  return (
    <form onSubmit={submit} className="space-y-5 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {socials.map(s => (
          <div key={s.field}>
            <label className={lbl}>{s.label}</label>
            <input type="url" className={inp} value={(form as any)[s.field]} onChange={e => setForm({ ...form, [s.field]: e.target.value })} placeholder={s.placeholder} />
          </div>
        ))}
      </div>
      <div>
        <label className={lbl}>Texte copyright</label>
        <input className={inp} value={form.footer_copyright} onChange={e => setForm({ ...form, footer_copyright: e.target.value })} placeholder="© {year} — Tous droits réservés." />
        <p className="text-[11px] text-slate-600 mt-1">Utilisez <code className="bg-white/5 px-1 rounded">{'{year}'}</code> pour l'année dynamique.</p>
      </div>
      <SaveBar isPending={patch.isPending} isError={patch.isError} saved={saved} />
    </form>
  );
}

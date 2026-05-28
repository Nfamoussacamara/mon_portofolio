import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/Button';
import { defaultProfile } from '../../lib/siteContent';

interface HeroData {
  hero_title: string;
  hero_subtitle: string;
}

export const AdminHero = ({ token }: { token: string }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<HeroData>({
    hero_title: defaultProfile.hero_title,
    hero_subtitle: defaultProfile.hero_subtitle,
  });
  const [saved, setSaved] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/api/profile/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return res.json().then(data => data[0] || {});
    },
    staleTime: 60_000,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        hero_title: profile.hero_title || defaultProfile.hero_title,
        hero_subtitle: profile.hero_subtitle || defaultProfile.hero_subtitle,
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async (data: HeroData) => {
      const res = await fetch(`http://localhost:8000/api/profile/${profile.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div className="text-slate-400">Chargement...</div>;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Section Hero</h2>
        <p className="text-slate-400 text-sm">C'est la première section que voit un visiteur. Vous pouvez modifier le titre et le sous-titre.</p>
      </div>

      {/* Aperçu actuel */}
      <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-xl p-6 mb-8">
        <div className="text-sm text-slate-400 mb-4 uppercase tracking-wide">Aperçu actuel</div>
        <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">{formData.hero_title}</h3>
        <p className="text-slate-300 text-lg max-w-2xl">{formData.hero_subtitle}</p>
      </div>

      {/* Formulaire d'édition */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-2">Titre Hero</label>
          <input
            type="text"
            name="hero_title"
            value={formData.hero_title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50"
            placeholder="ex: Développeur Full-Stack"
          />
          <p className="text-xs text-slate-500 mt-1">Titre d'accroche principal (visible au-dessus du sous-titre)</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sous-titre Hero</label>
          <textarea
            name="hero_subtitle"
            value={formData.hero_subtitle}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50 resize-none"
            placeholder="Décrivez votre expertise..."
          />
          <p className="text-xs text-slate-500 mt-1">Description courte (2-3 lignes recommendées)</p>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
          {saved && <span className="text-emerald-400 text-sm flex items-center">✓ Enregistré</span>}
          {updateMutation.isError && (
            <span className="text-red-400 text-sm flex items-center">✗ Erreur</span>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminHero;

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/Button';
import { API_BASE } from '../../lib/api';

interface AboutData {
  about_text: string;
  projects_count: number;
  experience_years: number;
  technologies_count: number;
}

export const AdminAbout = ({ token }: { token: string }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<AboutData>({
    about_text: '',
    projects_count: 12,
    experience_years: 3,
    technologies_count: 20,
  });
  const [saved, setSaved] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/profile/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return res.json().then(data => data[0] || {});
    },
    staleTime: 60_000,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        about_text: profile.about_text || '',
        projects_count: profile.projects_count || 12,
        experience_years: profile.experience_years || 3,
        technologies_count: profile.technologies_count || 20,
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async (data: AboutData) => {
      const res = await fetch(`${API_BASE}/profile/${profile.id}/`, {
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
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('_count') || name.includes('_years') ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div className="text-slate-400">Chargement...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Éditer À propos</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-2">Texte « À propos »</label>
          <textarea
            name="about_text"
            value={formData.about_text}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50 resize-none"
            placeholder="Entrez le texte de la section À propos. Séparez les paragraphes par des lignes vides."
          />
          <p className="text-xs text-slate-500 mt-2">Paragraphes séparés par des lignes vides</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Projets livrés</label>
            <input
              type="number"
              name="projects_count"
              value={formData.projects_count}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Années d'expérience</label>
            <input
              type="number"
              name="experience_years"
              value={formData.experience_years}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Technologies</label>
            <input
              type="number"
              name="technologies_count"
              value={formData.technologies_count}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50"
              min="0"
            />
          </div>
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

export default AdminAbout;

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/Button';
import { API_BASE } from '../../lib/api';

interface FooterData {
  github_url: string;
  linkedin_url: string;
  facebook_url: string;
  whatsapp_url: string;
  footer_copyright: string;
}

export const AdminFooter = ({ token }: { token: string }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FooterData>({
    github_url: '',
    linkedin_url: '',
    facebook_url: '',
    whatsapp_url: '',
    footer_copyright: '',
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
        github_url: profile.github_url || '',
        linkedin_url: profile.linkedin_url || '',
        facebook_url: profile.facebook_url || '',
        whatsapp_url: profile.whatsapp_url || '',
        footer_copyright: profile.footer_copyright || '',
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async (data: FooterData) => {
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div className="text-slate-400">Chargement...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Éditer le pied de page</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h3 className="text-blue-300 font-medium mb-4">Liens sociaux</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">GitHub</label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50"
                placeholder="https://github.com/votre-username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn</label>
              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50"
                placeholder="https://linkedin.com/in/votre-profil"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Facebook</label>
              <input
                type="url"
                name="facebook_url"
                value={formData.facebook_url}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50"
                placeholder="https://facebook.com/votre-page"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">WhatsApp</label>
              <input
                type="url"
                name="whatsapp_url"
                value={formData.whatsapp_url}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50"
                placeholder="https://wa.me/22374XXXXXX"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Texte copyright</label>
          <textarea
            name="footer_copyright"
            value={formData.footer_copyright}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50 resize-none"
            placeholder="© {year} — Tous droits réservés."
          />
          <p className="text-xs text-slate-500 mt-2">Utilisez {'{year}'} pour afficher l'année dynamiquement</p>
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

export default AdminFooter;

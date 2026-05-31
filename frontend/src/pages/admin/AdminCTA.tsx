import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/Button';
import { API_BASE } from '../../lib/api';

interface CTAData {
  cta_headline_active: string;
  cta_headline_inactive: string;
  cta_description_active: string;
  cta_description_inactive: string;
}

export const AdminCTA = ({ token }: { token: string }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CTAData>({
    cta_headline_active: '',
    cta_headline_inactive: '',
    cta_description_active: '',
    cta_description_inactive: '',
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
        cta_headline_active: profile.cta_headline_active || '',
        cta_headline_inactive: profile.cta_headline_inactive || '',
        cta_description_active: profile.cta_description_active || '',
        cta_description_inactive: profile.cta_description_inactive || '',
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async (data: CTAData) => {
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
      <h2 className="text-2xl font-bold mb-6">Éditer Call To Action</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h3 className="text-blue-300 font-medium mb-4">Quand vous êtes disponible (available_for_hire = True)</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titre CTA (disponible)</label>
              <input
                type="text"
                name="cta_headline_active"
                value={formData.cta_headline_active}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50"
                placeholder="ex: Prêt à sécuriser & scaler vos applications ?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description CTA (disponible)</label>
              <textarea
                name="cta_description_active"
                value={formData.cta_description_active}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50 resize-none"
                placeholder="Décrivez votre valeur..."
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <h3 className="text-amber-300 font-medium mb-4">Quand vous êtes indisponible (available_for_hire = False)</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titre CTA (indisponible)</label>
              <input
                type="text"
                name="cta_headline_inactive"
                value={formData.cta_headline_inactive}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50"
                placeholder="ex: Découvrez mon portfolio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description CTA (indisponible)</label>
              <textarea
                name="cta_description_inactive"
                value={formData.cta_description_inactive}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50 resize-none"
                placeholder="Message alternatif..."
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            isLoading={updateMutation.isPending}
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

export default AdminCTA;

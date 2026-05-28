import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/Button';

interface ContactData {
  contact_page_title: string;
  contact_page_description: string;
  contact_email: string;
  location: string;
}

export const AdminContact = ({ token }: { token: string }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ContactData>({
    contact_page_title: '',
    contact_page_description: '',
    contact_email: '',
    location: '',
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
        contact_page_title: profile.contact_page_title || '',
        contact_page_description: profile.contact_page_description || '',
        contact_email: profile.contact_email || '',
        location: profile.location || '',
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async (data: ContactData) => {
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
      <h2 className="text-2xl font-bold mb-6">Éditer page Contact</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-2">Titre page Contact</label>
          <input
            type="text"
            name="contact_page_title"
            value={formData.contact_page_title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50"
            placeholder="ex: Parlons de votre projet"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description page Contact</label>
          <textarea
            name="contact_page_description"
            value={formData.contact_page_description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50 resize-none"
            placeholder="Décrivez ce qui vous intéresse..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email de contact</label>
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50"
              placeholder="contact@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Localisation</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white outline-none focus:border-blue-500/50"
              placeholder="Conakry, Guinée"
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

export default AdminContact;

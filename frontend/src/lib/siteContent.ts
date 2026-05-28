import { useQuery } from '@tanstack/react-query';
import { API_BASE, BACKEND_BASE } from './api';


export type ProfileRecord = {
  id?: number;
  full_name?: string;
  hero_title?: string;
  hero_subtitle?: string;
  avatar_url?: string;
  about_text?: string;
  cv_file?: string | null;
  contact_page_title?: string;
  contact_page_description?: string;
  cta_headline_active?: string;
  cta_headline_inactive?: string;
  cta_description_active?: string;
  cta_description_inactive?: string;
  footer_copyright?: string;
  github_url?: string;
  linkedin_url?: string;
  facebook_url?: string;
  whatsapp_url?: string;
  contact_email?: string;
  location?: string;
  projects_count?: number;
  experience_years?: number;
  technologies_count?: number;
  available_for_hire?: boolean;
};

export type SkillRecord = {
  id: number;
  name: string;
  category: string;
  mastery_percentage: number;
  icon_name?: string;
  order: number;
};

export type EducationRecord = {
  id: number;
  title: string;
  institution: string;
  start_year: string;
  end_year: string;
  description: string;
  entry_type: string;
  order: number;
};

export type ProjectRecord = {
  id: number;
  title: string;
  description: string;
  detailed_description?: string;
  image_url?: string;
  link_github?: string;
  link_demo?: string;
  category: string;
  stack: string[];
  is_featured?: boolean;
};

export type BlogPostRecord = {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  content?: string;
  featured_image_url?: string;
  is_published?: boolean;
  order?: number;
  published_at?: string;
};

export const defaultProfile: Required<Omit<ProfileRecord, 'id'>> = {
  full_name: "N'famoussa Camara",
  hero_title: 'Développeur Full-Stack',
  hero_subtitle: 'Spécialisé en Cybersécurité, React & Django. Je construis des applications robustes, sécurisées et prêtes pour la production.',
  avatar_url: '/profil-removebg-preview.png',
  about_text: [
    "Je suis N'Famoussa Camara, développeur full-stack passionné par la conception d'applications web modernes, performantes et évolutives.",
    "Actuellement étudiant en informatique à l'Université de Labé, je développe des solutions numériques orientées résolution de problèmes réels avec une forte attention portée à l'architecture logicielle, à la qualité du code et à l'expérience utilisateur.",
    "Je travaille principalement avec React, Django REST Framework et PostgreSQL pour construire des applications full-stack rapides, maintenables et scalables. Je m'intéresse particulièrement au développement backend, aux APIs REST, aux architectures propres, aux principes SOLID ainsi qu'à l'optimisation des performances web. Au-delà du développement, je m'intéresse également à la cybersécurité, aux réseaux informatiques et à la conception de plateformes capables d'avoir un impact concret dans des domaines comme l'éducation, la santé numérique, l'immobilier et les services digitaux en Guinée."
  ].join('\n\n'),
  cv_file: '/cv.pdf',
  contact_page_title: 'Parlons de votre projet',
  contact_page_description: 'Architecture d\'entreprise, audit de sécurité ou produit web innovant — n\'hésitez pas à me contacter. Je réponds dans les 24h.',
  cta_headline_active: 'Prêt à sécuriser & scaler vos applications ?',
  cta_headline_inactive: 'Découvrez mon portfolio',
  cta_description_active: 'Basé sur les standards de l\'industrie, je transforme vos idées en produits robustes.',
  cta_description_inactive: 'Le portfolio reste consultable en continu, avec des contenus éditables depuis le dashboard.',
  footer_copyright: '© {year} — Tous droits réservés.',
  github_url: '',
  linkedin_url: '',
  facebook_url: '',
  whatsapp_url: '',
  contact_email: 'contact@votre-email.com',
  location: 'Conakry, Guinée',
  projects_count: 12,
  experience_years: 3,
  technologies_count: 20,
  available_for_hire: true,
};

const defaultSkillIcons: Record<string, string> = {
  React: 'react',
  TypeScript: 'typescript',
  Python: 'python',
  Django: 'django',
  Docker: 'docker',
  PostgreSQL: 'postgresql',
  Redis: 'redis',
  Linux: 'linux',
  Git: 'git',
  'Node.js': 'nodedotjs',
  Tailwind: 'tailwindcss',
  GraphQL: 'graphql',
};

export const fallbackSkills: SkillRecord[] = [
  { id: 1, name: 'React', category: 'Frontend', mastery_percentage: 95, icon_name: 'react', order: 1 },
  { id: 2, name: 'TypeScript', category: 'Frontend', mastery_percentage: 90, icon_name: 'typescript', order: 2 },
  { id: 3, name: 'Python', category: 'Backend', mastery_percentage: 95, icon_name: 'python', order: 3 },
  { id: 4, name: 'Django', category: 'Backend', mastery_percentage: 92, icon_name: 'django', order: 4 },
  { id: 5, name: 'Docker', category: 'DevOps', mastery_percentage: 88, icon_name: 'docker', order: 5 },
  { id: 6, name: 'PostgreSQL', category: 'Backend', mastery_percentage: 90, icon_name: 'postgresql', order: 6 },
  { id: 7, name: 'Redis', category: 'Backend', mastery_percentage: 80, icon_name: 'redis', order: 7 },
  { id: 8, name: 'Linux', category: 'DevOps', mastery_percentage: 85, icon_name: 'linux', order: 8 },
  { id: 9, name: 'Git', category: 'Other', mastery_percentage: 92, icon_name: 'git', order: 9 },
  { id: 10, name: 'Node.js', category: 'Backend', mastery_percentage: 82, icon_name: 'nodedotjs', order: 10 },
  { id: 11, name: 'Tailwind', category: 'Frontend', mastery_percentage: 90, icon_name: 'tailwindcss', order: 11 },
  { id: 12, name: 'GraphQL', category: 'Backend', mastery_percentage: 70, icon_name: 'graphql', order: 12 },
];

export const fallbackEducation: EducationRecord[] = [
  {
    id: 1,
    title: 'Licence en Informatique',
    institution: 'Université de Labé',
    start_year: '2021',
    end_year: 'Présent',
    description: "Développement d'algorithmes complexes, architecture web et cybersécurité.",
    entry_type: 'Education',
    order: 1,
  },
  {
    id: 2,
    title: 'Baccalauréat Scientifique',
    institution: 'Lycée',
    start_year: '2021',
    end_year: '2021',
    description: 'Forte dominante en mathématiques et sciences physiques.',
    entry_type: 'Education',
    order: 2,
  },
  {
    id: 3,
    title: "Brevet d'Études du Premier Cycle",
    institution: 'Collège',
    start_year: '2018',
    end_year: '2018',
    description: 'Formation générale et bases scientifiques.',
    entry_type: 'Education',
    order: 3,
  },
  {
    id: 4,
    title: "Certificat d'Études Primaires",
    institution: 'École Primaire',
    start_year: '2014',
    end_year: '2014',
    description: "Premiers pas dans l'apprentissage formel.",
    entry_type: 'Education',
    order: 4,
  },
];

export const fallbackProjects: ProjectRecord[] = [
  {
    id: 1,
    title: 'IdentiGuinée Secure Core',
    description: "Système d'identité nationale certifié. Architecture complexe avec gestion de documents asynchrone et vérification biométrique.",
    image_url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=700',
    stack: ['Django', 'React', 'Cybersécurité'],
    category: 'Full-Stack',
    link_github: '#',
    link_demo: '#',
  },
  {
    id: 2,
    title: 'API Rate Limiter Pro',
    description: 'Middleware haute performance pour bloquer les attaques DDoS et bruteforce sur des endpoints critiques. Basé sur Redis.',
    image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=700',
    stack: ['Python', 'Redis', 'Cybersécurité'],
    category: 'Backend',
    link_github: '#',
  },
  {
    id: 3,
    title: 'Dashboard Analytics Premium',
    description: "Interface Mission Control avec rendu Glassmorphism, graphiques en temps réel et thème adaptatif dark/light.",
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=700',
    stack: ['React', 'Framer Motion', 'Tailwind CSS'],
    category: 'Frontend',
    link_demo: '#',
  },
];

export const fallbackBlogPosts: BlogPostRecord[] = [
  {
    id: 1,
    title: "Pourquoi l'architecture Clean est vitale en 2026",
    excerpt: "Découvrez comment structurer vos projets Django et React pour qu'ils durent des années sans devenir une dette technique.",
    date: '24 Mai 2026',
    category: 'Architecture',
    readTime: '5 min',
  },
  {
    id: 2,
    title: 'Securing JWT: Les erreurs que vous faites probablement',
    excerpt: 'HttpOnly, SameSite, Refresh Tokens... On fait le tour des bonnes pratiques pour sécuriser vos APIs Django REST.',
    date: '18 Mai 2026',
    category: 'Cybersécurité',
    readTime: '8 min',
  },
];

export function normalizeProfile(profile?: ProfileRecord | null): Required<Omit<ProfileRecord, 'id'>> {
  return { ...defaultProfile, ...(profile ?? {}) };
}

export function resolveMediaUrl(value?: string | null) {
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  if (value.startsWith('/media/')) return `${BACKEND_BASE}${value}`;
  return value;
}

export function getSkillIconUrl(skill: Partial<SkillRecord>) {
  const normalizedName = skill.name?.trim() ?? '';
  const iconSlug = skill.icon_name?.trim() || defaultSkillIcons[normalizedName] || normalizedName.toLowerCase().replace(/[^a-z0-9]+/g, '');
  if (!iconSlug) return 'https://cdn.simpleicons.org/code?size=96';
  return `https://cdn.simpleicons.org/${iconSlug}?size=96`;
}

export function usePublicProfile() {
  return useQuery({
    queryKey: ['public-profile'],
    queryFn: async (): Promise<ProfileRecord | null> => {
      try {
        const response = await fetch(`${API_BASE}/profile/`);
        if (!response.ok) return null;
        const data = await response.json();
        return Array.isArray(data) ? (data[0] ?? null) : data;
      } catch {
        return null;
      }
    },
    staleTime: 60_000,
  });
}

export function usePublicSkills() {
  return useQuery({
    queryKey: ['public-skills'],
    initialData: fallbackSkills,
    queryFn: async (): Promise<SkillRecord[]> => {
      try {
        const response = await fetch(`${API_BASE}/skills/`);
        if (!response.ok) return fallbackSkills;
        const data = await response.json();
        return Array.isArray(data) && data.length ? data : fallbackSkills;
      } catch {
        return fallbackSkills;
      }
    },
    staleTime: 60_000,
  });
}

export function usePublicEducation() {
  return useQuery({
    queryKey: ['public-education'],
    initialData: fallbackEducation,
    queryFn: async (): Promise<EducationRecord[]> => {
      try {
        const response = await fetch(`${API_BASE}/education/`);
        if (!response.ok) return fallbackEducation;
        const data = await response.json();
        return Array.isArray(data) && data.length ? data : fallbackEducation;
      } catch {
        return fallbackEducation;
      }
    },
    staleTime: 60_000,
  });
}

export function usePublicProjects() {
  return useQuery({
    queryKey: ['public-projects'],
    initialData: fallbackProjects,
    queryFn: async (): Promise<ProjectRecord[]> => {
      try {
        const response = await fetch(`${API_BASE}/projects/`);
        if (!response.ok) return fallbackProjects;
        const data = await response.json();
        return Array.isArray(data) && data.length ? data : fallbackProjects;
      } catch {
        return fallbackProjects;
      }
    },
    staleTime: 60_000,
  });
}

export function usePublicBlogPosts() {
  return useQuery({
    queryKey: ['public-blog-posts'],
    initialData: fallbackBlogPosts,
    queryFn: async (): Promise<BlogPostRecord[]> => {
      try {
        const response = await fetch(`${API_BASE}/blog/?published=true`);
        if (!response.ok) return fallbackBlogPosts;
        const data = await response.json();
        const mapped = Array.isArray(data)
          ? data.map((post: any) => ({
              id: post.id,
              title: post.title,
              excerpt: post.excerpt,
              date: post.published_at ? new Date(post.published_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Publié récemment',
              category: post.category,
              readTime: post.read_time,
              content: post.content,
              featured_image_url: post.featured_image_url,
              is_published: post.is_published,
              order: post.order,
              published_at: post.published_at,
            }))
          : [];
        return mapped.length ? mapped : fallbackBlogPosts;
      } catch {
        return fallbackBlogPosts;
      }
    },
    staleTime: 60_000,
  });
}

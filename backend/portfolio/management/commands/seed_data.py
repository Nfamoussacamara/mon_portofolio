from django.core.management.base import BaseCommand
from portfolio.models import Profile, Skill, Education, Project
from blog.models import BlogPost
from datetime import datetime


class Command(BaseCommand):
    help = 'Peuple la base de données avec toutes les informations du frontend (idempotent)'

    def handle(self, *args, **options):
        self.stdout.write("Initialisation de la base de données...")

        # 1. Création/mise à jour du Profil
        profile, created = Profile.objects.update_or_create(
            id=1,
            defaults=dict(
                full_name="N'famoussa Camara",
                hero_title='Développeur Full-Stack',
                hero_subtitle='Spécialisé en Cybersécurité, React & Django. Je construis des applications robustes, sécurisées et prêtes pour la production.',
                about_text="Je suis N'Famoussa Camara, développeur full-stack passionné par la conception d'applications web modernes, performantes et évolutives.\n\nActuellement étudiant en informatique à l'Université de Labé, je développe des solutions numériques orientées résolution de problèmes réels avec une forte attention portée à l'architecture logicielle, à la qualité du code et à l'expérience utilisateur.\n\nJe travaille principalement avec React, Django REST Framework et PostgreSQL pour construire des applications full-stack rapides, maintenables et scalables. Je m'intéresse particulièrement au développement backend, aux APIs REST, aux architectures propres, aux principes SOLID ainsi qu'à l'optimisation des performances web. Au-delà du développement, je m'intéresse également à la cybersécurité, aux réseaux informatiques et à la conception de plateformes capables d'avoir un impact concret dans des domaines comme l'éducation, la santé numérique, l'immobilier et les services digitaux en Guinée.",
                avatar_url='/profil-removebg-preview.png',
                cv_file='/cv.pdf',
                contact_page_title='Parlons de votre projet',
                contact_page_description="Architecture d'entreprise, audit de sécurité ou produit web innovant — n'hésitez pas à me contacter. Je réponds dans les 24h.",
                cta_headline_active='Prêt à sécuriser & scaler vos applications ?',
                cta_headline_inactive='Découvrez mon portfolio',
                cta_description_active="Basé sur les standards de l'industrie, je transforme vos idées en produits robustes.",
                cta_description_inactive='Le portfolio reste consultable en continu, avec des contenus éditables depuis le dashboard.',
                footer_copyright='© {year} — Tous droits réservés.',
                github_url='https://github.com/votre-username',
                linkedin_url='https://linkedin.com/in/votre-profil',
                facebook_url='https://facebook.com/votre-page',
                whatsapp_url='https://wa.me/22374000000',
                contact_email='contact@votre-email.com',
                location='Conakry, Guinée',
                available_for_hire=True
            )
        )
        action = "créé" if created else "mis à jour"
        self.stdout.write(self.style.SUCCESS(f"Profil {action} : {profile.full_name}"))

        # 2. Compétences (idempotent)
        skills_data = [
            {'id': 1, 'name': 'React', 'category': 'Frontend', 'mastery_percentage': 95, 'icon_name': 'react', 'order': 1},
            {'id': 2, 'name': 'TypeScript', 'category': 'Frontend', 'mastery_percentage': 90, 'icon_name': 'typescript', 'order': 2},
            {'id': 3, 'name': 'Python', 'category': 'Backend', 'mastery_percentage': 95, 'icon_name': 'python', 'order': 3},
            {'id': 4, 'name': 'Django', 'category': 'Backend', 'mastery_percentage': 92, 'icon_name': 'django', 'order': 4},
            {'id': 5, 'name': 'Docker', 'category': 'DevOps', 'mastery_percentage': 88, 'icon_name': 'docker', 'order': 5},
            {'id': 6, 'name': 'PostgreSQL', 'category': 'Backend', 'mastery_percentage': 90, 'icon_name': 'postgresql', 'order': 6},
            {'id': 7, 'name': 'Redis', 'category': 'Backend', 'mastery_percentage': 80, 'icon_name': 'redis', 'order': 7},
            {'id': 8, 'name': 'Linux', 'category': 'DevOps', 'mastery_percentage': 85, 'icon_name': 'linux', 'order': 8},
            {'id': 9, 'name': 'Git', 'category': 'Other', 'mastery_percentage': 92, 'icon_name': 'git', 'order': 9},
            {'id': 10, 'name': 'Node.js', 'category': 'Backend', 'mastery_percentage': 82, 'icon_name': 'nodedotjs', 'order': 10},
            {'id': 11, 'name': 'Tailwind', 'category': 'Frontend', 'mastery_percentage': 90, 'icon_name': 'tailwindcss', 'order': 11},
            {'id': 12, 'name': 'GraphQL', 'category': 'Backend', 'mastery_percentage': 70, 'icon_name': 'graphql', 'order': 12},
        ]
        for skill in skills_data:
            sid = skill.pop('id')
            Skill.objects.update_or_create(id=sid, defaults=skill)
        self.stdout.write(self.style.SUCCESS(f"{len(skills_data)} compétences synchronisées."))

        # 3. Parcours (idempotent)
        edu_data = [
            {'id': 1, 'title': 'Licence en Informatique', 'institution': 'Université de Labé', 'start_year': '2021', 'end_year': 'Présent', 'description': "Développement d'algorithmes complexes, architecture web et cybersécurité.", 'entry_type': 'Education', 'order': 1},
            {'id': 2, 'title': 'Baccalauréat Scientifique', 'institution': 'Lycée', 'start_year': '2021', 'end_year': '2021', 'description': 'Forte dominante en mathématiques et sciences physiques.', 'entry_type': 'Education', 'order': 2},
            {'id': 3, 'title': "Brevet d'Études du Premier Cycle", 'institution': 'Collège', 'start_year': '2018', 'end_year': '2018', 'description': 'Formation générale et bases scientifiques.', 'entry_type': 'Education', 'order': 3},
            {'id': 4, 'title': "Certificat d'Études Primaires", 'institution': 'École Primaire', 'start_year': '2014', 'end_year': '2014', 'description': "Premiers pas dans l'apprentissage formel.", 'entry_type': 'Education', 'order': 4},
        ]
        for edu in edu_data:
            eid = edu.pop('id')
            Education.objects.update_or_create(id=eid, defaults=edu)
        self.stdout.write(self.style.SUCCESS(f"{len(edu_data)} étapes de parcours synchronisées."))

        # 4. Projets (idempotent)
        projects_data = [
            {
                'id': 1,
                'fields': dict(
                    title='IdentiGuinée Secure Core',
                    description="Système d'identité nationale certifié. Architecture complexe avec gestion de documents asynchrone et vérification biométrique.",
                    image_url='https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=700',
                    category='Full-Stack',
                    link_github='https://github.com/votre-username/identiguinee',
                    link_demo='https://demo.identiguinee.com',
                    is_featured=True
                ),
                'techs': ['Django', 'React'],
            },
            {
                'id': 2,
                'fields': dict(
                    title='API Rate Limiter Pro',
                    description='Middleware haute performance pour bloquer les attaques DDoS et bruteforce sur des endpoints critiques. Basé sur Redis.',
                    image_url='https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=700',
                    category='Backend',
                    link_github='https://github.com/votre-username/api-rate-limiter',
                    is_featured=True
                ),
                'techs': ['Python', 'Redis'],
            },
            {
                'id': 3,
                'fields': dict(
                    title='Dashboard Analytics Premium',
                    description="Interface Mission Control avec rendu Glassmorphism, graphiques en temps réel et thème adaptatif dark/light.",
                    image_url='https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=700',
                    category='Frontend',
                    link_demo='https://demo.dashboard.com',
                    is_featured=False
                ),
                'techs': ['React', 'Tailwind'],
            },
        ]
        for p in projects_data:
            project, _ = Project.objects.update_or_create(id=p['id'], defaults=p['fields'])
            techs = Skill.objects.filter(name__in=p['techs'])
            project.technologies.set(techs)
        self.stdout.write(self.style.SUCCESS("3 projets synchronisés avec technologies."))

        # 5. Articles de blog (idempotent)
        blogs_data = [
            {
                'id': 1,
                'fields': dict(
                    title="Pourquoi l'architecture Clean est vitale en 2026",
                    excerpt="Découvrez comment structurer vos projets Django et React pour qu'ils durent des années sans devenir une dette technique.",
                    content="...",
                    category="Architecture",
                    read_time="5 min",
                    published_at=datetime.strptime('24-05-2026', '%d-%m-%Y'),
                    is_published=True,
                    order=1
                )
            },
            {
                'id': 2,
                'fields': dict(
                    title='Securing JWT: Les erreurs que vous faites probablement',
                    excerpt='HttpOnly, SameSite, Refresh Tokens... On fait le tour des bonnes pratiques pour sécuriser vos APIs Django REST.',
                    content="...",
                    category="Cybersécurité",
                    read_time="8 min",
                    published_at=datetime.strptime('18-05-2026', '%d-%m-%Y'),
                    is_published=True,
                    order=2
                )
            },
        ]
        for b in blogs_data:
            BlogPost.objects.update_or_create(id=b['id'], defaults=b['fields'])
        self.stdout.write(self.style.SUCCESS("2 articles de blog synchronisés."))

        self.stdout.write(self.style.SUCCESS("✅ Seed terminé — base de données synchronisée !"))

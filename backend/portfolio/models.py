from django.db import models
from core.constants import PROJECT_CATEGORIES, SKILL_CATEGORIES, EXPERIENCE_TYPES

class Profile(models.Model):
    """
    Gestion des textes globaux du site (Hero & About).
    Puisque c'est un profil unique, le frontend récupèrera le premier élément.
    """
    full_name = models.CharField(max_length=100, default="Votre Nom", verbose_name="Nom complet")
    hero_title = models.CharField(max_length=200, verbose_name="Titre d'accroche (Hero)", blank=True, default="")
    hero_subtitle = models.TextField(verbose_name="Sous-titre d'accroche", blank=True, default="")
    avatar = models.ImageField(upload_to='profile/', blank=True, null=True, verbose_name="Photo de profil (Upload)")
    avatar_url = models.CharField(max_length=500, blank=True, default="", verbose_name="URL de la photo de profil (Fallback)")
    
    about_text = models.TextField(verbose_name="Texte de section 'À propos'", blank=True, default="")
    cv_file = models.FileField(upload_to='cv/', blank=True, null=True, verbose_name="Fichier CV")
    
    # Section Contact
    contact_page_title = models.CharField(max_length=200, default="Parlons de votre projet", verbose_name="Titre page Contact")
    contact_page_description = models.TextField(default="Architecture d'entreprise, audit de sécurité ou produit web innovant — n'hésitez pas à me contacter. Je réponds dans les 24h.", verbose_name="Description page Contact")
    
    # Section CTA (Call To Action)
    cta_headline_active = models.CharField(max_length=200, default="Prêt à sécuriser & scaler vos applications ?", verbose_name="Titre CTA (disponible)")
    cta_headline_inactive = models.CharField(max_length=200, default="Découvrez mon portfolio", verbose_name="Titre CTA (indisponible)")
    cta_description_active = models.TextField(default="Basé sur les standards de l'industrie, je transforme vos idées en produits robustes.", verbose_name="Description CTA (disponible)")
    cta_description_inactive = models.TextField(default="Le portfolio reste consultable en continu, avec des contenus éditables depuis le dashboard.", verbose_name="Description CTA (indisponible)")
    
    # Footer
    footer_copyright = models.TextField(default="© {year} — Tous droits réservés.", verbose_name="Texte copyright footer")
    
    # Links
    github_url = models.CharField(max_length=500, blank=True, default="", verbose_name="Lien GitHub")
    linkedin_url = models.CharField(max_length=500, blank=True, default="", verbose_name="Lien LinkedIn")
    facebook_url = models.CharField(max_length=500, blank=True, default="", verbose_name="Lien Facebook")
    whatsapp_url = models.CharField(max_length=500, blank=True, default="", verbose_name="Lien WhatsApp")
    contact_email = models.EmailField(blank=True, verbose_name="Adresse email de contact")
    location = models.CharField(max_length=120, blank=True, verbose_name="Localisation")
    
    available_for_hire = models.BooleanField(default=True, verbose_name="Disponible pour des projets ?")
    
    # Overrides pour les statistiques (si vides, calcul automatique)
    projects_count = models.PositiveIntegerField(null=True, blank=True, verbose_name="Nombre de projets (Overide)")
    experience_years = models.PositiveIntegerField(null=True, blank=True, verbose_name="Années d'expérience (Overide)")
    technologies_count = models.PositiveIntegerField(null=True, blank=True, verbose_name="Nombre de technos (Overide)")

    class Meta:
        verbose_name = "Profil Global"
        verbose_name_plural = "Profil Global"

    def __str__(self):
        return f"Configuration du Portfolio : {self.full_name}"

class Skill(models.Model):
    """
    Compétences techniques et soft skills
    """
    name = models.CharField(max_length=100, verbose_name="Nom (ex: React)")
    category = models.CharField(max_length=50, choices=SKILL_CATEGORIES, verbose_name="Catégorie")
    mastery_percentage = models.PositiveIntegerField(default=80, verbose_name="Maîtrise (%)")
    icon_name = models.CharField(max_length=50, blank=True, help_text="Nom d'icône pour le frontend (ex: 'react')")
    
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre d'affichage")

    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Compétence"
        verbose_name_plural = "Compétences"

    def __str__(self):
        return f"{self.name} ({self.category})"

class Education(models.Model):
    """
    Parcours scolaire et professionnel
    """
    title = models.CharField(max_length=200, verbose_name="Titre (Rôle ou Diplôme)")
    institution = models.CharField(max_length=200, verbose_name="Établissement / Entreprise")
    start_year = models.CharField(max_length=4, verbose_name="Année de début")
    end_year = models.CharField(max_length=10, blank=True, verbose_name="Année de fin (ou 'Présent')")
    description = models.TextField(verbose_name="Description des tâches/apprentissages", blank=True)
    
    entry_type = models.CharField(max_length=20, choices=EXPERIENCE_TYPES, default='Education', verbose_name="Type")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre d'affichage (0 = plus haut)")

    class Meta:
        ordering = ['order', '-start_year']
        verbose_name = "Étape de parcours"
        verbose_name_plural = "Parcours (CV)"

    def __str__(self):
        return f"{self.title} @ {self.institution}"

class Project(models.Model):
    title = models.CharField(max_length=100, verbose_name="Titre")
    description = models.TextField(verbose_name="Description courte")
    detailed_description = models.TextField(blank=True, verbose_name="Architecture et défis")
    
    image = models.ImageField(upload_to='projects/', blank=True, null=True, verbose_name="Image du projet")
    image_url = models.CharField(max_length=500, blank=True, default='', verbose_name="URL image externe (fallback)")
    
    link_github = models.URLField(blank=True, null=True, verbose_name="Lien GitHub")
    link_demo = models.URLField(blank=True, null=True, verbose_name="Lien de la Démo")
    
    category = models.CharField(max_length=50, choices=PROJECT_CATEGORIES, default='Full-Stack', verbose_name="Catégorie")
    technologies = models.ManyToManyField(Skill, related_name='projects', verbose_name="Technologies utilisées")
    
    is_featured = models.BooleanField(default=False, verbose_name="Mettre en avant")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Projet"
        verbose_name_plural = "Projets"
        ordering = ['-created_at']

    def __str__(self):
        return self.title

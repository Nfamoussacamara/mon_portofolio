from django.db import models

class Technology(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name="Nom de la technologie")

    class Meta:
        verbose_name = "Technologie"
        verbose_name_plural = "Technologies"
        ordering = ['name']

    def __str__(self):
        return self.name


class Project(models.Model):
    CATEGORY_CHOICES = [
        ('Frontend', 'Frontend'),
        ('Backend', 'Backend'),
        ('Full-Stack', 'Full-Stack'),
        ('Cybersécurité', 'Cybersécurité'),
        ('Mobile', 'Mobile'),
    ]

    title = models.CharField(max_length=100, verbose_name="Titre")
    description = models.TextField(verbose_name="Description courte")
    detailed_description = models.TextField(blank=True, verbose_name="Architecture et défis")
    
    image_url = models.URLField(max_length=500, blank=True, verbose_name="URL de l'image (Ex: Cloudinary)")
    
    link_github = models.URLField(blank=True, null=True, verbose_name="Lien GitHub")
    link_demo = models.URLField(blank=True, null=True, verbose_name="Lien de la Démo")
    
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Full-Stack', verbose_name="Catégorie")
    technologies = models.ManyToManyField(Technology, related_name='projects', verbose_name="Technologies utilisées")
    
    is_featured = models.BooleanField(default=False, verbose_name="Mettre en avant")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Projet"
        verbose_name_plural = "Projets"
        ordering = ['-created_at']

    def __str__(self):
        return self.title

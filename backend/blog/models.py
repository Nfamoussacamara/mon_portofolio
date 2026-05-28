from django.db import models


class BlogPost(models.Model):
	title = models.CharField(max_length=200, verbose_name="Titre")
	excerpt = models.CharField(max_length=300, verbose_name="Résumé court")
	content = models.TextField(blank=True, verbose_name="Contenu")
	category = models.CharField(max_length=100, verbose_name="Catégorie")
	read_time = models.CharField(max_length=20, default="5 min", verbose_name="Temps de lecture")
	featured_image_url = models.URLField(blank=True, verbose_name="URL de l'image")
	is_published = models.BooleanField(default=True, verbose_name="Publié")
	order = models.PositiveIntegerField(default=0, verbose_name="Ordre d'affichage")
	published_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de publication")

	class Meta:
		verbose_name = "Article"
		verbose_name_plural = "Articles"
		ordering = ['order', '-published_at']

	def __str__(self):
		return self.title

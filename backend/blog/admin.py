from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import BlogPost


@admin.register(BlogPost)
class BlogPostAdmin(ModelAdmin):
	list_display = ('title', 'category', 'is_published', 'order', 'published_at')
	list_filter = ('category', 'is_published')
	search_fields = ('title', 'excerpt', 'content', 'category')
	list_editable = ('is_published', 'order')

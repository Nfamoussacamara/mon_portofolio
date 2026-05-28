from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Profile, Skill, Education, Project


@admin.register(Profile)
class ProfileAdmin(ModelAdmin):
    list_display = ('full_name', 'available_for_hire')


@admin.register(Skill)
class SkillAdmin(ModelAdmin):
    list_display = ('name', 'category', 'mastery_percentage', 'order')
    list_editable = ('order', 'mastery_percentage')
    list_filter = ('category',)


@admin.register(Education)
class EducationAdmin(ModelAdmin):
    list_display = ('title', 'institution', 'entry_type', 'start_year', 'end_year', 'order')
    list_editable = ('order',)
    list_filter = ('entry_type',)


@admin.register(Project)
class ProjectAdmin(ModelAdmin):
    list_display = ('title', 'category', 'is_featured', 'created_at')
    list_filter = ('category', 'is_featured')
    search_fields = ('title', 'description', 'detailed_description')
    filter_horizontal = ('technologies',)
    list_editable = ('is_featured',)


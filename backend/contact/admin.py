from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(ModelAdmin):
    list_display = ('name', 'email', 'subject', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('name', 'email', 'subject', 'message', 'ip_address', 'created_at')
    list_editable = ('is_read',)
    
    def has_add_permission(self, request):
        # On interdit la création manuelle de messages depuis l'admin
        return False

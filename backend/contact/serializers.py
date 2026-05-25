from rest_framework import serializers
from .models import ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        # We don't expose 'is_read', 'ip_address' or 'created_at' to the user input
        fields = ['id', 'name', 'email', 'subject', 'message']
        
    def validate_message(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("Le message doit contenir au moins 10 caractères.")
        return value

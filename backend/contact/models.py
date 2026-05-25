from django.db import models

class ContactMessage(models.Model):
    name = models.CharField(max_length=150, verbose_name="Nom complet")
    email = models.EmailField(verbose_name="Adresse email")
    subject = models.CharField(max_length=200, blank=True, verbose_name="Sujet")
    message = models.TextField(verbose_name="Message")
    
    # Sécurité et Tracking interne
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name="Adresse IP")
    is_read = models.BooleanField(default=False, verbose_name="Lu")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de réception")

    class Meta:
        verbose_name = "Message de Contact"
        verbose_name_plural = "Messages de Contact"
        ordering = ['-created_at']

    def __str__(self):
        return f"Message de {self.name} - {self.email}"

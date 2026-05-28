import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Crée un superutilisateur automatiquement à partir des variables d environnement'

    def handle(self, *args, **options):
        User = get_user_model()
        username = os.environ.get('ADMIN_USERNAME', 'admin')
        email = os.environ.get('ADMIN_EMAIL', 'admin@example.com')
        password = os.environ.get('ADMIN_PASSWORD')

        if not password:
            self.stdout.write(self.style.WARNING('ADMIN_PASSWORD non défini. Abandon de la création du superuser.'))
            return

        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'Superutilisateur "{username}" créé avec succès.'))
        else:
            self.stdout.write(self.style.WARNING(f'Le superutilisateur "{username}" existe déjà.'))

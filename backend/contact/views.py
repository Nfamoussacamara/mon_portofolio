from rest_framework import viewsets, mixins
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.exceptions import Throttled
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from django_ratelimit.exceptions import Ratelimited
from .models import ContactMessage
from .serializers import ContactMessageSerializer

def get_client_ip(request):
    """Récupère l'IP du client depuis les headers ou le remote_addr."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0]
    return request.META.get('REMOTE_ADDR')

class ContactMessageViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    Endpoint POST /api/contact/ permettant de soumettre un message.
    Limité à 5 requêtes par IP par heure pour éviter le SPAM.
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]

    @method_decorator(ratelimit(key='ip', rate='5/h', method='POST', block=True))
    def create(self, request, *args, **kwargs):
        # On capture les erreurs de ratelimit si block=True throw une exception Ratelimited
        try:
            return super().create(request, *args, **kwargs)
        except Ratelimited:
            raise Throttled(detail="Trop de requêtes. Veuillez réessayer plus tard.")
            
    def perform_create(self, serializer):
        # A la sauvegarde, on conserve l'adresse IP associée au message
        ip = get_client_ip(self.request)
        serializer.save(ip_address=ip)

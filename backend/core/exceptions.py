from rest_framework.views import exception_handler
from django_ratelimit.exceptions import Ratelimited

def custom_exception_handler(exc, context):
    """
    Gestionnaire d'exceptions DRF personnalisé pour uniformiser les réponses d'erreurs en JSON.
    Capture également les erreurs Ratelimited de django-ratelimit.
    """
    
    # Check if the exception is Ratelimited from django-ratelimit
    if isinstance(exc, Ratelimited):
        return exception_handler(Exception("Trop de requêtes. Veuillez réessayer plus tard."), context)
        
    response = exception_handler(exc, context)

    if response is not None:
        custom_response_data = {
            'error': True,
            'status_code': response.status_code,
            'message': 'Une erreur est survenue.',
            'details': response.data
        }

        # Override message context if throttled or permission denied
        if response.status_code == 403:
            custom_response_data['message'] = "Accès refusé."
        elif response.status_code == 429:
            custom_response_data['message'] = "Limite de requêtes atteinte."
        elif response.status_code == 404:
            custom_response_data['message'] = "Ressource introuvable."
        elif response.status_code == 400:
            custom_response_data['message'] = "Données invalides."

        response.data = custom_response_data

    return response

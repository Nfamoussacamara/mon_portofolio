from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Project
from .serializers import ProjectSerializer, ProjectDetailSerializer

class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Endpoint de lecture seule pour afficher les projets publiquement sur le frontend.
    """
    queryset = Project.objects.all().prefetch_related('technologies')
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        # Utilise un serializer avec plus de détails s'il s'agit d'une vue de détail (ex: /api/projects/1/)
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectSerializer
        
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtre optionnel par catégorie (?category=Backend)
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
            
        return queryset

from rest_framework import viewsets, permissions
from .models import Profile, Skill, Education, Project
from .serializers import (
    ProfileSerializer, SkillSerializer, EducationSerializer, 
    ProjectSerializer, ProjectDetailSerializer
)


class IsAdminOrReadOnly(permissions.BasePermission):
    """Lecture libre, écriture réservée aux admins authentifiés."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAdminOrReadOnly]


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAdminOrReadOnly]


class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [IsAdminOrReadOnly]


class ProjectViewSet(viewsets.ModelViewSet):
    """
    Endpoint (CRUD) pour la gestion des projets.
    """
    queryset = Project.objects.all().prefetch_related('technologies').order_by('-id')
    permission_classes = [IsAdminOrReadOnly]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectSerializer
        
    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset


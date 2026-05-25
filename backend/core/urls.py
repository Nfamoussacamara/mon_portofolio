from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from projects.views import ProjectViewSet
from contact.views import ContactMessageViewSet

# Setup the REST Framework Router
router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'contact', ContactMessageViewSet, basename='contact')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]

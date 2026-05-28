from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from contact.views import ContactMessageViewSet
from portfolio.views import ProfileViewSet, SkillViewSet, EducationViewSet, ProjectViewSet
from blog.views import BlogPostViewSet

# Setup the REST Framework Router
router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'contact', ContactMessageViewSet, basename='contact')
router.register(r'profile', ProfileViewSet, basename='profile')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'education', EducationViewSet, basename='education')
router.register(r'blog', BlogPostViewSet, basename='blog')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # Authentification JWT pour le Dashboard React
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

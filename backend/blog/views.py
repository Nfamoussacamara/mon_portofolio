from rest_framework import viewsets
from portfolio.views import IsAdminOrReadOnly
from .models import BlogPost
from .serializers import BlogPostSerializer


class BlogPostViewSet(viewsets.ModelViewSet):
	queryset = BlogPost.objects.all()
	serializer_class = BlogPostSerializer
	permission_classes = [IsAdminOrReadOnly]

	def get_queryset(self):
		queryset = super().get_queryset()
		published = self.request.query_params.get('published')
		if published == 'true':
			queryset = queryset.filter(is_published=True)
		return queryset

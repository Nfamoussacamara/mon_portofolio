from rest_framework import serializers
from .models import Project, Technology

class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ['id', 'name']


class ProjectSerializer(serializers.ModelSerializer):
    # Representation of technologies via their names to easily map frontend
    stack = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 
            'image_url', 'link_github', 'link_demo', 
            'category', 'stack', 'is_featured'
        ]
        
    def get_stack(self, obj):
        # Flatten the many-to-many relationship into a list of strings
        return [tech.name for tech in obj.technologies.all()]


class ProjectDetailSerializer(ProjectSerializer):
    class Meta(ProjectSerializer.Meta):
        fields = ProjectSerializer.Meta.fields + ['detailed_description', 'created_at']

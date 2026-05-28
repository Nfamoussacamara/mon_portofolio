from rest_framework import serializers
from .models import Profile, Skill, Education, Project

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')

        # Résolution de l'URL de l'avatar (Upload > URL Fallback)
        if instance.avatar and instance.avatar.name:
            data['avatar_url'] = (
                request.build_absolute_uri(instance.avatar.url)
                if request else instance.avatar.url
            )
        
        # Résolution de l'URL du CV (Cloudinary si configuré, local sinon)
        if instance.cv_file and instance.cv_file.name:
            cv_url = instance.cv_file.url
            # Si l'URL est relative (stockage local), on la préfixe avec le domaine
            if cv_url.startswith('/') and request:
                cv_url = request.build_absolute_uri(cv_url)
            data['cv_file'] = cv_url
        
        # Projets
        if instance.projects_count is None:
            data['projects_count'] = Project.objects.count()
            
        # Technologies
        if instance.technologies_count is None:
            data['technologies_count'] = Skill.objects.filter(
                category__in=['Frontend', 'Backend', 'DevOps']
            ).count()
            
        # Expérience
        if instance.experience_years is None:
            first_exp = Education.objects.filter(entry_type='Experience').order_by('start_year').first()
            if first_exp:
                try:
                    start = int(first_exp.start_year)
                    from datetime import datetime
                    data['experience_years'] = datetime.now().year - start
                except:
                    data['experience_years'] = 3
            else:
                data['experience_years'] = 3
                
        return data

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    stack = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description',
            'image', 'image_url',
            'link_github', 'link_demo',
            'category', 'stack', 'technologies', 'is_featured'
        ]
        extra_kwargs = {
            'technologies': {'required': False},
            'image': {'required': False},
            'image_url': {'required': False},
        }

    def get_stack(self, obj):
        return [tech.name for tech in obj.technologies.all()]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        # Priorité : image uploadée > image_url externe
        if instance.image and instance.image.name:
            data['image_url'] = (
                request.build_absolute_uri(instance.image.url)
                if request else instance.image.url
            )
        elif not data.get('image_url'):
            data['image_url'] = ''
        return data


class ProjectDetailSerializer(ProjectSerializer):
    class Meta(ProjectSerializer.Meta):
        fields = ProjectSerializer.Meta.fields + ['detailed_description', 'created_at']

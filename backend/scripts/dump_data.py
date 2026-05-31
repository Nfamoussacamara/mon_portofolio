import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from portfolio.models import Profile, Skill, Education, Project
from blog.models import BlogPost
from portfolio.serializers import ProfileSerializer, SkillSerializer, EducationSerializer, ProjectSerializer
from blog.serializers import BlogPostSerializer

def get_data():
    profile = Profile.objects.first()
    skills = Skill.objects.all().order_by('order', 'id')
    education = Education.objects.all().order_by('order', 'id')
    projects = Project.objects.all().order_by('-id')
    blog = BlogPost.objects.all().order_by('-published_at')

    return {
        "profile": ProfileSerializer(profile).data if profile else None,
        "skills": SkillSerializer(skills, many=True).data,
        "education": EducationSerializer(education, many=True).data,
        "projects": ProjectSerializer(projects, many=True).data,
        "blog": BlogPostSerializer(blog, many=True).data,
    }

if __name__ == "__main__":
    print(json.dumps(get_data()))

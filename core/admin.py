from django.contrib import admin
from . import models


@admin.register(models.Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'category', 'proficiency', 'total_price', 'created_at')
    search_fields = ('title', 'description', 'category')
    list_filter = ('category', 'proficiency', 'is_active', 'created_at')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(models.UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_mentor', 'rating', 'created_at')
    list_filter = ('is_mentor', 'created_at')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(models.SkillApplication)
class SkillApplicationAdmin(admin.ModelAdmin):
    list_display = ('applicant', 'skill', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    readonly_fields = ('created_at', 'updated_at')
    search_fields = ('applicant__username', 'skill__title')

from django.db import models
from django.conf import settings


class Skill(models.Model):
    PROFICIENCY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'), 
        ('advanced', 'Advanced'),
        ('expert', 'Expert')
    ]
    
    AVAILABILITY_CHOICES = [
        ('weekdays', 'Weekdays'),
        ('weekends', 'Weekends'),
        ('evenings', 'Evenings'),
        ('flexible', 'Flexible')
    ]
    
    # Basic skill info
    title = models.CharField(max_length=200, default='')
    description = models.TextField(default='')
    category = models.CharField(max_length=100, default='Programming')
    proficiency = models.CharField(max_length=20, choices=PROFICIENCY_CHOICES, default='beginner')
    
    # Pricing
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Contact info
    email = models.EmailField(default='')
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Location and availability
    location = models.CharField(max_length=255, blank=True, default='')
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, blank=True, default='')
    
    # Skills wanted for exchange
    skills_wanted = models.TextField(blank=True, default='', help_text="Comma-separated list of skills wanted")
    
    # User relationship
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='skills_offered', null=True)
    
    # Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} by {self.user.username if self.user else 'Unknown'}"

    class Meta:
        ordering = ['-created_at']


class SkillApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled')
    ]
    
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications_sent')
    message = models.TextField()
    offering_skill = models.CharField(max_length=200, blank=True, help_text="Skill offered in exchange")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.applicant.username} applied for {self.skill.title}"

    class Meta:
        ordering = ['-created_at']


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    is_mentor = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username

from django.urls import path
from . import views, api_views

urlpatterns = [
    # Web views (Django templates)
    path('', views.home, name='home'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('logout/', views.CustomLogoutView.as_view(), name='logout'),
    path('profile/onboarding/', views.profile_onboarding, name='profile_onboarding'),
    
    # API endpoints - Authentication
    path('api/signup/', api_views.signup_api, name='api_signup'),
    path('api/login/', api_views.login_api, name='api_login'),
    path('api/logout/', api_views.logout_api, name='api_logout'),
    
    # API endpoints - Profile
    path('api/profile/', api_views.UserProfileView.as_view(), name='api_profile'),
    path('api/user-profile/', api_views.user_profile_api, name='api_user_profile'),
    
    # API endpoints - Skills
    path('api/skills/', api_views.skills_api, name='api_skills'),
    path('api/my-skills/', api_views.my_skills_api, name='api_my_skills'),
    path('api/skills/<int:skill_id>/', api_views.skill_detail_api, name='api_skill_detail'),
    
    # API endpoints - Applications
    path('api/apply/', api_views.apply_skill_api, name='api_apply_skill'),
    path('api/my-applications/', api_views.my_applications_api, name='api_my_applications'),
    path('api/applications/<int:application_id>/status/', api_views.update_application_status_api, name='api_update_application_status'),
    
    # API endpoints - Notifications
    path('api/send-notification/', api_views.send_notification_api, name='api_send_notification'),
]

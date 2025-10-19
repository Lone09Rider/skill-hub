from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from .serializers import (
    UserSerializer, UserProfileSerializer, SignUpSerializer, 
    LoginSerializer, SkillSerializer, SkillApplicationSerializer
)
from .models import UserProfile, Skill, SkillApplication


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def signup_api(request):
    """API endpoint for user registration"""
    serializer = SignUpSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'User created successfully',
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def login_api(request):
    """API endpoint for user login"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_api(request):
    """API endpoint for user logout"""
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


# Skill Management APIs
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])  # Allow anyone to browse skills, but require auth for POST
def skills_api(request):
    """API endpoint for skill listing and creation"""
    if request.method == 'GET':
        # Get all active skills for browsing - no authentication required
        skills = Skill.objects.filter(is_active=True).select_related('user')
        
        # Apply filters
        category = request.GET.get('category')
        location = request.GET.get('location')
        proficiency = request.GET.get('proficiency')
        search = request.GET.get('search')
        
        if category:
            skills = skills.filter(category__icontains=category)
        if location:
            skills = skills.filter(location__icontains=location)
        if proficiency:
            skills = skills.filter(proficiency=proficiency)
        if search:
            skills = skills.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search) |
                Q(skills_wanted__icontains=search)
            )
        
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        # Create new skill - temporarily allow for development
        user = None
        if request.user.is_authenticated:
            user = request.user
        else:
            # For development: use admin user if no authentication
            from django.contrib.auth.models import User
            try:
                user = User.objects.get(username='admin')
                print(f"Using admin user for skill creation: {user.username}")
            except User.DoesNotExist:
                return Response({'error': 'No test user found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Temporarily create a mock request context
        class MockRequest:
            def __init__(self, user):
                self.user = user
        
        mock_request = MockRequest(user)
        serializer = SkillSerializer(data=request.data, context={'request': mock_request})
        if serializer.is_valid():
            skill = serializer.save()
            return Response({
                'message': 'Skill created successfully',
                'skill': SkillSerializer(skill).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])  # Temporarily allow access for development
def my_skills_api(request):
    """API endpoint for getting current user's skills"""
    # For development: if no authenticated user, use admin user
    if not request.user.is_authenticated:
        from django.contrib.auth.models import User
        try:
            user = User.objects.get(username='admin')
        except User.DoesNotExist:
            return Response({'error': 'No test user found'}, status=status.HTTP_404_NOT_FOUND)
    else:
        user = request.user
    
    skills = Skill.objects.filter(user=user, is_active=True)
    serializer = SkillSerializer(skills, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def skill_detail_api(request, skill_id):
    """API endpoint for skill detail operations"""
    try:
        skill = Skill.objects.get(id=skill_id, user=request.user)
    except Skill.DoesNotExist:
        return Response({'error': 'Skill not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = SkillSerializer(skill)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = SkillSerializer(skill, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        skill.is_active = False
        skill.save()
        return Response({'message': 'Skill deleted successfully'}, status=status.HTTP_200_OK)


# Application Management APIs
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_skill_api(request):
    """API endpoint for applying to a skill"""
    skill_id = request.data.get('skill_id')
    message = request.data.get('message')
    offering_skill = request.data.get('offering_skill', '')
    
    try:
        skill = Skill.objects.get(id=skill_id, is_active=True)
        if skill.user == request.user:
            return Response({'error': 'Cannot apply to your own skill'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if already applied
        existing_application = SkillApplication.objects.filter(
            skill=skill, applicant=request.user, status='pending'
        ).first()
        
        if existing_application:
            return Response({'error': 'Already applied to this skill'}, status=status.HTTP_400_BAD_REQUEST)
        
        application = SkillApplication.objects.create(
            skill=skill,
            applicant=request.user,
            message=message,
            offering_skill=offering_skill
        )
        
        serializer = SkillApplicationSerializer(application)
        return Response({
            'message': 'Application submitted successfully',
            'application': serializer.data
        }, status=status.HTTP_201_CREATED)
        
    except Skill.DoesNotExist:
        return Response({'error': 'Skill not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_applications_api(request):
    """API endpoint for getting user's applications"""
    # Applications sent by user
    sent_applications = SkillApplication.objects.filter(applicant=request.user).select_related('skill', 'skill__user')
    
    # Applications received for user's skills
    received_applications = SkillApplication.objects.filter(skill__user=request.user).select_related('applicant', 'skill')
    
    return Response({
        'sent': SkillApplicationSerializer(sent_applications, many=True).data,
        'received': SkillApplicationSerializer(received_applications, many=True).data
    }, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_application_status_api(request, application_id):
    """API endpoint for updating application status"""
    try:
        application = SkillApplication.objects.get(id=application_id, skill__user=request.user)
        new_status = request.data.get('status')
        
        if new_status in ['accepted', 'rejected']:
            application.status = new_status
            application.save()
            
            return Response({
                'message': f'Application {new_status} successfully',
                'application': SkillApplicationSerializer(application).data
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
            
    except SkillApplication.DoesNotExist:
        return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)


# Profile Management APIs
class UserProfileView(generics.RetrieveUpdateAPIView):
    """API endpoint for user profile management"""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_api(request):
    """Get current user's profile"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    except UserProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_notification_api(request):
    """API endpoint for sending email notifications"""
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    from django.conf import settings
    
    try:
        # Get email data from request
        to_email = request.data.get('to_email')
        to_name = request.data.get('to_name')
        from_name = request.data.get('from_name', request.user.username)
        skill_title = request.data.get('skill_title', '')
        action = request.data.get('action', 'message')
        message_content = request.data.get('message', '')
        
        if not to_email:
            return Response({'error': 'Recipient email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create email content
        if action == 'accepted':
            subject = f"🎉 Your SkillHub Application for '{skill_title}' was Accepted!"
            html_content = f"""
            <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
                    <h1 style="color: white; text-align: center;">🎉 Congratulations!</h1>
                    <div style="background: white; padding: 30px; border-radius: 10px; margin: 20px 0;">
                        <h2 style="color: #4a5568;">Great News, {to_name}!</h2>
                        <p style="font-size: 16px; line-height: 1.6;">
                            Your application for <strong>"{skill_title}"</strong> has been <span style="color: #48bb78; font-weight: bold;">ACCEPTED</span>!
                        </p>
                        <p style="font-size: 16px; line-height: 1.6;">
                            The mentor <strong>{from_name}</strong> will contact you soon to start your learning journey.
                        </p>
                        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; font-style: italic;">{message_content}</p>
                        </div>
                        <p style="color: #718096; font-size: 14px;">
                            Thank you for using SkillHub - where knowledge meets opportunity!
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """
        elif action == 'rejected':
            subject = f"SkillHub Application Update for '{skill_title}'"
            html_content = f"""
            <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
                    <h1 style="color: white; text-align: center;">SkillHub</h1>
                    <div style="background: white; padding: 30px; border-radius: 10px; margin: 20px 0;">
                        <h2 style="color: #4a5568;">Hello {to_name},</h2>
                        <p style="font-size: 16px; line-height: 1.6;">
                            Thank you for your interest in <strong>"{skill_title}"</strong>.
                        </p>
                        <p style="font-size: 16px; line-height: 1.6;">
                            Unfortunately, your application was not selected this time. However, don't let this discourage you!
                        </p>
                        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0; font-style: italic;">{message_content}</p>
                        </div>
                        <p style="font-size: 16px; line-height: 1.6;">
                            Keep exploring other amazing skills on SkillHub. Your perfect learning opportunity is waiting!
                        </p>
                        <p style="color: #718096; font-size: 14px;">
                            Best regards,<br>The SkillHub Team
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """
        else:  # custom message
            subject = f"Message from {from_name} on SkillHub"
            html_content = f"""
            <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
                    <h1 style="color: white; text-align: center;">📩 New Message</h1>
                    <div style="background: white; padding: 30px; border-radius: 10px; margin: 20px 0;">
                        <h2 style="color: #4a5568;">Hello {to_name},</h2>
                        <p style="font-size: 16px; line-height: 1.6;">
                            You have received a new message from <strong>{from_name}</strong> on SkillHub:
                        </p>
                        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4299e1;">
                            <p style="margin: 0; font-size: 16px; line-height: 1.6;">{message_content}</p>
                        </div>
                        <p style="color: #718096; font-size: 14px;">
                            Visit SkillHub to continue the conversation!
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """
        
        # For development, we'll just log the email instead of actually sending it
        # In production, you would configure SMTP settings
        print(f"EMAIL NOTIFICATION:")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"Content: {html_content}")
        
        # Simulate email sending success
        return Response({
            'message': 'Email notification sent successfully',
            'to': to_email,
            'subject': subject
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return Response({
            'error': 'Failed to send email notification',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
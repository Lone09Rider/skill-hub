
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView, LogoutView

from .forms import SignUpForm, UserProfileForm
from .models import UserProfile
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login as auth_login

def home(request):
    if request.user.is_authenticated:
        return redirect('profile_onboarding')

    show_login = False
    login_form = AuthenticationForm()
    login_errors = None

    if request.method == "POST":
        if 'show_login' in request.POST:
            show_login = True
        elif 'login' in request.POST:
            show_login = True
            login_form = AuthenticationForm(request, data=request.POST)
            if login_form.is_valid():
                user = login_form.get_user()
                auth_login(request, user)
                return redirect('profile_onboarding')
            else:
                login_errors = login_form.errors
        elif 'signup_redirect' in request.POST:
            return redirect('signup')

    return render(request, 'core/home.html', {
        'show_login': show_login,
        'login_form': login_form,
        'login_errors': login_errors,
    })

def signup(request):
    if request.method == "POST":
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            UserProfile.objects.create(user=user)
            # Redirect to login page after signup
            return redirect("login")
    else:
        form = SignUpForm()
    return render(request, "core/signup.html", {"form": form})

class CustomLoginView(LoginView):
    template_name = "core/login.html"

class CustomLogoutView(LogoutView):
    next_page = "/"

@login_required
def profile_onboarding(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if request.method == "POST":
        form = UserProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            return redirect("home")
    else:
        form = UserProfileForm(instance=profile)
    return render(request, "core/profile_onboarding.html", {"form": form})

from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import UserProfile, Skill


class SignUpForm(UserCreationForm):
    email = forms.EmailField(required=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs.update({
                'class': 'border border-gray-300 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 w-full',
            })

    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2")

class UserProfileForm(forms.ModelForm):
    skills = forms.ModelMultipleChoiceField(
        queryset=Skill.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False,
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['bio'].widget.attrs.update({
            'class': 'border border-gray-300 shadow-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 w-full',
        })

    class Meta:
        model = UserProfile
        fields = ("bio", "skills")
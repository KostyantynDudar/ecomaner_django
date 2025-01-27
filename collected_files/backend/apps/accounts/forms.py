# forms.py
from django import forms

class RegisterForm(forms.Form):
    email = forms.EmailField(label="Email", required=True)
    password = forms.CharField(label="Password", widget=forms.PasswordInput, required=True)

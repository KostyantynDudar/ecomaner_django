#  ecomaner_django-master/backend/apps/accounts/views.py


from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from .forms import RegisterForm

User = get_user_model()

def register_user(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = User.objects.create_user(email=email, password=password)
            user.is_active = False  # Делаем пользователя неактивным до подтверждения email
            user.save()

            # Генерация токена для подтверждения email
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            confirm_url = request.build_absolute_uri(reverse('accounts:confirm_email', args=[uid, token]))

            # Отправка подтверждающего письма
            send_mail(
                'Подтверждение регистрации',
                f'Для завершения регистрации перейдите по ссылке: {confirm_url}',
                'no-reply@ecomaner.com',
                [email],
                fail_silently=False,
            )
            return redirect('accounts:registration_success')
    else:
        form = RegisterForm()

    return render(request, 'accounts/register.html', {'form': form})

from django.utils.http import urlsafe_base64_decode
from django.http import HttpResponse

def confirm_email(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return HttpResponse('Email подтвержден, теперь вы можете войти.')
    else:
        return HttpResponse('Ссылка подтверждения недействительна или устарела.')

# Новая функция для успешной регистрации
def registration_success(request):
    return HttpResponse("Регистрация прошла успешно. Проверьте вашу электронную почту для подтверждения.")
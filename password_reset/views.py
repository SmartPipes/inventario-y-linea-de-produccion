# password_reset/views.py
from django.shortcuts import render

def reset_password_confirm(request, uid, token):
    return render(request, 'password_reset/reset_password_confirm.html', {'uid': uid, 'token': token})

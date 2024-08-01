# activation/views.py
from django.shortcuts import render

def activation_page(request, uid, token):
    return render(request, 'activation/activation_page.html', {'uid': uid, 'token': token})


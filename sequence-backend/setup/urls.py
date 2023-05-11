"""
URL configuration for setup project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from server import views
from backend.socket import PlayersDataConsumer

websocket_urlpatterns = [
    path("ws/", PlayersDataConsumer.as_asgi()),
]

urlpatterns = [
    path('',views.index,name='index'),
    path("admin/", admin.site.urls),
    path('create/', views.create_game, name="create_game"),
    path("add/", views.add_player, name="add_players"),
    path("play/", views.play_game, name="play_game"),
    path("refresh/", views.refresh_players, name="refresh_plyers"),
    path('register/', views.create_user, name='create_user'),
    path('login/', views.login_user, name='login'),
    path('ws/', include(websocket_urlpatterns)),
]
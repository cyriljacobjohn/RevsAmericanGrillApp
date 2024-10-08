from django.urls import path
from django.urls import re_path
from .views import CreateAccount,AllUsers,CurrentUser
from accounts import views

app_name = 'users'

urlpatterns = [
   path('create/', CreateAccount.as_view(), name="create_user"),
   path('all/', AllUsers.as_view(), name="all"),
   path('currentUser/', CurrentUser.as_view(), name="current"),
   ]
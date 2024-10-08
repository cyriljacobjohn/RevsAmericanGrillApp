from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework import status,generics
from rest_framework.response import Response  
from .serializers import RegistrationSerializer, UsersSerializer
from rest_framework import permissions
from .models import Account
from decouple import config
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

GOOGLE_OAUTH2_KEY = "ND3FPGhukjq8ayy9ZS2C6Fg4qQM6E4MJNWnopvvH" #config("DRF_CLIENT_ID")
GOOGLE_OAUTH2_SECRET = "VWCCd2uiOAAE6patwl43RBoDvWAkLJ8F3ojoqLlwpHPwuXyhr9xJH3rONst84oxuX9CdEClq6Aw55RMLdpWzk3RJYtVdZt8LbSbJRsnRCheuh8xiJI8H3oeLrbpm4FA9" #config("DRF_CLIENT_SECRET")

import requests # add this

class CreateAccount(APIView):
   permission_classes=[permissions.AllowAny]
   def post(self,request):
       reg_serializer=RegistrationSerializer(data=request.data)
       if reg_serializer.is_valid():
           new_user=reg_serializer.save()
           if new_user:
              #add these
               r=requests.post('http://127.0.0.1:8000/auth/token', data = {
                   'username':new_user.email,
                   'password':request.data['password'],
                   'client_id':GOOGLE_OAUTH2_KEY,
                   'client_secret':GOOGLE_OAUTH2_SECRET,
                   'grant_type':'password'
               })
               return Response(r.json(),status=status.HTTP_201_CREATED)
       return Response(reg_serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class AllUsers(generics.ListAPIView):
   permission_classes=[permissions.AllowAny]
   queryset=Account.objects.all()
   serializer_class=UsersSerializer

class CurrentUser(APIView):
   permission_classes = (permissions.IsAuthenticated,)
   def get(self, request):
       serializer = UsersSerializer(self.request.user)
       return Response(serializer.data)
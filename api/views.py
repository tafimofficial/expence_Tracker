from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import models
from django.contrib.auth.models import User
from .models import Category, Expense
from .serializers import CategorySerializer, ExpenseSerializer
from datetime import datetime

class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, password=password)
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(models.Q(user=self.request.user) | models.Q(user__isnull=True))

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        queryset = Expense.objects.filter(user=self.request.user).order_by('-date')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        category_id = self.request.query_params.get('category')
        transaction_type = self.request.query_params.get('type')

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if transaction_type:
            queryset = queryset.filter(type=transaction_type)
        
        search_query = self.request.query_params.get('search')
        if search_query:
            queryset = queryset.filter(title__icontains=search_query)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

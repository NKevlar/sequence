from rest_framework import serializers
from django.contrib.auth.models import User
import re
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import logging

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def is_valid_password(self, password: str) -> bool:
        # Password should have at least one uppercase letter
        if not re.search(r"[A-Z]", password):
            raise ValidationError("Password should have at least one uppercase letter")

        # Password should have at least one lowercase letter
        if not re.search(r"[a-z]", password):
            raise ValidationError("Password should have at least one lowercase letter")

        # Password should have at least one digit
        if not re.search(r"\d", password):
            raise ValidationError("Password should have at least one digit")

        # Password should have at least one special character
        if not re.search(r"\W", password):
            raise ValidationError("Password should have at least one special character")

        # Password should have atleast 8 characters
        if len(password) < 8:
            raise ValidationError("Password must be at least 8 characters long")

        # Password should not exceed the maximum length
        if len(password) > 20:
            raise serializers.ValidationError("Password length exceeded")

        return True

    def validate_username(self, value):
        # Username should not exceed the maximum length
        if len(value) > 20:
            raise serializers.ValidationError("Username length exceeded")
        return value

    def validate_email(self, value):
        # Email should not exceed the maximum length
        if len(value) > 100:
            raise serializers.ValidationError("Email length exceeded")
        return value

    def validate_password(self, password):
        try:
            if self.is_valid_password(password):
                validate_password(password)
                return password
        except ValidationError as e:
            raise e

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
        )
        logging.info('ACCOUNT CREATED FOR ' + user.username)
        return user
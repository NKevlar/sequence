from rest_framework import serializers
from django.contrib.auth.models import User
import re
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def is_valid_password(self, password: str) -> bool:
        print("inside is_valid_password")
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

        if len(password) < 8:
            raise ValidationError("Password must be at least 8 characters long")

        return True

    def validate_password(self, password):
        print("inside password validation")
        try:
            if self.is_valid_password(password):
                validate_password(password)
                return password
        except ValidationError as e:
            # If password does not meet the validation criteria, raise an error
            raise e

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
        )
        print('Account created : ', user)
        return user
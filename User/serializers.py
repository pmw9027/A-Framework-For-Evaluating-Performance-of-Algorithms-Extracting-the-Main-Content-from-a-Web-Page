from django.contrib.auth.models import User, Group
from rest_framework import serializers


# 사용자 목록
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = (
            'url',
            'username',
            'email',
            'password',
            'groups'
        )


# 사용자 그룹
class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = (
            'url',
            'name'
        )

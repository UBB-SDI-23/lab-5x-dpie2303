import logging
from django.contrib.auth import get_user_model
from rest_framework import permissions
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

logger = logging.getLogger(__name__)

CustomUser = get_user_model()

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to admin users.
    """

    def has_permission(self, request, view):
        return request.user.is_admin


class IsAuthenticatedWithJWT(permissions.BasePermission):

    def has_permission(self, request, view):
        token = self._get_token_from_request(request)
        if token:
            user = self._get_user_from_token(token)
            if user:
                request.user = user
                return True
        if request.method == 'GET':
            return True
        return False

    def _get_token_from_request(self, request):
        
        auth_header = request.META.get('HTTP_AUTHORIZATION', '').split()
        if len(auth_header) == 2 and auth_header[0].lower() == 'bearer':
            return auth_header[1]
        return None

    def _get_user_from_token(self, token):
        try:
            valid_token = UntypedToken(token)
            return get_user_model().objects.filter(id=valid_token['user_id']).first()
        except (InvalidToken, TokenError):
            return None


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):

        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method == 'GET' or request.user.is_admin or request.user.is_moderator:
            return True
        
        if isinstance(obj, CustomUser):
            return request.user == obj
        return obj.user == request.user
        
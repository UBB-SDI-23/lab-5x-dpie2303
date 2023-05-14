from django.db import models
# from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    is_regular = models.BooleanField('regular status', default=False)
    is_moderator = models.BooleanField('moderator status', default=False)
    is_admin = models.BooleanField('admin status', default=False)


    def has_perm(self, perm, obj=None):
        # If the user is an admin, they can do everything
        if self.is_active and self.is_admin:
            return True

        # Check for the 'add_entity' and 'edit_entity' permissions
        if perm == "customauth.add_entity" or (perm == "customauth.edit_entity" and obj is not None and obj.creator == self):
            return self.is_active and (self.is_regular or self.is_moderator)

        # Check for the 'edit_entity' permission without a specific object
        if perm == "customauth.edit_entity":
            return self.is_active and self.is_moderator

        # In all other cases, fall back to the default permissions logic
        return super().has_perm(perm, obj)


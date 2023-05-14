from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from music.models import UserProfile
from faker import Faker
from random import choice

class Command(BaseCommand):
    help = 'Create random users'



    def handle(self, *args, **kwargs):
        User = get_user_model()  # Get the current User model
        faker = Faker()

        user = User.objects.get(id=9891)

        # Creating the UserProfile object
        UserProfile.objects.create(
            user=user,
            bio=faker.text(max_nb_chars=100),
            location=faker.city(),
            birth_date=faker.date_of_birth(),
            gender=faker.random_element(elements=('M', 'F')),
            marital_status=faker.random_element(elements=('S', 'M', 'D', 'W'))
        )

        # Create admin users
        for i in range(1,10):
            user = User.objects.create_user(username=f'admin_{i}', password='Password.123', email=f'admin_{i}@email.com',is_admin=True)
            UserProfile.objects.create(user=user, bio=faker.text(max_nb_chars=100), location=faker.city(), birth_date=faker.date_of_birth(), gender=faker.random_element(elements=('M', 'F')), marital_status=faker.random_element(elements=('S', 'M', 'D', 'W')))

        # Create moderator users
        for i in range(100):
            user = User.objects.create_user(username=f'moderator_{i}', password='Password.123', email=f'moderator_{i}@email.com',is_moderator=True)
            UserProfile.objects.create(user=user, bio=faker.text(max_nb_chars=100), location=faker.city(), birth_date=faker.date_of_birth(), gender=faker.random_element(elements=('M', 'F')), marital_status=faker.random_element(elements=('S', 'M', 'D', 'W')))

        # # Create regular users
        # for i in range(9890):
        #     user = User.objects.create_user(username=f'user_{i}', password='Password.123', email=f'user_{i}@email.com')
        #     UserProfile.objects.create(user=user, bio=faker.text(max_nb_chars=100), location=faker.city(), birth_date=faker.date_of_birth(), gender=faker.random_element(elements=('M', 'F')), marital_status=faker.random_element(elements=('S', 'M', 'D', 'W')))

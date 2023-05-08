from django.core.management.commands.makemigrations import Command as MakeMigrationsCommand


class Command(MakeMigrationsCommand):
    def handle(self, *args, **options):
        options["interactive"] = False
        super().handle(*args, **options)
from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings

class Command(BaseCommand):
    help = "Populate the database with sample data"

    def handle(self, *args, **options):
        base_dir = '/app/sql_scripts/'
        if settings.ALLOW_RAW_SQL:
            scripts = ['record_companies.sql', 'albums.sql', 'artists.sql', 'tracks.sql', 'track_artist_colab.sql']
            for script in scripts:
                with connection.cursor() as cursor:
                    with open(base_dir + script, 'r') as f:
                        script_content = f.read()
                        transactions = script_content.split('COMMIT;')

                        for transaction in transactions:
                            if transaction.strip():
                                cursor.execute(transaction.strip() + 'COMMIT;')

                self.stdout.write(self.style.SUCCESS('Database populated successfully'))
        else:
            self.stdout.write(self.style.ERROR('Raw SQL not allowed in settings'))

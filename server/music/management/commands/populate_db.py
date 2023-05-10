import logging
from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings

class Command(BaseCommand):
    help = "Populate the database with sample data"

    def handle(self, *args, **options):
        # Set up logging
        logging.basicConfig(filename='populate_db.log', level=logging.INFO)

        base_dir = '/app/sql_scripts/'
        if settings.ALLOW_RAW_SQL:
            scripts = ['drop_indexes.sql','record_companies.sql', 'albums.sql', 'artists.sql', 'tracks.sql', 'track_artist_colab.sql', 'create_indexes.sql']
            for script in scripts:
                self.stdout.write(self.style.SUCCESS(f'Database started populating {script}'))
                logging.error(f'Database started populating {script}') # Log the start of a script
                with connection.cursor() as cursor:
                    with open(base_dir + script, 'r') as f:
                        script_content = f.read()
                        transactions = script_content.split('COMMIT;')

                        for transaction in transactions:
                            if transaction.strip():
                                try:
                                    cursor.execute(transaction.strip() + 'COMMIT;')
                                except Exception as e:
                                    logging.error(f'Error executing transaction: {e}') # Log any errors in executing the transaction

                self.stdout.write(self.style.SUCCESS(f'Database populated successfully {script}'))
                logging.info(f'Database populated successfully {script}') # Log the successful completion of a script
        else:
            self.stdout.write(self.style.ERROR('Raw SQL not allowed in settings'))
            logging.error('Raw SQL not allowed in settings') # Log if raw SQL is not allowed
import logging
from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings
from django.db import connections

class Command(BaseCommand):
    help = "Populate the database with sample data"

    def handle(self, *args, **options):
        # Set up logging
        logging.basicConfig(filename='populate_db.log', level=logging.INFO)

        base_dir = '/app/sql_scripts/'
        if settings.ALLOW_RAW_SQL:
            scripts = ['drop_indexes.sql', 'record_companies.sql', 'albums.sql', 'artists.sql' , 'tracks.sql', 'track_artist_colab.sql',  'drop_duplicates.sql', 'create_indexes.sql']
            for script in scripts:
                self.stdout.write(self.style.SUCCESS(f'Database started populating {script}'))
                logging.error(f'Database started populating {script}') # Log the start of a script
                with open(base_dir + script, 'r') as f:
                    transaction = ''
                    batch = 0
                    for line in f:
                        transaction += line
                        if line.strip().endswith('COMMIT;'):
                            # Here we create a new cursor for each transaction
                            with connection.cursor() as cursor:
                                try:
                                    cursor.execute(transaction)
                                    transaction = '' # reset the transaction
                                    batch += 1
                                    if batch % 100 == 0:
                                        self.stdout.write(self.style.SUCCESS(f'transaction {batch} was executed'))
                                        logging.error(f'transaction {batch} was executed') # Log the start of a script
                                except Exception as e:
                                    logging.error(f'Error executing transaction: {e}') # Log any errors in executing the transaction

                self.stdout.write(self.style.SUCCESS(f'Database populated successfully {script}'))
                logging.info(f'Database populated successfully {script}') # Log the successful completion of a script
        else:
            self.stdout.write(self.style.ERROR('Raw SQL not allowed in settings'))
            logging.error('Raw SQL not allowed in settings') # Log if raw SQL is not allowed

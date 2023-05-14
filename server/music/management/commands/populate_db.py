import logging
from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings

class Command(BaseCommand):
    help = "Populate the database with sample data"

    def sql_commands(self, file):
        transaction = ''
        for line in file:
            transaction += line
            if 'COMMIT;' in transaction:
                yield transaction
                transaction = ''
        if transaction:
            yield transaction

    def handle(self, *args, **options):
        base_dir = '/app/sql_scripts/'
        logger = logging.getLogger(__name__)

        if not settings.ALLOW_RAW_SQL:
            self.stdout.write(self.style.ERROR('Raw SQL not allowed in settings'))
            logger.error('Raw SQL not allowed in settings')
            return
        # 'drop_indexes.sql', 'record_companies.sql', 'albums.sql', 'artists.sql',
        #scripts = ['drop_duplicates.sql', 'create_indexes.sql']
        
        scripts = ['drop_indexes.sql', 'record_companies.sql', 'albums.sql', 'artists.sql', 'tracks.sql', 'track_artist_colab.sql' , 'create_indexes.sql', 'drop_duplicates.sql']    

        for script in scripts:
            self.stdout.write(self.style.SUCCESS(f'Database started populating {script}'))
            logger.info(f'Database started populating {script}')

            with open(base_dir + script, 'r') as f:
                batch = 0

                for sql_command in self.sql_commands(f):
                    cursor = connection.cursor()
                    try:
                        cursor.execute(sql_command)
                        batch += 1
                        if batch % 100 == 0:
                            self.stdout.write(self.style.SUCCESS(f'transaction {batch} was executed'))
                            logger.info(f'transaction {batch} was executed')
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f'Error executing transaction {batch}: {e}'))
                        logger.error(f'Error executing transaction {batch}: {e}')
                    finally:
                        cursor.close()
                        connection.close()

            self.stdout.write(self.style.SUCCESS(f'Database populated successfully {script}'))
            logger.info(f'Database populated successfully {script}')

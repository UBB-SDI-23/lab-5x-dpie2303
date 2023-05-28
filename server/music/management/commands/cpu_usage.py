from django.core.management.commands.makemigrations import Command as MakeMigrationsCommand
import psutil
import time
import csv

class Command(MakeMigrationsCommand):
    def handle(self, *args, **options):
        # The time period over which to collect data (e.g., 60 seconds)
        DURATION = 120

        # The frequency at which to collect data (e.g., every second)
        FREQUENCY = 1

        cpu_percentages = []

        start_time = time.time()
        while time.time() - start_time < DURATION:
            cpu_percentages.append((time.time(), psutil.cpu_percent(interval=FREQUENCY)))

        with open('testing/cpu_usage.csv', 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["Timestamp", "CPU Usage (%)"])
            writer.writerows(cpu_percentages)
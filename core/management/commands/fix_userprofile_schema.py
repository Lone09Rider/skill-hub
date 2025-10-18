from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = 'Fix database schema issues for UserProfile table'

    def handle(self, *args, **options):
        self.stdout.write('Checking and fixing UserProfile table schema...')
        
        try:
            with connection.cursor() as cursor:
                # First, let's see what columns actually exist
                cursor.execute("DESCRIBE core_userprofile")
                existing_columns = [row[0] for row in cursor.fetchall()]
                self.stdout.write(f'Existing columns: {existing_columns}')
                
                # List of columns that should exist according to the model
                required_columns = [
                    ('location', 'VARCHAR(255) DEFAULT \'\''),
                    ('phone', 'VARCHAR(20) DEFAULT \'\''),
                    ('date_of_birth', 'DATE NULL'),
                    ('profile_picture', 'VARCHAR(100) NULL'),
                    ('bio', 'TEXT DEFAULT \'\''),
                    ('is_mentor', 'BOOLEAN DEFAULT 0'),
                    ('rating', 'DECIMAL(3,2) DEFAULT 0.00'),
                    ('created_at', 'DATETIME DEFAULT CURRENT_TIMESTAMP'),
                    ('updated_at', 'DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
                ]
                
                for column_name, column_def in required_columns:
                    if column_name not in existing_columns:
                        self.stdout.write(f'Adding missing {column_name} column...')
                        cursor.execute(f"ALTER TABLE core_userprofile ADD COLUMN {column_name} {column_def}")
                        self.stdout.write(self.style.SUCCESS(f'{column_name} column added successfully'))
                    else:
                        self.stdout.write(f'{column_name} column already exists')
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}'))
        
        self.stdout.write(self.style.SUCCESS('Database schema check completed!'))
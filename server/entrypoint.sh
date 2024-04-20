#!/bin/sh

# Make migrations and migrate the database
echo "Make migrations and migrating the database."
python manage.py makemigrations --noinput
python manage.py migrate --noinput
python manage.py collectstatic --noinput
exec "$@"
# SkillSwap AI (MVP)

This repository contains the MVP for SkillSwap AI — a community-based skill trading platform built with Django.


Quick start (local - PowerShell):

1. Create a virtualenv and install dependencies

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```


3. Run migrations and start the dev server

```powershell
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Notes:
- Install PostgreSQL locally or update `DATABASES` in `skillswap/settings.py` to use SQLite for quick testing.
- To run with Docker, see Dockerfile and consider adding a docker-compose.yml for Postgres and Redis.


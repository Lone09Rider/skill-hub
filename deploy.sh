#!/bin/bash

# SkillHub Deployment Script for Railway

echo "🚀 Starting SkillHub Django Backend Deployment..."

# Set environment variables
export DJANGO_SETTINGS_MODULE=skillswap.settings_production

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Run database migrations
echo "🗄️ Running database migrations..."
python manage.py migrate

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# Start the application
echo "✅ Starting SkillHub backend server..."
gunicorn skillswap.wsgi:application --bind 0.0.0.0:$PORT
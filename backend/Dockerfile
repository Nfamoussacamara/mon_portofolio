# ---- Build Stage ----
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

WORKDIR /app

# Dépendances système
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libjpeg-dev \
    libpng-dev \
    libffi-dev \
    python3-dev \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

# Dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Code source
COPY . .

# Fichiers statiques (Render injecte les env vars au runtime, pas au build)
# Donc on ne fait PAS collectstatic ici, mais dans le script de démarrage

EXPOSE $PORT

# Render exécute ce script au démarrage (migrations + superuser + seed + collectstatic + gunicorn)
CMD ["sh", "-c", "echo '==> Running Migrations...' && python manage.py migrate --noinput && echo '==> Creating Superuser...' && python manage.py createsuperuser_auto && echo '==> Seeding Data...' && python manage.py seed_data && echo '==> Collecting Static Files...' && mkdir -p /app/staticfiles && python manage.py collectstatic --noinput && echo '==> Starting Gunicorn...' && gunicorn core.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120"]

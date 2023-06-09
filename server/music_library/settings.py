"""
Django settings for music_library project.

Generated by 'django-admin startproject' using Django 4.1.7.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""


from pathlib import Path
import os

from datetime import timedelta


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-y#%tq*_rkh5r-30a*xn6wn_ny23wizu6arn*@a%a@6o&=ri4y%'

import logging

logger = logging.getLogger(__name__)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = bool(os.environ.get('DEBUG', default=False))

#author
AUTH_USER_MODEL = 'accounts.CustomUser'


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
     #  'rest_framework_simplejwt.authentication.JWTAuthentication',
     #   'rest_framework.permissions.IsAuthenticatedOrReadOnly',

    )
}


if DEBUG == False:
    REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = (
        'rest_framework.renderers.JSONRenderer',
    )

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=2),
}


ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'music.apps.MusicConfig',
    'chat.apps.ChatConfig',
    'accounts.apps.AccountsConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'corsheaders',
    'rest_framework',
    'drf_yasg',
    'channels'
]
if DEBUG == True:
    INSTALLED_APPS += ['django.contrib.staticfiles']
    INSTALLED_APPS += ['debug_toolbar']


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

if DEBUG == True:
    MIDDLEWARE += ['whitenoise.middleware.WhiteNoiseMiddleware']
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']



CORS_ALLOW_ALL_ORIGINS = True

ROOT_URLCONF = 'music_library.urls'
ASGI_APPLICATION = "music_library.routing.application"

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("redis", 6379)],
        },
    },
}

import socket

# Get Docker host IP
hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
INTERNAL_IPS = [ip[:-1] + '1' for ip in ips]

# You can also include '127.0.0.1' or any other IPs where you're running your server
INTERNAL_IPS += ['127.0.0.1', '10.0.2.2']

INTERNAL_IPS = [
    '127.0.0.1',
    'localhost',
    '0.0.0.0'
]


if DEBUG == True:
    STATIC_URL = '/static/'

    STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


def show_toolbar(request):
    return True

DEBUG_TOOLBAR_CONFIG = {
    'SHOW_TOOLBAR_CALLBACK': show_toolbar,
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'music_library.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
    },
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB'),
        'USER': os.environ.get('POSTGRES_USER'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
        'HOST': 'db', # Use the service name as the host
        'PORT': '5432',
    }
}

ALLOW_RAW_SQL = True
MIGRATION_INTERACTIVE = False


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

# STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

from datetime import timedelta
import os
from pathlib import Path


import builtins
import inspect
import sys

# import sys
# import os

# # Force unbuffered output
# if os.environ.get('PYTHONUNBUFFERED', '0') == '1':
#     sys.stdout.reconfigure(line_buffering=True)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-wkdk)+4=im0#6up=^@o-=^hph=k$q7$%dq@yuu_opcj4nt3(qt'

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = False
DEBUG = True
DATA_UPLOAD_MAX_NUMBER_FIELDS = 20000  # or any number you expect

X_FRAME_OPTIONS = 'ALLOWALL'

# ALLOWED_HOSTS = ['edusync.nexasofts.com','www.edusync.nexasofts.com','0.0.0.0','localhost','192.168.17.168','127.0.0.1', 'ims.nexasofts.com','192.168.1.29','172.24.0.2','192.168.0.165','192.168.249.168','192.168.0.165']
ALLOWED_HOSTS = ['*']
# Allow all origins for development (you can restrict this for production)
CORS_ALLOW_ALL_ORIGINS = True

# CORS_ALLOWED_ORIGINS = [
#     "http://0.0.0.0:3002", 
#     "http://192.168.1.29:3002", 
#     "http://192.168.1.30:3002", 
#     "http://192.168.17.168:3002",   
#     "https://192.168.0.165:3002",  
#     "https://192.168.249.168:3002",  
#     "http://localhost:3002", 
#     "http://ims.nexasofts.com:3002",
#     "https://ims.nexasofts.com:3002",  # Your frontend's origin
#     "https://ims.nexasofts.com",  # Online Origin
#     'http://10.246.6.168:3002',
#     'https://10.246.6.168:3002',
# ]
CSRF_TRUSTED_ORIGINS = [
    'https://ims.nexasofts.com',
    'https://jidc.edu.bd',
    'https://paglahighschool.edu.bd',
    'https://paglahighschool.nexasofts.com',
    'http://ims.nexasofts.com:3002',
    'https://ims.nexasofts.com:3002',
    'http://localhost:3002',
    'https://localhost:3002',
    'http://192.168.17.168:3002',
    'https://192.168.17.168:3002',
    'https://192.168.1.29:3002',
    'https://192.168.1.30:3002',
    'https://192.168.0.165:3002',
    'https://192.168.249.168:3002',
    'http://10.246.6.168:3002',
    'https://10.246.6.168:3002',
    'https://192.168.0.164:3002',
    'https://10.246.6.168:3002',
]


# Application definition
# AUTH_USER_MODEL = 'auth.User'
AUTH_USER_MODEL = 'ims_02_account.User'

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'ims_01_institute',
    'ims_02_account',
    'ims_2_feemanagement',
    'ims_03_exam',
    'ims_04_result',
    'ims_05_attendance', 
    'ims_06_announcement', 
    'ims_07_sms', 
    'ims_20_website', 
    

    # ////////////////////////////////// 
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'core',
    'institute_management',
    'django_extensions',
    'django_admin_inline_paginator', 
    'mptt',
    'easy_thumbnails',
    'image_cropping',
    'django_filters',
    # "django_cleanup.apps.CleanupConfig", # Delete picture automatically when user delete record from database using admin panel
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',  

    # ////////////////////////////////
    'corsheaders.middleware.CorsMiddleware',

]


THUMBNAIL_ALIASES = {
    '': {
        'slider_cropped': {
            'size': (1920, 1000),
            'crop': True,
        },
    },
}


# Required for django-image-cropping
THUMBNAIL_PROCESSORS = (
    'image_cropping.thumbnail_processors.crop_corners',  # 🟢 Enables use of `cropping` field
    'easy_thumbnails.processors.colorspace',
    'easy_thumbnails.processors.autocrop',
    'easy_thumbnails.processors.scale_and_crop',
    'easy_thumbnails.processors.filters',
)
# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': (
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#     ),
# }

# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': [
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#     ],
#     'DEFAULT_PERMISSION_CLASSES': [
#         'rest_framework.permissions.IsAuthenticated',
#     ],
    
# }

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',  # JWT authentication
        'rest_framework.authentication.SessionAuthentication',        # Session authentication
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',  # Require authentication by default
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'PAGE_SIZE_QUERY_PARAM': 'itemPerPage',  # Allow ?page_size=20
    'MAX_PAGE_SIZE': 100,  # Limit maximum page size
    
    
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
    ],
    
    
}


# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': [
#         'rest_framework.authentication.SessionAuthentication',  # Enable session authentication
#         'rest_framework.authentication.TokenAuthentication',    # Optional: Enable token authentication
#     ],
#     'DEFAULT_PERMISSION_CLASSES': [
#         'rest_framework.permissions.IsAuthenticated',  # Require authentication by default
#     ],
# }

SIMPLE_JWT = {
    # 'ACCESS_TOKEN_LIFETIME': timedelta(seconds=10),  # Adjust as needed
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),  # Adjust as needed
    'REFRESH_TOKEN_LIFETIME': timedelta(days=3),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    "AUTH_COOKIE_HTTP_ONLY": True, 
    'AUTH_COOKIE_SECURE': False,  # Set to True in production with HTTPS
    'AUTH_COOKIE_SAMESITE': 'None',  # Adjust for cross-origin requests
}


# Allow sending cookies across origins
CORS_ALLOW_CREDENTIALS = True

# CORS_ORIGIN_ALLOW_ALL = True  # Allow all origins (only for development!)

CORS_ALLOW_ALL_ORIGINS = True

# ///////////////////// for Local ssl certificate//////////////////////////////
# Enable secure settings
SECURE_SSL_REDIRECT = False  # Set to True in production
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')



# Allow trusted origins
# CSRF_TRUSTED_ORIGINS = [
#     'https://localhost',
#     'https://ims.nexasofts.com',
# ]

CORS_ALLOW_HEADERS = [
    'content-type',
    'authorization',
    # other headers
]
# CORS_ALLOW_METHODS = [
#     'GET',
#     'POST',
#     'OPTIONS',
#     # other methods
# ]

# ✅ This is the most important part:
CORS_ALLOW_METHODS = [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS",
    "PATCH",
]




ROOT_URLCONF = 'backend.urls'

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

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

# TIME_ZONE = 'UTC'
# USER_TIME_ZONE = 'Asia/Dhaka'  # 6 hours ahead of UTC
# USE_I18N = True
# USE_TZ = True 

TIME_ZONE = 'Asia/Dhaka'   # <-- set this directly
USE_I18N = True
USE_TZ = True

# If you know the user's timezone

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

# STATIC_URL = 'static/' 
# STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
# STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')



# STATICFILES_DIRS = [
#     os.path.join(BASE_DIR, "static"),
# ]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

#////////////////////////////////////////////////////////////////////////////////////////////
#/////////////////////////////// Local Development Setting ///////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')



#////////////////////////////////////////////////////////////////////////////////////////////
#/////////////////////////////// Production / Server ///////////////////////////////
#////////////////////////////////////////////////////////////////////////////////////////////



# STATIC_URL = '/ims/static/'
# STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
# STATICFILES_DIRS = [
#     os.path.join(BASE_DIR, 'static'),
# ]

# MEDIA_URL = '/ims/media/'
# MEDIA_ROOT = os.path.join(BASE_DIR, 'media')




# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# AUTHENTICATION_BACKENDS = [
#     'ims_02_account.users.backends.MobileNumberBackend',  # Path to your custom backend
#     'django.contrib.auth.backends.ModelBackend',  # Default backend
# ]



# Save original print
_original_print = print

def debug_print(*args, **kwargs):
    # Get caller frame
    frame = inspect.currentframe().f_back
    filename = frame.f_code.co_filename
    lineno = frame.f_lineno
    # Show filename:lineno before the actual message
    prefix = f"[{filename}:{lineno}]"
    _original_print(prefix, *args, **kwargs, file=sys.stdout)

# Override built-in print
builtins.print = debug_print

import os
import sys

# Set up paths and environment variables
sys.path.append(os.getcwd())
os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'

from backend.wsgi import application

import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Flask general settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'fs_default_flask_secret_key_84920')
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
    PORT = int(os.getenv('PORT', 5000))
    
    # SQLAlchemy & Database settings
    MYSQL_USER = os.getenv('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_PORT = os.getenv('MYSQL_PORT', '3306')
    MYSQL_DB = os.getenv('MYSQL_DB', 'fraudshield_db')
    
    # Check if a custom DATABASE_URL is provided (e.g. in production)
    if os.getenv('DATABASE_URL'):
        SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    else:
        # Check if local MySQL port is open to decide between MySQL and SQLite
        import socket
        mysql_active = False
        try:
            with socket.create_connection((MYSQL_HOST, int(MYSQL_PORT)), timeout=0.5):
                mysql_active = True
        except Exception:
            pass

        if mysql_active:
            SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
        else:
            db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'fraudshield.db'))
            SQLALCHEMY_DATABASE_URI = f"sqlite:///{db_path}"
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Settings
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'fs_default_jwt_secret_key_10398')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=int(os.getenv('JWT_EXPIRY_HOURS', '24')))

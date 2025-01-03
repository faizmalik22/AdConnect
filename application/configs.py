class Config:
    DEBUG = True

    SQLALCHEMY_DATABASE_URI = 'sqlite:///data.db'
    SECRET_KEY = 'jhkhkwenfklnwlkfioj3rjegjegui4nnfiwj'
    SECURITY_PASSWORD_SALT = 'salty-password'
    
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
    SECURITY_TOKEN_MAX_AGE = 3600
    SECURITY_LOGIN_WITHOUT_CONFIRMATION = True

    WTF_CSRF_ENABLED = False


    CACHE_TYPE = 'RedisCache'
    CACHE_REDIS_HOST = 'localhost'
    CACHE_REDIS_PORT = 6379
    CACHE_REDIS_DB = 0
    CACHE_REDIS_URL = 'redis://localhost:6379/0'
    CACHE_DEFAULT_TIMEOUT = 300


class CeleryConfig:
    broker_url = "redis://localhost:6379/0"
    result_backend = "redis://localhost:6379/1"
    timezone = 'Asia/Kolkata'
    broker_connection_retry_on_startup = True

class MailConfig:
    SMTP_SERVER = 'localhost'
    SMTP_PORT = '1025'
    SENDER_EMAIL = 'test@gmail.com'
    SENDER_PASSWORD = ''
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from config import Config

DB_NAME = Config.DB_NAME
USER_NAME = Config.DB_USER
DB_HOST = Config.DB_HOST

SQLALCHEMY_DATABASE_URL = f"postgresql://{USER_NAME}:Bright#1270@{DB_HOST}/{DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# app/config.py
from dotenv import load_dotenv
import os
from pathlib import Path

load_dotenv(Path(__file__).parent.parent/'.env')  # Load from project root


class Config:
    DB_URL = os.getenv('DB_URL')
    DB_NAME = os.getenv("DB_NAME")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")

    TABLE_NAME = os.getenv("TABLE_NAME")

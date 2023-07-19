import logging
import os

from dotenv import load_dotenv

load_dotenv()
logging.info("Loaded environment variables from .env")

SUPABASE_URL = os.getenv("SUPABASE_URL") or ""
SUPABASE_KEY = os.getenv("SUPABASE_KEY") or ""

DB_CONNECTION = os.getenv("DB_CONNECTION") or ""

MODEL_DIR = os.getenv("MODEL_DIR") or "models"
IMAGE_DIR = os.getenv("IMAGE_DIR") or "images"

if not os.path.exists(MODEL_DIR):
    os.mkdir(MODEL_DIR)
    logging.info(f"Created model directory at {MODEL_DIR}/.")

if not os.path.exists(IMAGE_DIR):
    os.mkdir(IMAGE_DIR)
    logging.info(f"Created image directory at {IMAGE_DIR}/.")

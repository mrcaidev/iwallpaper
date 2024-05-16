import os

import dotenv

dotenv.load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
GTE_MODEL_NAME = os.getenv("GTE_MODEL_NAME")
GTE_MODEL_PATH = os.getenv("GTE_MODEL_PATH")

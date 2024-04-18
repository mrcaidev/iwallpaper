import os

import dotenv


def load_environment_variables():
    success = dotenv.load_dotenv()

    if success:
        print("Loaded environment variables.")
    else:
        print("Environment variables not found.")


load_environment_variables()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
GTE_MODEL_NAME = os.getenv("GTE_MODEL_NAME")
GTE_MODEL_PATH = os.getenv("GTE_MODEL_PATH")

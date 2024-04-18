import dotenv

env = dotenv.dotenv_values(verbose=True)

SUPABASE_URL = env.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = env.get("SUPABASE_SERVICE_ROLE_KEY")
GTE_MODEL_NAME = env.get("GTE_MODEL_NAME")
GTE_MODEL_PATH = env.get("GTE_MODEL_PATH")

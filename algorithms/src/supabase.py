import supabase

from .env import SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL


def create_supabase_client():
    if not SUPABASE_URL:
        raise Exception("SUPABASE_URL not found.")

    if not SUPABASE_SERVICE_ROLE_KEY:
        raise Exception("SUPABASE_SERVICE_ROLE_KEY not found.")

    client = supabase.create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    print("Connected to Supabase.")
    return client


supabase_client = create_supabase_client()

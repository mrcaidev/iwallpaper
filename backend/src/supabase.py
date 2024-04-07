import logging

import supabase

from .env import SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL

logger = logging.getLogger(__name__)


def create_supabase_client():
    client = supabase.create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    logger.info("Connected to Supabase.")
    return client


supabase_client = create_supabase_client()

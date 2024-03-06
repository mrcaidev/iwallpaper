"""
连接到 Supabase 数据库，在整个应用程序中复用。
"""

import logging
import os

import vecs

import supabase

__all__ = ["supabase_client", "vecs_client"]

logger = logging.getLogger(__name__)


def create_supabase_client():
    SUPABASE_URL = os.getenv("SUPABASE_URL") or ""
    SUPABASE_KEY = os.getenv("SUPABASE_KEY") or ""
    client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

    logger.info("Connected to Supabase public database.")

    return client


def create_vecs_client():
    SUPABASE_CONNECTION = os.getenv("SUPABASE_CONNECTION") or ""
    client = vecs.create_client(SUPABASE_CONNECTION)

    logger.info("Connected to Supabase vector database.")

    return client


supabase_client = create_supabase_client()
vecs_client = create_vecs_client()

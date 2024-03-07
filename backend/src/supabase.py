"""
连接到 Supabase 数据库。
"""

import logging
import os

import vecs

import supabase

__all__ = ["supabase_client", "vecs_client"]

logger = logging.getLogger(__name__)


def create_supabase_client():
    """
    连接到 public schema，用于进行常见操作。
    """
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
    client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

    logger.info("Connected to Supabase public database.")

    return client


def create_vecs_client():
    """
    连接到 vecs schema，用于进行向量操作。
    """
    SUPABASE_CONNECTION = os.getenv("SUPABASE_CONNECTION", "")
    client = vecs.create_client(SUPABASE_CONNECTION)

    logger.info("Connected to Supabase vector database.")

    return client


supabase_client = create_supabase_client()
vecs_client = create_vecs_client()

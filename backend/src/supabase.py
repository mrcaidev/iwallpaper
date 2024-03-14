"""
连接到 Supabase 数据库。
"""

import logging

import vecs

import supabase

from .env import SUPABASE_CONNECTION, SUPABASE_KEY, SUPABASE_URL

logger = logging.getLogger(__name__)


def create_supabase_client():
    client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)
    logger.info("Connected to Supabase public database.")
    return client


def create_vecs_client():
    client = vecs.create_client(SUPABASE_CONNECTION)
    logger.info("Connected to Supabase vector database.")
    return client


supabase_client = create_supabase_client()
vecs_client = create_vecs_client()

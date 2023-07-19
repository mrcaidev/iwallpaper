import supabase
import vecs

from .constants import DB_CONNECTION, SUPABASE_KEY, SUPABASE_URL

supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

vecs_client = vecs.create_client(DB_CONNECTION)

preference_collection = vecs_client.get_collection("preference_vectors")

tag_collection = vecs_client.get_collection("tag_vectors")

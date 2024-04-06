ALTER TABLE auth.users ADD CONSTRAINT users_raw_user_meta_data_check CHECK (
  JSONB_MATCHES_SCHEMA(
    '{
      "type": "object",
      "properties": {
        "nickname": {
          "type": ["string", "null"],
          "maxLength": 20,
          "minLength": 2
        },
        "avatar_url": {
          "type": ["string", "null"],
          "format": "uri"
        }
      },
      "required": [
        "nickname",
        "avatar_url"
      ]
    }',
    raw_user_meta_data
  )
);

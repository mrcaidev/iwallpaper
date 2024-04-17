ALTER TABLE auth.users ADD CONSTRAINT users_raw_user_meta_data_check CHECK (
  JSONB_MATCHES_SCHEMA(
    '{
      "type": "object",
      "properties": {
        "nickname": {
          "type": ["string", "null"],
          "minLength": 2,
          "maxLength": 20
        },
        "avatar_url": {
          "type": ["string", "null"],
          "format": "uri"
        }
      },
      "additionalProperties": false,
      "required": [
        "nickname",
        "avatar_url"
      ]
    }',
    raw_user_meta_data
  )
);

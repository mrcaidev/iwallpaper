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
        "avatar_path": {
          "type": ["string", "null"]
        }
      },
      "additionalProperties": false,
      "required": ["nickname", "avatar_path"]
    }',
    raw_user_meta_data
  )
);

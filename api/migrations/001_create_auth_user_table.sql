CREATE TABLE IF NOT EXISTS auth_user (
    id uuid DEFAULT gen_random_uuid(),
    username VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);
DROP TABLE viewer_liked_posts;
DROP TABLE viewer_saved_posts;
DROP TABLE viewer_connections;
DROP TABLE viewer_followed_organizations;
DROP TABLE viewer_followed_disciplines;
DROP TABLE viewer_joined_collaborations;
DROP TABLE profile;

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE CHECK (email = lower(email)),
  password_hash text NOT NULL,
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
  headline text NOT NULL DEFAULT 'Profil Seniman Anda' CHECK (char_length(headline) <= 160),
  location text CHECK (char_length(location) <= 120),
  discipline text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX sessions_user_id_idx ON sessions (user_id);

ALTER TABLE posts DROP COLUMN is_own;
ALTER TABLE posts ADD COLUMN author_id uuid REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE organization_applications ADD COLUMN user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE bookings ADD COLUMN user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE orders ADD COLUMN user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE drafts ADD COLUMN user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE;

CREATE TABLE post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id integer NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX post_comments_post_id_idx ON post_comments (post_id, created_at);

CREATE TABLE viewer_liked_posts (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id integer NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, item_id)
);

CREATE TABLE viewer_saved_posts (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id integer NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, item_id)
);

CREATE TABLE viewer_connections (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id text NOT NULL REFERENCES network_profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, item_id)
);

CREATE TABLE viewer_followed_organizations (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, item_id)
);

CREATE TABLE viewer_followed_disciplines (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id text NOT NULL REFERENCES disciplines(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, item_id)
);

CREATE TABLE viewer_joined_collaborations (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id text NOT NULL REFERENCES collaborations(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, item_id)
);

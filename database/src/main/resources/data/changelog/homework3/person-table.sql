CREATE TABLE users (
  id        VARCHAR(200) NOT NULL PRIMARY KEY,
  login     VARCHAR(200) NOT NULL,
  password  VARCHAR(200) NOT NULL,
  age       INTEGER NOT NULL DEFAULT 4,
  delete    BOOLEAN NOT NULL DEFAULT 'false'
);
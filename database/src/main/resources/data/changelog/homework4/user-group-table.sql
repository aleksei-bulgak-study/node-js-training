CREATE SEQUENCE user_group_id_seq;

CREATE TABLE user_group(
  id INTEGER NOT NULL DEFAULT NEXTVAL('user_group_id_seq'),
  fk_user_id VARCHAR(200) NOT NULL,
  fk_group_id VARCHAR(200) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (fk_user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (fk_group_id) REFERENCES groups (id) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER SEQUENCE user_group_id_seq OWNED BY user_group.id;
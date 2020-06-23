CREATE SEQUENCE permission_id_seq;

CREATE TABLE permission (
  id INT NOT NULL DEFAULT NEXTVAL('permission_id_seq'),
  value VARCHAR(20) UNIQUE NOT NULL,
  PRIMARY KEY(id)
);

ALTER SEQUENCE permission_id_seq OWNED BY permission.id;
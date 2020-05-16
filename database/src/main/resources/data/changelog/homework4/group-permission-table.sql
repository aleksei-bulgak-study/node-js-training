CREATE TABLE group_permission (
  fk_group_id VARCHAR(200) NOT NULL,
  fk_permission_id INT NOT NULL,
  FOREIGN KEY (fk_group_id) REFERENCES groups (id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (fk_permission_id) REFERENCES permission (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT group_permission_pk PRIMARY KEY (fk_group_id, fk_permission_id)
)
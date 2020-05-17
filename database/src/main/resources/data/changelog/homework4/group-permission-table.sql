CREATE TABLE group_permission (
  "groupId" VARCHAR(200) NOT NULL,
  "permissionId" INT NOT NULL,
  FOREIGN KEY ("groupId") REFERENCES groups (id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY ("permissionId") REFERENCES permission (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT group_permission_pk PRIMARY KEY ("groupId", "permissionId")
)
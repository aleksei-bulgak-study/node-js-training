import { PersonEntity } from './person/person.entity';
import { PersonDaoImpl } from './person/person.dao';
import PersonDao from './person/personDao.interface';

import { GroupEntity } from './group/group.entity';
import { GroupDaoImpl } from './group/group.dao';
import GroupDao from './group/groupDao.interface';

import { PermissionEntity } from './permission/permission.entity';
import { PermissionDaoImpl } from './permission/permission.dao';
import PermissionDao from './permission/permissionDao.interface';

export {
  PersonDao,
  PersonDaoImpl,
  PersonEntity,
  GroupDao,
  GroupDaoImpl,
  GroupEntity,
  PermissionDao,
  PermissionDaoImpl,
  PermissionEntity,
};

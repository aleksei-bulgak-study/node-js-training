import { PersonDaoImpl } from './person/person.dao';
import PersonDao from './person/personDao.interface';
import { PersonEntity } from './person/person.entity';

import { GroupDaoImpl } from './group/group.dao';
import GroupDao from './group/groupDao.interface';
import { GroupEntity } from './group/group.entity';

import { PermissionDaoImpl } from './permission/permission.dao';
import PermissionDao from './permission/permissionDao.interface';
import { PermissionEntity } from './permission/permission.entity';

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

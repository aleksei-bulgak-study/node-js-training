import { v4 as uuidv4 } from 'uuid';
import { Group } from '../../../../src/models';

const id = uuidv4();
const group: Group = {
  id: id,
  name: 'test group name',
  permissions: ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'],
  users: [],
};

export { id, group };

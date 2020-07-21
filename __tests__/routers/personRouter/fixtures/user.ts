import { v4 as uuidv4 } from 'uuid';
import { Person } from '../../../../src/models';

const id = uuidv4();
const person: Person = {
  id: id,
  login: 'test login',
  password: 'testpassword123',
  age: 33,
  isDeleted: false,
};

export { id, person };

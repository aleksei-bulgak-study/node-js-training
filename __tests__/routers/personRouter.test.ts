import request from 'supertest';
import PersonService from '../../src/services/person/person.service';
import { PersonRouter } from '../../src/routers/person.router';
import { Router } from 'express';
import { Person, InternalError, ErrorType } from '../../src/models';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { internalErrorMidleware, defaultErrorMiddleware } from '../../src/middlewares';
import { loggerService } from '../../src/configs/logger';

jest.mock('../../src/services/person/person.service');
jest.mock('../../src/configs/logger');

describe('Person router instance', () => {
  const id = uuidv4();
  const person: Person = {
    id: id,
    login: 'test login',
    password: 'testpassword123',
    age: 33,
    isDeleted: false,
  };

  let app: express.Express;
  let personService: jest.Mocked<PersonService>;
  let personRouter: Router;

  beforeAll(() => {
    const errorHandlers = [internalErrorMidleware, defaultErrorMiddleware(loggerService)];
    personService = new PersonService() as any;
    personRouter = PersonRouter(personService);
    app = express();
    app.use(express.json());
    app.use('/users', personRouter);
    app.use(...errorHandlers);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('when find by id operation is called', () => {
    test('should return user model', async () => {
      //given
      personService.getById.mockImplementationOnce(() => Promise.resolve(person));

      //when
      await request(app)
        .get('/users/' + id)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(person);
        });
      //then
      expect(personService.getById.mock.calls[0][0]).toEqual(id);
    });

    test('should return exception if service failed', async () => {
      //given
      const id = 'test id';
      personService.getById.mockImplementationOnce(() =>
        Promise.reject(new InternalError('test exception', ErrorType.NOT_FOUND))
      );

      //when
      await request(app)
        .get('/users/' + id)
        .expect(404)
        .then((response) => expect(response.body.message).toEqual('test exception'));
      //then
      expect(personService.getById.mock.calls[0][0]).toEqual(id);
    });
  });

  describe('when get all users operation is called', () => {
    test('should return list of all users', async () => {
      //given
      const people: Array<Person> = [person];
      personService.getAutoSuggestUsers.mockImplementationOnce(() => Promise.resolve(people));
      //when
      await request(app)
        .get('/users')
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(people);
        });
      //then
      expect(personService.getAutoSuggestUsers.mock.calls[0][0]).toEqual('');
      expect(personService.getAutoSuggestUsers.mock.calls[0][1]).toEqual(NaN);
    });

    test('should return first 10 users', async () => {
      //given
      const people: Array<Person> = [person];
      personService.getAutoSuggestUsers.mockImplementationOnce(() => Promise.resolve(people));
      //when
      await request(app)
        .get('/users')
        .query({ limit: 10 })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(people);
        });
      //then
      expect(personService.getAutoSuggestUsers.mock.calls[0][0]).toEqual('');
      expect(personService.getAutoSuggestUsers.mock.calls[0][1]).toEqual(10);
    });

    test('should return users with login constaining "test"', async () => {
      //given
      const people: Array<Person> = [person];
      personService.getAutoSuggestUsers.mockImplementationOnce(() => Promise.resolve(people));
      //when
      await request(app)
        .get('/users')
        .query({ loginSubstring: 'test' })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(people);
        });
      //then
      expect(personService.getAutoSuggestUsers.mock.calls[0][0]).toEqual('test');
      expect(personService.getAutoSuggestUsers.mock.calls[0][1]).toEqual(NaN);
    });

    test('should return list of all users if limit argument is invalid', async () => {
      //given
      const people: Array<Person> = [person];
      personService.getAutoSuggestUsers.mockImplementationOnce(() => Promise.resolve(people));
      //when
      await request(app)
        .get('/users')
        .query({ limit: 'Non numeric value' })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(people);
        });
      //then
      expect(personService.getAutoSuggestUsers.mock.calls[0][0]).toEqual('');
      expect(personService.getAutoSuggestUsers.mock.calls[0][1]).toEqual(NaN);
    });
  });

  describe('when create operation is called', () => {
    test('should return created user model', async () => {
      //given
      personService.create.mockImplementationOnce(() => Promise.resolve(person));
      //when
      await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send(person)
        .expect(201)
        .then((response) => {
          expect(response.body).toEqual(person);
        });
      //then
      expect(personService.create.mock.calls[0][0]).toEqual(person);
    });

    test('should return error when invalid id specified', async () => {
      //given
      const invalidRequest = { ...person, id: 'invalid id' };
      //when
      await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send(invalidRequest)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual('"id" must be a valid GUID');
        });
      //then
      expect(personService.create).not.toHaveBeenCalled();
    });

    test('should return error when invalid login was specified', async () => {
      //given
      const invalidRequest = { ...person, login: 123 };
      //when
      await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send(invalidRequest)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual('"login" must be a string');
        });
      //then
      expect(personService.create).not.toHaveBeenCalled();
    });

    test('should return error if invalid password was specified', async () => {
      //given
      const invalidRequest = { ...person, password: 'invalid password' };
      //when
      await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send(invalidRequest)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual(
            '"password" must only contain alpha-numeric characters'
          );
        });
      //then
      expect(personService.create).not.toHaveBeenCalled();
    });

    test('should return error if age less then 4 years', async () => {
      //given
      const invalidRequest = { ...person, age: 3 };
      //when
      await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send(invalidRequest)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual('"age" must be larger than or equal to 4');
        });
      //then
      expect(personService.create).not.toHaveBeenCalled();
    });

    test('should return error when age larger then 130', async () => {
      //given
      const invalidRequest = { ...person, age: 131 };
      //when
      await request(app)
        .post('/users')
        .set('Accept', 'application/json')
        .send(invalidRequest)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual('"age" must be less than or equal to 130');
        });
      //then
      expect(personService.create).not.toHaveBeenCalled();
    });
  });

  describe('when delete user operation is called', () => {
    test('should remove user', async () => {
      //given
      personService.delete.mockImplementationOnce(() => Promise.resolve(person));
      //when
      await request(app)
        .delete('/users/' + id)
        .expect(200);
      //then
      expect(personService.delete.mock.calls[0][0]).toEqual(id);
    });

    test('should return error if person service failed', async () => {
      //given
      personService.delete.mockImplementationOnce(() =>
        Promise.reject(new InternalError('test', ErrorType.NOT_FOUND))
      );
      //when
      await request(app)
        .delete('/users/' + id)
        .expect(404)
        .then((response) => expect(response.body.message).toEqual('test'));
      //then
      expect(personService.delete.mock.calls[0][0]).toEqual(id);
    });
  });

  describe('when update user is called', () => {
    test('should return updated user', async () => {
      //given
      personService.update.mockImplementationOnce(() => Promise.resolve(person));
      //when
      await request(app)
        .put('/users/' + id)
        .set('Accept', 'application/json')
        .send(person)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(person);
        });
      //then
      expect(personService.update.mock.calls[0][0]).toEqual(person);
    });

    test('should return error if login is invalid', async () => {
      //given
      const invalidRequest = { ...person, login: 123 };
      //when
      await request(app)
        .put('/users/' + id)
        .set('Accept', 'application/json')
        .send(invalidRequest)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual('"login" must be a string');
        });
      //then
      expect(personService.update).not.toHaveBeenCalled();
    });

    test('should return error if password is invalid', async () => {
      //given
      const invalidRequest = { ...person, password: 'invalid password' };
      //when
      await request(app)
        .put('/users/' + id)
        .set('Accept', 'application/json')
        .send(invalidRequest)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual(
            '"password" must only contain alpha-numeric characters'
          );
        });
      //then
      expect(personService.update).not.toHaveBeenCalled();
    });

    test('should return error when age less then 4', async () => {
      //given
      const invalidRequest = { ...person, age: 3 };
      //when
      await request(app)
        .put('/users/' + id)
        .set('Accept', 'application/json')
        .send(invalidRequest)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual('"age" must be larger than or equal to 4');
        });
      //then
      expect(personService.update).not.toHaveBeenCalled();
    });

    test('should return error when age larger then 130', async () => {
      //given
      const invalidRequest = { ...person, age: 131 };
      //when
      await request(app)
        .put('/users/' + id)
        .set('Accept', 'application/json')
        .send(invalidRequest)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual('"age" must be less than or equal to 130');
        });
      //then
      expect(personService.update).not.toHaveBeenCalled();
    });
  });
});

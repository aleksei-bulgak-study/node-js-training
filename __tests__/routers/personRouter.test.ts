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

describe('Person router', () => {
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

  describe('find by id', () => {
    test('success case', async () => {
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

    test('when service throws exception', async () => {
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

  describe('get all', () => {
    test('success case', async () => {
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

    test('success case with limit value passed', async () => {
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

    test('success case with search string', async () => {
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

    test('success case with invalid limit value', async () => {
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

  describe('create person', () => {
    test('success case', async () => {
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

    test('when id is invalid uuid', async () => {
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

    test('when login is invalid', async () => {
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

    test('when password is invalid', async () => {
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

    test('when age less then 4', async () => {
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

    test('when age larger then 130', async () => {
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

  describe('delete', () => {
    test('success case', async () => {
      //given
      personService.delete.mockImplementationOnce(() => Promise.resolve(person));
      //when
      await request(app)
        .delete('/users/' + id)
        .expect(200);
      //then
      expect(personService.delete.mock.calls[0][0]).toEqual(id);
    });

    test('when service throw not found exception', async () => {
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

  describe('update', () => {
    test('success case', async () => {
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

    test('when login is invalid', async () => {
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

    test('when password is invalid', async () => {
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

    test('when age less then 4', async () => {
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

    test('when age larger then 130', async () => {
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

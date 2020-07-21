import request from 'supertest';
import PersonService from '../../../src/services/person/person.service';
import { PersonRouter } from '../../../src/routers/person.router';
import { Router } from 'express';
import { Person, InternalError, ErrorType } from '../../../src/models';
import express from 'express';
import { internalErrorMidleware, defaultErrorMiddleware } from '../../../src/middlewares';
import { loggerService } from '../../../src/configs/logger';
import { id, person } from './fixtures/user';

jest.mock('../../../src/services/person/person.service');
jest.mock('../../../src/configs/logger');

describe('Person router instance', () => {
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

  describe('when create operation is called', () => {
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

import request from 'supertest';
import { app, server } from '../../src/index';
import LoggerService from '../../src/configs/logger';
import '../../src/configs/database';
import '../../src/data-access/person/person.entity';

jest.mock('../../src/configs/logger', () => ({
  __esModule: true,
  winstonMiddleware: (req, res, next) => next(),
}));
jest.mock('../../src/configs/database');
jest.mock('../../src/configs', () => {
  const SequelizeMock = require('sequelize-mock');
  const db = new SequelizeMock();
  const loggerService: LoggerService = {
    info: jest.fn(),
    debug: jest.fn(),
    errorDetailed: jest.fn().mockImplementation((message) => console.log(message)),
    error: jest.fn().mockImplementation((message) => console.log(message)),
  };
  return {
    __esModule: true,
    sequelize: db,
    port: 0,
    loggerService,
    jwtSecret: 'test',
  };
});
jest.mock('../../src/data-access/person/person.entity', () => {
  const SequelizeMock = require('sequelize-mock');
  const existing = {
    id: 'testId',
    login: 'aleksei@gmail.com',
    password: 'password123',
    age: 33,
    isDeleted: false,
  };
  const db = new SequelizeMock();
  const PersonEntity = db.define('user', existing, { tableName: 'users', timestamps: false });
  PersonEntity.$queryInterface.$useHandler(function (query, queryOptions, done) {
    if (query === 'findOne') {
      if (queryOptions[0].where.login === existing.login) {
        // Result found, return it
        return PersonEntity.build(existing);
      } else {
        // No results
        return null;
      }
    }
    if (query === 'findAll') {
      if (queryOptions[0].where.login[Symbol.for('like')] === '%%') {
        return [PersonEntity.build(existing)];
      } else {
        return null;
      }
    }
  });

  return {
    PersonEntity,
  };
});
server.close();

describe('person router', () => {
  let authToken = '';
  beforeEach(async () => {
    await request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({
        login: 'aleksei@gmail.com',
        password: 'password123',
      })
      .expect(200)
      .then((response) => {
        authToken = response.body.token;
      });
  });

  describe('getUsers', () => {
    test('getUsers', async () => {
      await request(app)
        .get('/v2/users')
        .set({ Authorization: authToken })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([
            {
              id: 'testId',
              login: 'aleksei@gmail.com',
              password: 'password123',
              age: 33,
              isDeleted: false,
            },
          ]);
        });
    });

    test('getUsers without token expect error', async () => {
      await request(app)
        .get('/v2/users')
        .expect(401)
        .then((response) => {
          expect(response.body).toEqual({ message: 'Authorization failed' });
        });
    });
  });

  describe('Create user', () => {
    test('success case', async () => {
      const newUser = {
        login: 'new-user@gmail.com',
        password: 'password123',
        isDeleted: false,
        age: 12,
      };
      await request(app)
        .post('/v2/users')
        .set({ Authorization: authToken })
        .set({ 'Content-Type': 'application/json' })
        .send(newUser)
        .expect(201)
        .then((response) => {
          expect(response.body.login).toEqual(newUser.login);
          expect(response.body.password).toEqual(newUser.password);
          expect(response.body.isDeleted).toEqual(newUser.isDeleted);
          expect(response.body.age).toEqual(newUser.age);
        });
    });

    test('invalid login', async () => {
      const newUser = {
        login: 'new user',
        password: 'password123',
        isDeleted: false,
        age: -5,
      };
      await request(app)
        .post('/v2/users')
        .set({ Authorization: authToken })
        .set({ 'Content-Type': 'application/json' })
        .send(newUser)
        .expect(400)
        .then((response) =>
          expect(response.body).toEqual({ message: '"age" must be larger than or equal to 4' })
        );
    });
  });
});

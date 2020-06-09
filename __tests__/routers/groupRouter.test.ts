import request from 'supertest';
import { GroupServiceImpl } from '../../src/services/group/group.service';
import { GroupRouter } from '../../src/routers/group.router';
import { Router } from 'express';
import { Group, InternalError, ErrorType } from '../../src/models';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { internalErrorMidleware, defaultErrorMiddleware } from '../../src/middlewares';
import { loggerService } from '../../src/configs/logger';
import GroupService from '../../src/services/group/group.interface';

jest.mock('../../src/services/group/group.service.ts');
jest.mock('../../src/configs/logger');

describe('Person router', () => {
  const id = uuidv4();
  const group: Group = {
    id: id,
    name: 'test group name',
    permissions: ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'],
  };

  let app: express.Express;
  let groupService: jest.Mocked<GroupService>;
  let groupRouter: Router;

  beforeAll(() => {
    const errorHandlers = [internalErrorMidleware, defaultErrorMiddleware(loggerService)];
    groupService = new GroupServiceImpl(jest.fn() as any, jest.fn() as any) as any;
    groupRouter = GroupRouter(groupService);
    app = express();
    app.use(express.json());
    app.use(groupRouter);
    app.use(...errorHandlers);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('get by id', () => {
    test('success case', async () => {
      //given
      groupService.getById.mockImplementationOnce(() => Promise.resolve(group));
      //when
      await request(app)
        .get('/' + id)
        .expect(200)
        .then((response) => expect(response.body).toEqual(group));
      //then
      expect(groupService.getById.mock.calls[0][0]).toEqual(id);
    });

    test('when not found exception thrown', async () => {
      //given
      groupService.getById.mockImplementationOnce(() =>
        Promise.reject(new InternalError('test', ErrorType.NOT_FOUND))
      );
      //when
      await request(app)
        .get('/' + id)
        .expect(404)
        .then((response) => expect(response.body.message).toEqual('test'));
      //then
      expect(groupService.getById.mock.calls[0][0]).toEqual(id);
    });
  });

  describe('create', () => {
    test('success case', async () => {
      //given
      groupService.create.mockImplementationOnce(() => Promise.resolve(group));
      //when
      await request(app)
        .post('/')
        .send(group)
        .expect(201)
        .then((response) => expect(response.body).toEqual(group));
      //then
      expect(groupService.create.mock.calls[0][0]).toEqual(group);
    });

    test('invalid permission specified', async () => {
      //given
      const invalidGroup = { ...group, permission: [...group.permissions, 'invalid'] };
      groupService.create.mockImplementationOnce(() => Promise.resolve(group));
      //when
      await request(app)
        .post('/')
        .send(invalidGroup)
        .expect(400)
        .then((response) => expect(response.body.message).toEqual('"permission" is not allowed'));
      //then
      expect(groupService.create).not.toHaveBeenCalled();
    });

    test('name missed', async () => {
      //given
      const invalidGroup = { ...group, name: undefined };
      groupService.create.mockImplementationOnce(() => Promise.resolve(group));
      //when
      await request(app)
        .post('/')
        .send(invalidGroup)
        .expect(400)
        .then((response) => expect(response.body.message).toEqual('"name" is required'));
      //then
      expect(groupService.create).not.toHaveBeenCalled();
    });

    test('permissions is empty', async () => {
      //given
      const invalidGroup = { ...group, permissions: [] };
      groupService.create.mockImplementationOnce(() => Promise.resolve(group));
      //when
      await request(app)
        .post('/')
        .send(invalidGroup)
        .expect(400)
        .then((response) =>
          expect(response.body.message).toEqual('"permissions" must contain at least 1 items')
        );
      //then
      expect(groupService.create).not.toHaveBeenCalled();
    });

    test('permissions contains duplicates', async () => {
      //given
      const invalidGroup = { ...group, permissions: ['READ', 'READ'] };
      groupService.create.mockImplementationOnce(() => Promise.resolve(group));
      //when
      await request(app)
        .post('/')
        .send(invalidGroup)
        .expect(400)
        .then((response) =>
          expect(response.body.message).toEqual('"permissions[1]" contains a duplicate value')
        );
      //then
      expect(groupService.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    test('success case', async () => {
      //given
      groupService.update.mockImplementationOnce(() => Promise.resolve(group));
      //when
      await request(app)
        .put('/' + id)
        .send(group)
        .expect(200)
        .then((response) => expect(response.body).toEqual(group));
      //then
      expect(groupService.update.mock.calls[0][0]).toEqual(group);
    });

    test('invalid permission specified', async () => {
      //given
      const invalidGroup = { ...group, permission: [...group.permissions, 'invalid'] };
      //when
      await request(app)
        .put('/' + id)
        .send(invalidGroup)
        .expect(400)
        .then((response) => expect(response.body.message).toEqual('"permission" is not allowed'));
      //then
      expect(groupService.update).not.toHaveBeenCalled();
    });

    test('name missed', async () => {
      //given
      const invalidGroup = { ...group, name: undefined };
      //when
      await request(app)
        .put('/' + id)
        .send(invalidGroup)
        .expect(400)
        .then((response) => expect(response.body.message).toEqual('"name" is required'));
      //then
      expect(groupService.update).not.toHaveBeenCalled();
    });

    test('permissions is empty', async () => {
      //given
      const invalidGroup = { ...group, permissions: [] };
      //when
      await request(app)
        .put('/' + id)
        .send(invalidGroup)
        .expect(400)
        .then((response) =>
          expect(response.body.message).toEqual('"permissions" must contain at least 1 items')
        );
      //then
      expect(groupService.update).not.toHaveBeenCalled();
    });

    test('permissions contains duplicates', async () => {
      //given
      const invalidGroup = { ...group, permissions: ['READ', 'READ'] };
      //when
      await request(app)
        .put('/' + id)
        .send(invalidGroup)
        .expect(400)
        .then((response) =>
          expect(response.body.message).toEqual('"permissions[1]" contains a duplicate value')
        );
      //then
      expect(groupService.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    test('success case', async () => {
      //given
      groupService.delete.mockImplementationOnce(() => Promise.resolve());
      //when
      await request(app)
        .delete('/' + id)
        .expect(200)
        .then((response) => expect(response.body).toEqual({}));
      //then
      expect(groupService.delete.mock.calls[0][0]).toEqual(id);
    });
  });

  describe('get all', () => {
    test('success case', async () => {
      //given
      groupService.getAll.mockImplementationOnce(() => Promise.resolve([group]));
      //when
      await request(app)
        .get('/')
        .expect(200)
        .then((response) => expect(response.body).toEqual([group]));
      //then
      expect(groupService.getAll).toHaveBeenCalled();
    });
  });

  describe('add users to group', () => {
    test('success case', async () => {
      //given
      const userIds = [uuidv4(), uuidv4()];
      groupService.updateUserGroupAssociation.mockImplementationOnce(() => Promise.resolve(group));
      //when
      await request(app)
        .put(`/${id}/users`)
        .send(userIds)
        .expect(200)
        .then((response) => expect(response.body).toEqual(group));
      //then
      expect(groupService.updateUserGroupAssociation.mock.calls[0][0]).toEqual(id);
      expect(groupService.updateUserGroupAssociation.mock.calls[0][1]).toEqual(userIds);
    });
  });
});
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

describe('Group router instance', () => {
  const id = uuidv4();
  const group: Group = {
    id: id,
    name: 'test group name',
    permissions: ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'],
    users: [],
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

  describe('when get by id is called', () => {
    test('should return group model', async () => {
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

    test('should return error if invalid id specified', async () => {
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

  describe('when create group operation is called', () => {
    test('should return created group', async () => {
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

    test('should return error if invalid permission specified', async () => {
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

    test('should return error if name missed', async () => {
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

    test('should return error if permissions list is empty', async () => {
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

    test('should return error if permissions list contains duplicates', async () => {
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

  describe('when update group operation is called', () => {
    test('should return updated group', async () => {
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

    test('should return error if invalid permission specified', async () => {
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

    test('should return error if name was missed', async () => {
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

    test('should return error if permissions list is empty', async () => {
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

    test('should return error if permissions list contains duplicates', async () => {
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

  describe('when delete group operation is called', () => {
    test('should remove group', async () => {
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

  describe('when get all groups operation is called', () => {
    test('should return list of groups', async () => {
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

  describe('when add users in group is called', () => {
    test('should update users-group assotication', async () => {
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

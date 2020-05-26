import { Test } from '@nestjs/testing';
import { UserRepository } from '../user.repository';
import { User } from '../user.entity';
import { UserRole } from '../user-role.enum';
import * as nestjsTypeormPaginate from 'nestjs-typeorm-paginate/index';
import { mockPaginationOptions, mockUserPaginationResult } from '../../events/tests/event-spec-helper';
import { Like } from 'typeorm';

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  const mockUser = new User();
  mockUser.email = 'email@gmail.com.br';
  mockUser.role = UserRole.REGULAR;
  mockUser.salt = 'some generated salt';
  mockUser.password = 'hashed pass';

  beforeEach(() => {
    userRepository.save = jest.fn();
    userRepository.findOneOrFail = jest.fn();
  });

  describe('persist', () => {

    it('should persist a User with success', async () => {
      userRepository.save.mockResolvedValue(mockUser);

      expect(userRepository.save).not.toHaveBeenCalled();

      const saved = await userRepository.persist(mockUser);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(saved.email).toBe(mockUser.email);
      expect(saved.role).toBe(mockUser.role);
      expect(saved.salt).toBe(mockUser.salt);
      expect(saved.password).toBe(mockUser.password);
    });

  });

  describe('findByEmail', () => {
    it('should find a User with success with given email', async () => {
      userRepository.findOneOrFail.mockResolvedValue(mockUser);

      expect(userRepository.findOneOrFail).not.toHaveBeenCalled();

      const result = await userRepository.findByEmail(mockUser.email);

      expect(userRepository.findOneOrFail).toHaveBeenCalledWith({ email: mockUser.email });
      expect(result.email).toBe(mockUser.email);
    });

  });

  describe('findUsers', () => {
    it('should return a list of users', async () => {
      const paginate = jest.spyOn(nestjsTypeormPaginate, 'paginate');
      paginate.mockResolvedValue(mockUserPaginationResult);

      expect(paginate).not.toHaveBeenCalled();

      const result = await userRepository.findUsers(mockPaginationOptions);
      expect(result).toEqual(mockUserPaginationResult);
      expect(paginate).toHaveBeenCalledWith(userRepository, mockPaginationOptions, {
        where: {
          email: Like(`%${mockPaginationOptions.search}%`),
        },
      });
    });

  });

  describe('findById', () => {
    it('should find a user', async () => {
      expect(userRepository.findOneOrFail).not.toHaveBeenCalled();

      userRepository.findOneOrFail.mockResolvedValue(mockUser);

      const result = await userRepository.findById('id0');
      expect(result).toBe(mockUser);
      expect(userRepository.findOneOrFail).toHaveBeenCalledWith('id0');
    });

  });
});

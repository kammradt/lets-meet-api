import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { RegisterRequest } from '../dtos/register-request';
import { UserRole } from '../user-role.enum';
import { User } from '../user.entity';
import { mockPaginationOptions, mockUserPaginationResult } from '../../events/tests/event-spec-helper';

const mockUserRepository = () => ({
  persist: jest.fn(),
  findByEmail: jest.fn(),
  findUsers: jest.fn(),
  findById: jest.fn(),
});

describe('UserService', () => {
  let userService;
  let userRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    userService = await module.get<UserService>(UserService);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  const mockUser = new User();
  mockUser.email = 'email@gmail.com.br';
  mockUser.role = UserRole.REGULAR;
  mockUser.salt = 'some generated salt';
  mockUser.password = 'hashed pass';

  describe('register', () => {

    beforeEach(() => {
      bcrypt.genSalt = jest.fn();
      bcrypt.hash = jest.fn();
    });

    const mockRegisterRequest: RegisterRequest = {
      email: 'email@gmail.com.br',
      password: 'password',
    };

    it('should register a user with success', async () => {
      bcrypt.genSalt.mockResolvedValue('some generated salt');
      bcrypt.hash.mockResolvedValue('hashed pass');
      userRepository.persist.mockResolvedValue(mockUser);

      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(userRepository.persist).not.toHaveBeenCalled();

      const user = await userService.register(mockRegisterRequest);
      expect(user.email).toBe(mockRegisterRequest.email);
      expect(user.role).toBe(UserRole.REGULAR);
      expect(user.salt).toBe('some generated salt');
      expect(user.password).toBe('hashed pass');
      expect(user.email).toBe(mockRegisterRequest.email);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(mockRegisterRequest.password, user.salt);
    });
  });

  describe('findByEmail', () => {
    it('should find a valid User based on email', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      expect(userRepository.findByEmail).not.toHaveBeenCalled();

      const user = await userService.findByEmail(mockUser.email);
      expect(user.email).toBe(mockUser.email);
      expect(user.role).toBe(UserRole.REGULAR);
      expect(user.salt).toBe('some generated salt');
      expect(user.password).toBe('hashed pass');
      expect(user.email).toBe(mockUser.email);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
    });
  });

  describe('find', () => {
    it('should find a list of users', async () => {
      userRepository.findUsers.mockResolvedValue(mockUserPaginationResult);

      expect(userRepository.findUsers).not.toHaveBeenCalled();

      const result = await userService.find(mockPaginationOptions);
      expect(result).toEqual(mockUserPaginationResult);
      expect(userRepository.findUsers).toHaveBeenCalledWith(mockPaginationOptions);
    });
  });


  describe('updateRole', () => {
    it('should update a users role', async () => {
      mockUser.role = UserRole.REGULAR;
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.persist.mockResolvedValue(mockUser);

      expect(userRepository.persist).not.toHaveBeenCalled();

      const result = await userService.updateRole('id', { role: UserRole.PREMIUM });
      expect(result.role).toBe(UserRole.PREMIUM);
      expect(userRepository.persist).toHaveBeenCalledWith({ ...mockUser, role: UserRole.PREMIUM });
    });
  });

});

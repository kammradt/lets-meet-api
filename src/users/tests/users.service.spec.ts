import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { RegisterRequest } from '../dtos/register-request';
import { UserRole } from '../user-role.enum';
import { User } from '../user.entity';
import { NotFoundException } from '@nestjs/common';

let mockUserRepository = () => ({
  persist: jest.fn(),
  findByEmail: jest.fn(),
});

describe('AuthService', () => {
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
      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(userRepository.persist).not.toHaveBeenCalled();

      bcrypt.genSalt.mockResolvedValue('some generated salt');
      bcrypt.hash.mockResolvedValue('hashed pass');
      userRepository.persist.mockResolvedValue(mockUser);

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
      expect(userRepository.findByEmail).not.toHaveBeenCalled();
      userRepository.findByEmail.mockResolvedValue(mockUser);

      const user = await userService.findByEmail(mockUser.email);
      expect(user.email).toBe(mockUser.email);
      expect(user.role).toBe(UserRole.REGULAR);
      expect(user.salt).toBe('some generated salt');
      expect(user.password).toBe('hashed pass');
      expect(user.email).toBe(mockUser.email);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
    });
  });

});

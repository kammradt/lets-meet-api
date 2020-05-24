import { Test } from '@nestjs/testing';
import { UserRepository } from '../user.repository';
import { User } from '../user.entity';
import { UserRole } from '../user-role.enum';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  let mockUser = new User();
  mockUser.email = 'email@gmail.com.br';
  mockUser.role = UserRole.REGULAR;
  mockUser.salt = 'some generated salt';
  mockUser.password = 'hashed pass';

  describe('persist', () => {
    beforeEach(() => {
      mockUser.save = jest.fn();
    });

    it('should persist a User with success', async () => {
      expect(mockUser.save).not.toHaveBeenCalled();

      mockUser.save = jest.fn().mockResolvedValue(mockUser);

      const saved = await userRepository.persist(mockUser);
      expect(mockUser.save).toHaveBeenCalledTimes(1);
      expect(saved.email).toBe(mockUser.email);
      expect(saved.role).toBe(mockUser.role);
      expect(saved.salt).toBe(mockUser.salt);
      expect(saved.password).toBe(mockUser.password);
    });

    it('should throw a ConflictException on repeated email', () => {
      expect(mockUser.save).not.toHaveBeenCalled();

      mockUser.save = jest.fn().mockRejectedValue({ code: '23505' });

      expect(userRepository.persist(mockUser)).rejects.toThrow(ConflictException);
      expect(mockUser.save).toHaveBeenCalledTimes(1);
    });

    it('should throw a InternalServerErrorException', () => {
      expect(mockUser.save).not.toHaveBeenCalled();

      mockUser.save = jest.fn().mockRejectedValue({ code: '999999' });

      expect(userRepository.persist(mockUser)).rejects.toThrow(InternalServerErrorException);
      expect(mockUser.save).toHaveBeenCalledTimes(1);
    });

  });

  describe('findByEmail', () => {
    it('should find a User with success with given email', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      expect(userRepository.findOne).not.toHaveBeenCalled();

      const result = await userRepository.findByEmail(mockUser.email);

      expect(userRepository.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(result.email).toBe(mockUser.email);
    });

    it('should throw a NotFoundException', () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);

      expect(userRepository.findByEmail(mockUser.email)).rejects.toThrow(NotFoundException);
    });
  });

});

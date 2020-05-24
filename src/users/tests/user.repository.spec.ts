import { Test } from '@nestjs/testing';
import { UserRepository } from '../user.repository';
import { User } from '../user.entity';
import { UserRole } from '../user-role.enum';

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

  beforeEach(() => {
    userRepository.save = jest.fn()
    userRepository.findOneOrFail = jest.fn()
  })

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

    // it('should throw a ConflictException on repeated email', () => {
    //   expect(userRepository.save).not.toHaveBeenCalled();
    //
    //   userRepository.save.mockRejectedValue({ code: '23505' });
    //
    //   expect(userRepository.persist(mockUser)).rejects.toThrow(ConflictException);
    //   expect(userRepository.save).toHaveBeenCalledTimes(1);
    // });
    // Handled by TypeORMFilter

    // it('should throw a InternalServerErrorException', () => {
    //   expect(mockUser.save).not.toHaveBeenCalled();
    //
    //   mockUser.save = jest.fn().mockRejectedValue({ code: '999999' });
    //
    //   expect(userRepository.persist(mockUser)).rejects.toThrow(InternalServerErrorException);
    //   expect(mockUser.save).toHaveBeenCalledTimes(1);
    // });
    // Handled by TypeORMFilter

  });

  describe('findByEmail', () => {
    it('should find a User with success with given email', async () => {
      userRepository.findOneOrFail.mockResolvedValue(mockUser);

      expect(userRepository.findOneOrFail).not.toHaveBeenCalled();

      const result = await userRepository.findByEmail(mockUser.email);

      expect(userRepository.findOneOrFail).toHaveBeenCalledWith({ email: mockUser.email });
      expect(result.email).toBe(mockUser.email);
    });

    // it('should throw a NotFoundException', () => {
    //   userRepository.findOne = jest.fn().mockResolvedValue(null);
    //
    //   expect(userRepository.findByEmail(mockUser.email)).rejects.toThrow(NotFoundException);
    // });
    // Handled by TypeORMFilter

  });

});

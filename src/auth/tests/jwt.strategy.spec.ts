import { Test } from '@nestjs/testing';
import { JwtStrategy } from '../jwt.strategy';
import { UserService } from '../../users/user.service';
import { User } from '../../users/user.entity';
import { JwtPayload } from '../dtos/jwt-payload';

const mockUserService = () => ({
  findByEmail: jest.fn(),
});


describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserService, useFactory: mockUserService },
      ],
    }).compile();
    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
    userService = await module.get<UserService>(UserService);
  });

  describe('validate', () => {
    const mockUser = new User();
    mockUser.email = 'email@test.com';

    const mockJwtPayload = new JwtPayload();
    mockJwtPayload.email = 'email@test.com';

    it('should return a User', async () => {
      userService.findByEmail.mockResolvedValue(mockUser);

      expect(userService.findByEmail).not.toHaveBeenCalled();

      const foundUser = await jwtStrategy.validate(mockJwtPayload);

      expect(userService.findByEmail).toHaveBeenCalledWith(mockJwtPayload.email);
      expect(foundUser.email).toBe(mockUser.email);
    });
  });

});

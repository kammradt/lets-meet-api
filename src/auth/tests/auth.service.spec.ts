import { LoginRequest } from '../dtos/login-request';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/user.entity';
import { JwtResponse } from '../dtos/jwt-response';
import { UnauthorizedException } from '@nestjs/common';


const mockUserService = () => ({
  findByEmail: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

const mockLoginRequest: LoginRequest = {
  email: 'email@test.com',
  password: '12345678',
};

describe('AuthService', () => {
  let authService;
  let userService;
  let jwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useFactory: mockUserService },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    authService = await module.get<AuthService>(AuthService);
    userService = await module.get<UserService>(UserService);
    jwtService = await module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    let user;

    beforeEach(() => {
      user = new User();
      user.email = 'email@test.com';
      user.hasCorrectPassword = jest.fn();
    });

    it('should return a JwtResponse', async () => {
      userService.findByEmail.mockResolvedValue(user);
      user.hasCorrectPassword.mockResolvedValue(true);
      jwtService.sign.mockResolvedValue('123token123');

      expect(userService.findByEmail).not.toHaveBeenCalled();
      expect(user.hasCorrectPassword).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();

      const jwtResponse: JwtResponse = await authService.login(mockLoginRequest);
      expect(jwtResponse.token).toBe('123token123');
      expect(userService.findByEmail).toHaveBeenCalledWith(mockLoginRequest.email);
      expect(user.hasCorrectPassword).toHaveBeenCalledWith(mockLoginRequest.password);
      expect(jwtService.sign).toHaveBeenCalledWith({ email: mockLoginRequest.email });
    });

    it('should throw an UnauthorizedException', () => {
      userService.findByEmail.mockResolvedValue(user);
      user.hasCorrectPassword.mockResolvedValue(false);

      expect(authService.login(mockLoginRequest)).rejects.toThrow(UnauthorizedException);
    });
  });
});

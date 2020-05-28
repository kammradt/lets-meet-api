import { User } from '../user.entity';
import * as bcrypt from 'bcryptjs';

describe('User entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.salt = 'salt';
    user.password = 'p4ssw0rd';
    bcrypt.hash = jest.fn();
  });

  describe('hasCorrectPassword', () => {
    it('should return true if password is valid', async () => {
      bcrypt.hash.mockReturnValue('p4ssw0rd');

      expect(bcrypt.hash).not.toHaveBeenCalled();

      const result = await user.hasCorrectPassword('pass');
      expect(bcrypt.hash).toHaveBeenCalledWith('pass', 'salt');
      expect(result).toBeTruthy();
    });

    it('should return false if password is invalid', async () => {
      bcrypt.hash.mockReturnValue('n0tTh3C0rr3ctP4ss');

      expect(bcrypt.hash).not.toHaveBeenCalled();

      const result = await user.hasCorrectPassword('pass');
      expect(bcrypt.hash).toHaveBeenCalledWith('pass', 'salt');
      expect(result).toBeFalsy();
    });
  });
});

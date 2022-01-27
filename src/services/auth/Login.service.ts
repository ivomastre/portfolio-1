import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import { User } from '../../entities';
import { passwordsHelper } from '../../helpers';

interface IRequest {
  email: string;
  password: string;
}

@Service()
class LoginService {
  execute = async ({ email, password }: IRequest): Promise<User> => {
    const usersRepo = getRepository(User);

    const user = await usersRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('Incorrect email/password');
    }

    const isPasswordsEqual = await passwordsHelper.compareHashs(
      user.password,
      password
    );

    if (!isPasswordsEqual) {
      throw new Error('Incorrect email/password');
    }

    return user;
  };
}

export default LoginService;
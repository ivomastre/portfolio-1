import { ObjectType, Field } from 'type-graphql';
import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import { User } from '../../entities';
import { jwtHelper, passwordsHelper } from '../../helpers';
import { LoginInputs } from '../../inputs/auth';

@ObjectType()
export class LoginResponse {
  @Field()
  user: User;

  @Field()
  token: string;
}

interface ILoginService {
  execute(data: LoginInputs): Promise<LoginResponse>;
}

@Service()
class LoginService implements ILoginService {
  execute = async ({ email, password }: LoginInputs) => {
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

    const token = jwtHelper.generateToken(user.id);

    return { user, token };
  };
}

export default LoginService;

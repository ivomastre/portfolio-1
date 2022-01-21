import { Context } from 'apollo-server-core';
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { getRepository } from 'typeorm';

import { User } from '../entities';
import { jwtHelper, passwordsHelper } from '../helpers';
import { LoginInputs, RegisterInputs } from '../inputs/auth';
import ensureUserIsAuthenticated, {
  IContext,
} from '../middlewares/ensureUserIsAuthenticated';

@ObjectType()
class AuthResponse {
  @Field()
  user: User;

  @Field()
  token: string;
}

@Resolver()
export default class AuthResolver {
  @Mutation(returns => AuthResponse)
  async login(
    @Arg('inputs') { email, password }: LoginInputs
  ): Promise<AuthResponse> {
    const user = await AuthResolver.validatePassword(email, password);

    return {
      user,
      token: jwtHelper.generateToken(user.id),
    };
  }

  @Mutation(returns => User)
  async register(
    @Arg('inputs') { email, name, password }: RegisterInputs
  ): Promise<User> {
    const usersRepo = getRepository(User);

    const user = usersRepo.create({
      name,
      email,
      password,
    });

    await usersRepo.save(user);

    return user;
  }

  @Query(returns => User)
  @UseMiddleware(ensureUserIsAuthenticated)
  async me(@Ctx() ctx: Context<IContext>): Promise<User> {
    const usersRepo = getRepository(User);

    return usersRepo.findOneOrFail(ctx.user.id);
  }

  private static async getUserByEmail(email: string): Promise<User> {
    const usersRepo = getRepository(User);

    const user = await usersRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('Incorrect email/password');
    }

    return user;
  }

  private static async validatePassword(
    email: string,
    password: string
  ): Promise<User> {
    const user = await AuthResolver.getUserByEmail(email);

    const isPasswordsEqual = await passwordsHelper.compareHashs(
      user.password,
      password
    );

    if (!isPasswordsEqual) {
      throw new Error('Incorrect email/password');
    }

    return user;
  }
}

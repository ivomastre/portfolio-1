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
import { Service } from 'typedi';

import { User } from '../entities';
import { jwtHelper } from '../helpers';
import { LoginInputs, RegisterInputs } from '../inputs/auth';
import ensureUserIsAuthenticated from '../middlewares/ensureUserIsAuthenticated';
import {
  CreateUserService,
  LoginService,
  ShowUserLoggedService,
} from '../services/auth';

@ObjectType()
class AuthResponse {
  @Field()
  user: User;

  @Field()
  token: string;
}

@Service()
@Resolver()
export default class AuthResolver {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly loginService: LoginService,
    private readonly showUserLoggedService: ShowUserLoggedService
  ) {}

  @Mutation(returns => AuthResponse)
  async login(@Arg('inputs') data: LoginInputs): Promise<AuthResponse> {
    const user = await this.loginService.execute(data);

    return {
      user,
      token: jwtHelper.generateToken(user.id),
    };
  }

  @Mutation(returns => User)
  async register(@Arg('inputs') data: RegisterInputs): Promise<User> {
    const user = await this.createUserService.execute(data);

    return user;
  }

  @Query(returns => User)
  @UseMiddleware(ensureUserIsAuthenticated)
  async me(@Ctx() ctx: Context): Promise<User> {
    const user = await this.showUserLoggedService.execute(ctx.user.id);

    return user;
  }
}

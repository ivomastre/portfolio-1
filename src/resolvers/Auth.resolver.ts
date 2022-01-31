import { Context } from 'apollo-server-core';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { Service } from 'typedi';

import { LoginInputs, RegisterInputs } from '../inputs/auth';
import ensureUserIsAuthenticated from '../middlewares/ensureUserIsAuthenticated';
import {
  CreateUserService,
  LoginService,
  ShowUserLoggedService,
} from '../services/auth';
import { CreateUserResponse } from '../services/auth/CreateUser.service';
import { LoginResponse } from '../services/auth/Login.service';
import { ShowUserLoggedResponse } from '../services/auth/ShowUserLogged.service';

@Service()
@Resolver()
export default class AuthResolver {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly loginService: LoginService,
    private readonly showUserLoggedService: ShowUserLoggedService
  ) {}

  @Mutation(returns => LoginResponse)
  async login(@Arg('inputs') data: LoginInputs): Promise<LoginResponse> {
    return this.loginService.execute(data);
  }

  @Mutation(returns => CreateUserResponse)
  async register(
    @Arg('inputs') data: RegisterInputs
  ): Promise<CreateUserResponse> {
    return this.createUserService.execute(data);
  }

  @Query(returns => ShowUserLoggedResponse)
  @UseMiddleware(ensureUserIsAuthenticated)
  async me(@Ctx() ctx: Context): Promise<ShowUserLoggedResponse> {
    return this.showUserLoggedService.execute(ctx.user.id);
  }
}

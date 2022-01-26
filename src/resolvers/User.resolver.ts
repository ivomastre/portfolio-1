import { Context } from 'apollo-server-core';
import {
  Arg,
  Resolver,
  Query,
  UseMiddleware,
  Mutation,
  Ctx,
} from 'type-graphql';
import { Service } from 'typedi';

import { User } from '../entities';
import { UpdateUserInputs } from '../inputs/user';
import ensureUserIsAuthenticated from '../middlewares/ensureUserIsAuthenticated';
import {
  FindAllUsersService,
  UpdateUserService,
  DeleteUserService,
  DeleteUserResponse,
} from '../services/users';

@Service()
@Resolver(of => User)
export class UserResolver {
  constructor(
    private readonly findAllUsersService: FindAllUsersService,
    private readonly updateUserService: UpdateUserService,
    private readonly deleteUserService: DeleteUserService
  ) {}

  @Query(returns => [User])
  @UseMiddleware(ensureUserIsAuthenticated)
  async users() {
    const users = await this.findAllUsersService.execute();

    return users;
  }

  @Mutation(returns => User)
  @UseMiddleware(ensureUserIsAuthenticated)
  async updateUser(
    @Arg('inputs') inputs: UpdateUserInputs,
    @Ctx() ctx: Context
  ) {
    const user = await this.updateUserService.execute(inputs, ctx.user.id);

    return user;
  }

  @Mutation(returns => DeleteUserResponse)
  @UseMiddleware(ensureUserIsAuthenticated)
  async deleteUser(@Ctx() ctx: Context) {
    return this.deleteUserService.execute(ctx.user.id);
  }
}

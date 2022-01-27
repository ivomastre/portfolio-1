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
import { UpdateUserResponse } from '../services/users/UpdateUser.service';

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
    return this.findAllUsersService.execute();
  }

  @Mutation(returns => UpdateUserResponse)
  @UseMiddleware(ensureUserIsAuthenticated)
  async updateUser(
    @Arg('inputs') inputs: UpdateUserInputs,
    @Ctx() ctx: Context
  ) {
    return this.updateUserService.execute(inputs, ctx.user.id);
  }

  @Mutation(returns => DeleteUserResponse)
  @UseMiddleware(ensureUserIsAuthenticated)
  async deleteUser(@Ctx() ctx: Context) {
    return this.deleteUserService.execute(ctx.user.id);
  }
}

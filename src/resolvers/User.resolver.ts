import { Context } from 'apollo-server-core';
import {
  Arg,
  Resolver,
  Query,
  UseMiddleware,
  Mutation,
  Ctx,
  Field,
  ObjectType,
} from 'type-graphql';
import { getRepository } from 'typeorm';

import { User } from '../entities';
import { UpdateUserInputs } from '../inputs/user';
import ensureUserIsAuthenticated from '../middlewares/ensureUserIsAuthenticated';

@ObjectType()
class DeleteUserResponse {
  @Field()
  ok: boolean;
}

@Resolver(of => User)
export class UserResolver {
  @Query(returns => [User])
  @UseMiddleware(ensureUserIsAuthenticated)
  async users() {
    const userRepo = getRepository(User);

    return userRepo.find();
  }

  @Mutation(returns => User)
  @UseMiddleware(ensureUserIsAuthenticated)
  async updateUser(
    @Arg('inputs') inputs: UpdateUserInputs,
    @Ctx() ctx: Context
  ) {
    const userRepo = getRepository(User);
    const user = await userRepo.findOneOrFail(ctx.user.id);

    return userRepo.save({
      ...user,
      ...inputs,
    });
  }

  @Mutation(returns => DeleteUserResponse)
  @UseMiddleware(ensureUserIsAuthenticated)
  async deleteUser(@Ctx() ctx: Context) {
    const userRepo = getRepository(User);
    const user = await userRepo.findOneOrFail(ctx.user.id);

    await userRepo.delete(user.id);
    return {
      ok: true,
    };
  }
}

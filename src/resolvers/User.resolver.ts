import {
  Resolver,
  Query,
  ResolverInterface,
  UseMiddleware,
  Arg,
  Mutation,
  Ctx,
} from "type-graphql";
import { User } from "../entities";
import { getRepository } from "typeorm";
import ensureUserIsAuthenticated, {
  IContext,
} from "../middlewares/ensureUserIsAuthenticated";
import { UpdateUserInputs } from "../inputs/user";
import { Context } from "apollo-server-core";

@Resolver((of) => User)
export class UserResolver {
  @Query((returns) => [User])
  @UseMiddleware(ensureUserIsAuthenticated)
  async users() {
    const userRepo = getRepository(User);

    return userRepo.find();
  }

  @Mutation((returns) => User)
  @UseMiddleware(ensureUserIsAuthenticated)
  async updateUser(
    @Arg("inputs") inputs: UpdateUserInputs,
    @Ctx() ctx: Context<IContext>
  ) {
    const userRepo = getRepository(User);
    const user = await userRepo.findOneOrFail(ctx.user.id);

    return userRepo.save({
      ...user,
      ...inputs,
    });
  }
}

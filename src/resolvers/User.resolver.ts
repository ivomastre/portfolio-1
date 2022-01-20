import {
  Resolver,
  Query,
  ResolverInterface,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entities";
import { getRepository } from "typeorm";
import ensureUserIsAuthenticated from "../middlewares/ensureUserIsAuthenticated";

@Resolver((of) => User)
export class UserResolver {
  @Query((returns) => [User])
  @UseMiddleware(ensureUserIsAuthenticated)
  async users() {
    const userRepo = getRepository(User);

    return userRepo.find();
  }

  @Query((returns) => [User])
  @UseMiddleware(ensureUserIsAuthenticated)
  async updateUser() {
    const userRepo = getRepository(User);

    return userRepo.find();
  }
}

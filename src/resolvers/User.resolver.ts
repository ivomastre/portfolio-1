import { Resolver, Query, ResolverInterface } from "type-graphql";
import { User } from "../entities";
import { getRepository } from "typeorm";

@Resolver((of) => User)
export class UserResolver {
  @Query((returns) => [User])
  async users() {
    const userRepo = getRepository(User);

    return userRepo.find();
  }
}

import {Arg, Args, Field, InputType, Mutation, ObjectType, Resolver, UseMiddleware } from "type-graphql";
import { getRepository } from "typeorm";
import { User } from "../entities";
import { jwtHelper, passwordsHelper } from "../helpers";
import ensureUserIsAuthenticated from "../middlewares/ensureUserIsAuthenticated";

@ObjectType()
class AuthResponse {
  @Field()
  user: User;
  @Field()
  token: string
}

@InputType()
class RegisterInputs {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  password: string;
}

@InputType()
class LoginInputs {
  @Field()
  email: string;
  @Field()
  password: string;
}

@Resolver()
export default class AuthResolver {
  @Mutation(() => AuthResponse)
  async login(@Arg("inputs") { email, password }: LoginInputs): Promise<AuthResponse> {
    const user = await AuthResolver.validatePassword(
      email,
      password
    );

    return {
      user,
      token: jwtHelper.generateToken(user.id),
    };
  };

  @Mutation(() => User)
  async register(@Arg("inputs") { email, name, password }: RegisterInputs): Promise<User> {
    const usersRepo = getRepository(User);

    const user = usersRepo.create({
      name,
      email,
      password,
    });

    await usersRepo.save(user);

    return user;
  }

  private static async getUserByEmail(email: string): Promise<User> {
    const usersRepo = getRepository(User);

    const user = await usersRepo.findOne({
      where: { email },
      select: [
        'id',
        'name',
        'email',
        'password',
        'createdAt',
      ],
    });

    if (!user) {
      throw new Error("Incorrect email/password");
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
      throw new Error("Incorrect email/password");
    }

    return user;
  }
}
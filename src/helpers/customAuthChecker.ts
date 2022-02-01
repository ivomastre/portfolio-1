import { Context } from 'apollo-server-core';
import { ResolverData, AuthChecker } from 'type-graphql';
import { getRepository } from 'typeorm';

import { jwtHelper } from '.';
import { User } from '../entities';

const customAuthChecker: AuthChecker<Context> = async (
  { context }: ResolverData<Context>,
  roles: string[]
) => {
  const authHeader = context.req.headers.authorization;
  const [, token] = authHeader.split(' ');

  const validToken = jwtHelper.verifyToken(token);

  const { sub: userId } = validToken;

  const userRepo = getRepository(User);

  const user = await userRepo.findOne(userId);

  return user?.id === userId;
};

export default customAuthChecker;

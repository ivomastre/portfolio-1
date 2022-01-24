import { Context } from 'apollo-server-core';
import { MiddlewareFn } from 'type-graphql';

import { jwtHelper } from '../helpers';

const ensureUserIsAuthenticated: MiddlewareFn<Context> = async (
  { context },
  next
) => {
  const authHeader = context.req.headers.authorization;

  if (!authHeader) {
    throw new Error('Token is missing.');
  }

  try {
    const [, token] = authHeader.split(' ');
    const validToken = jwtHelper.verifyToken(token);

    const { sub } = validToken;

    context.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new Error('Invalid token.');
  }
};

export default ensureUserIsAuthenticated;

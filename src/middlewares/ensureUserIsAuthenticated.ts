import { MiddlewareFn } from 'type-graphql';

import { jwtHelper } from '../helpers';

export interface IContext {
  req: {
    headers: {
      authorization: string;
    };
  };
  user: {
    id: string;
  };
}

const ensureUserIsAuthenticated: MiddlewareFn<IContext> = async (
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

import { MiddlewareFn } from 'type-graphql';

import { jwtHelper } from '../helpers';

const ensureUserIsAuthenticated: MiddlewareFn = async ({ context }, next) => {
  const authHeader = (context as any).req.headers.authorization;

  if (!authHeader) {
    throw new Error("Token is missing.");
  }

  try {
    const [, token] = authHeader.split(' ');
    const validToken = jwtHelper.verifyToken(token);

    const { sub } = validToken;

    (context as any).user = {
      id: sub,
    };

    return next();
  } catch {
    throw new Error("Invalid token.");
  }
};

export default ensureUserIsAuthenticated;

export declare module 'apollo-server-core' {
  type Context = {
    req: {
      headers: {
        authorization: string;
      };
    };
    user: {
      id: string;
    };
  };
}

declare module 'apollo-server-core' {
  export interface Context {
    req: {
      headers: {
        authorization: string;
      };
    };
    user: {
      id: string;
    };
  }
}

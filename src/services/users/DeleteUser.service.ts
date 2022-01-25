import { ObjectType, Field } from 'type-graphql';
import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import { User } from '../../entities';

@ObjectType()
export class DeleteUserResponse {
  @Field()
  ok: boolean;
}

interface IDeleteUserService {
  execute(userId: string): Promise<DeleteUserResponse>;
}

@Service()
class DeleteUserService implements IDeleteUserService {
  execute = async (userId: string) => {
    const userRepo = getRepository(User);
    const user = await userRepo.findOneOrFail(userId);

    await userRepo.delete(user.id);
    return {
      ok: true,
    };
  };
}

export default DeleteUserService;

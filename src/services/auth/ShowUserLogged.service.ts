import { ObjectType, Field } from 'type-graphql';
import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import { User } from '../../entities';

@ObjectType()
export class ShowUserLoggedResponse {
  @Field()
  user: User;
}

interface IShowUserLoggedService {
  execute(userId: string): Promise<ShowUserLoggedResponse>;
}
@Service()
class ShowUserLoggedService implements IShowUserLoggedService {
  execute = async (userId: string): Promise<ShowUserLoggedResponse> => {
    const usersRepo = getRepository(User);

    const user = await usersRepo.findOneOrFail(userId);

    return { user };
  };
}

export default ShowUserLoggedService;

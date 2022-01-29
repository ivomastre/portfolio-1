import { ObjectType, Field } from 'type-graphql';
import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import { User } from '../../entities';

@ObjectType()
export class FindAllUsersResponse {
  @Field(() => [User])
  users: User[];
}

interface IFindAllUsersService {
  execute(): Promise<FindAllUsersResponse>;
}

@Service()
class FindAllUsersService implements IFindAllUsersService {
  execute = async () => {
    const userRepo = getRepository(User);

    const users = await userRepo.find();
    return { users };
  };
}

export default FindAllUsersService;

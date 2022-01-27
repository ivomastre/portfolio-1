import { Field, ObjectType } from 'type-graphql';
import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import { User } from '../../entities';
import { UpdateUserInputs } from '../../inputs/user';

@ObjectType()
export class UpdateUserResponse {
  @Field(() => User)
  user: User;
}

interface IUpdateUserService {
  execute(
    inputs: UpdateUserInputs,
    userId: string
  ): Promise<UpdateUserResponse>;
}

@Service()
class UpdateUserService implements IUpdateUserService {
  execute = async (inputs: UpdateUserInputs, userId: string) => {
    const userRepo = getRepository(User);

    const user = await userRepo.findOneOrFail(userId);
    const userUpdated = await userRepo.save({
      ...user,
      ...inputs,
    }); // TODO: refactor

    return {
      user: userUpdated,
    };
  };
}

export default UpdateUserService;

import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import { User } from '../../entities';
import { UpdateUserInputs } from '../../inputs/user';

type IUpdateUserReturn = Promise<User>;

interface IUpdateUserService {
  execute(inputs: UpdateUserInputs, userId: string): IUpdateUserReturn;
}

@Service()
class UpdateUserService implements IUpdateUserService {
  execute = async (inputs: UpdateUserInputs, userId: string) => {
    const userRepo = getRepository(User);
    const user = await userRepo.findOneOrFail(userId);

    return userRepo.save({
      ...user,
      ...inputs,
    });
  };
}

export default UpdateUserService;

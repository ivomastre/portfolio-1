import { Context } from 'apollo-server-core';
import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import { User } from '../../entities';
import { UpdateUserInputs } from '../../inputs/user';

type IUpdateUserReturn = Promise<User>;

interface IUpdateUserService {
  execute(inputs: UpdateUserInputs, ctx: Context): IUpdateUserReturn;
}

@Service()
class UpdateUserService implements IUpdateUserService {
  execute = async (inputs: UpdateUserInputs, ctx: Context): Promise<User> => {
    const userRepo = getRepository(User);
    const user = await userRepo.findOneOrFail(ctx.user.id);

    return userRepo.save({
      ...user,
      ...inputs,
    });
  };
}

export default UpdateUserService;

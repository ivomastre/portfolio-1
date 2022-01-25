import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import { User } from '../../entities';

type IFindAllUsersReturn = Promise<User[]>;

interface IFindAllUsersService {
  execute(): IFindAllUsersReturn;
}

@Service()
class FindAllUsersService implements IFindAllUsersService {
  execute = async () => {
    const userRepo = getRepository(User);

    return userRepo.find();
  };
}

export default FindAllUsersService;

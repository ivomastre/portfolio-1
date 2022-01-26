import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import { User } from '../../entities';

@Service()
class ShowUserLogged {
  execute = async (userId: string): Promise<User> => {
    const usersRepo = getRepository(User);

    return usersRepo.findOneOrFail(userId);
  };
}

export default ShowUserLogged;

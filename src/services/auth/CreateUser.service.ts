import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import { User } from '../../entities';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@Service()
class CreateUserService {
  execute = async ({ name, email, password }: IRequest): Promise<User> => {
    const usersRepo = getRepository(User);

    const user = usersRepo.create({
      name,
      email,
      password,
    });

    await usersRepo.save(user);

    return user;
  };
}

export default CreateUserService;

import { ObjectType, Field } from 'type-graphql';
import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import { User } from '../../entities';
import { RegisterInputs } from '../../inputs/auth';

@ObjectType()
export class CreateUserResponse {
  @Field()
  user: User;
}

interface ICreateUserService {
  execute(data: RegisterInputs): Promise<CreateUserResponse>;
}

@Service()
class CreateUserService implements ICreateUserService {
  execute = async ({ name, email, password }: RegisterInputs) => {
    const usersRepo = getRepository(User);

    const user = usersRepo.create({
      name,
      email,
      password,
    });

    await usersRepo.save(user);

    return { user };
  };
}

export default CreateUserService;

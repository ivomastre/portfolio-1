import { InputType, Field } from 'type-graphql';

@InputType()
export default class RegisterInputs {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

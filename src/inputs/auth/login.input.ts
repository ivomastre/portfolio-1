import { InputType, Field } from 'type-graphql';

@InputType()
export default class LoginInputs {
  @Field()
  email: string;

  @Field()
  password: string;
}

import { InputType, Field } from 'type-graphql';

@InputType()
export default class UpdateUserInputs {
  @Field({ nullable: true })
  name: string;
}

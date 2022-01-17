import { ObjectType, Field, ID } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
@ObjectType({ description: "User" })
export default class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column()
  name: string;
}

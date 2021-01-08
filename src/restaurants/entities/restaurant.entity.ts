import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field((type) => Boolean)
  isVegan: boolean;

  @Column()
  @Field((type) => String)
  address: string;

  @Column()
  @Field((type) => String)
  ownersName: string;

  @Column()
  @Field((type) => String)
  categoryName: string;
}

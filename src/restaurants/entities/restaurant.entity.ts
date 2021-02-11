import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, isBoolean, IsString, Length } from 'class-validator';
import { extend } from 'joi';
import { Category } from 'src/common/entities/category.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiagnosticCategory } from 'typescript';

/*
  # @ObjecType, Field decorator로 graphql type을 만들고 있다. 
  # @Entity, Column decorator로 DB table을 만들고 있다. 
*/

// # graph의 Type은 하나만 사용할 수 있어 ObjectType과 같이 사용할 수 없다.
//  이때 isAbstract 옵션은 직접사용하지 않고 확장시켜 사용하는 의미로 설정해주면
//  ObjectType과 같이 사용할 수 있다.
// # @InputType 설정해야 dto에서 mappedType으로 사용될 수 있다.
//  하지만 OmitType constructor 3번째 args에 변경하고 싶은 Type으로 변경 가능하다.
// @InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => String, { defaultValue: '강남' })
  @Column()
  @IsString()
  address: string;

  @Field((type) => Category)
  @ManyToOne((type) => Category, (category) => category.restaurants)
  category: DiagnosticCategory;
}

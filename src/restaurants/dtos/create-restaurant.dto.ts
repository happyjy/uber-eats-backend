// data transfer object 역할

import { ArgsType, Field } from '@nestjs/graphql';

// @ArgsType()는 아래 Feild들을 분리된 argument로 정의할 수 있게 해준다.
@ArgsType()
export class CreateRestaurantDto {
  @Field((type) => String)
  name: string;
  @Field((type) => Boolean)
  isVegan: boolean;
  @Field((type) => String)
  address: string;
  @Field((type) => String)
  ownersName: string;
}

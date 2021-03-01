import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Payment } from '../entities/payment.entity';

@InputType()
export class CreatePaymentsInput extends PickType(Payment, [
  'transactionId',
  'restaurantId',
]) {}

@ObjectType()
export class CreatePaymentsOutput extends CoreEntity {}

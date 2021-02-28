import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { number } from 'joi';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { PUB_SUB, NEW_PENDING_ORDER } from 'src/common/common.constants';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/edit-order.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './orders.service';

@Resolver((of) => Order)
export class OrderResolver {
  constructor(
    private readonly ordersService: OrderService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation((returns) => CreateOrderOutput)
  @Role(['Client'])
  async createOrder(
    @AuthUser() customer: User,
    @Args('input')
    createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    console.log('### createOrderInput: ', createOrderInput);
    return this.ordersService.createOrder(customer, createOrderInput);
  }

  @Query((returns) => GetOrdersOutput)
  @Role(['Any'])
  async getOrders(
    @AuthUser() user: User,
    @Args('input') getOrdersInput: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    return this.ordersService.getOrders(user, getOrdersInput);
  }

  @Query((returns) => GetOrderOutput)
  @Role(['Any'])
  async getOrder(
    @AuthUser() user: User,
    @Args('input') getOrderInput: GetOrderInput,
  ): Promise<GetOrderOutput> {
    return this.ordersService.getOrder(user, getOrderInput);
  }

  @Mutation((returns) => EditOrderOutput)
  @Role(['Owner', 'Delivery'])
  async editOrder(
    @AuthUser() user: User,
    @Args('input') editOrderInput: EditOrderInput,
  ): Promise<EditOrderOutput> {
    return this.ordersService.editOrder(user, editOrderInput);
  }

  @Mutation((returns) => Boolean)
  async potatoReady(@Args('potatoId') potatoId: number) {
    await this.pubSub.publish('hotPotatos', {
      readyPotato: potatoId,
    });
    return true;
  }

  @Subscription((returns) => String, {
    filter: ({ readyPotato }, { potatoId }) => {
      return readyPotato === potatoId;
    },
    resolve: ({ readyPotato }) =>
      `Your potato with the id ${readyPotato} is ready!`,
  })
  @Role(['Any'])
  readyPotato(@Args('potatoId') potatoId: number, @AuthUser() user: User) {
    console.log(number, user);
    return this.pubSub.asyncIterator('hotPotatos');
  }

  @Subscription((returns) => Order, {
    // order가 만들어진 restaurant이 context.User의 restaurant인지 체크
    filter: ({ pendingOrders: { ownerId } }, _, { user }) => {
      console.log('### pendingOrders: payload, _, context: ', {
        ownerId,
        _,
        user,
      });
      return ownerId === user.id;
    },
    //Subscrioption설정에 return 값을 맞추기 위해서
    //pendingOrders trigger 하는 곳에서 payload return value가 객체 이기 때문이다. (createOrder 확인해보자)
    resolve: ({ pendingOrders: { order } }) => order,
  })
  @Role(['Owner'])
  pendingOrders() {
    return this.pubSub.asyncIterator(NEW_PENDING_ORDER);
  }
}

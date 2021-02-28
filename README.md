# Uber Eats 

The Backend of Uber Eats Clone

## User Model:
- id
- createdAt
- updatedAt

- email
- password
- role(client|owner|delivery)

## User
- Create Account
- Log In
- See Profile
- Edit Profile
- Verify Email


## Restaurants & Categories
- Edit Restaurant
- Delete Restaurant

- See Categories
- See Restaurants by Category (pagination)
- See Restaurants (pagination)
- See Restaurant

# Dish
- Create Dish
- Edit Dish
- Delete Dish

# Order
- Orders CRUD
- Orders Subscription (Owner, Customer, Delivery)
  - Pending Order(Owner) (subscription: newOrder) (trigger: createOrder(newOrder))
    : client가 음식주문을 하면
    : owner가 본인 restaurant에 새로 들어오는 order를 listening 한다.
    : owner가 order를 승인되면 "order status"를 보여줄 것이다.   
  - Order Status(Customer, Delivery, Onwer) (subscription: orderUpdate) (trigger: editOrder(orderUpdate))
    : 그렇게 되면 order가 cooking 중인게 보이게 된다. 
    : owner가 음식을 만들면 editOrder resolver를 통해서 음식이 cooked되었다고 알린다.
    : orderUpdate event를 trigger한다.
    : orderUpdate event는 client와 owner가 listening을 하고 있을 것임
    : 그런데 orderUpdate evnet가 생기고 order status가 cooked이면 
  - Pending Pickup Order(Deleivery) (subscription: orderUpdate) (trigger: editOrder(orderUpdate))
    : owner가 음식 준비 완료하고 픽업할 준비가 되면 trigger되는 subscription이다. 
    : delivery도 이 evnet를 listening할 것이고
    : 그러면 해당 order에 driver가 등록될거고 모두가 order status를 볼 수 있다.
    : customer는 order가 승인, 픽업, 요리, 배달되는 모든 과정을 볼 수 있다.
    : owner는 order가 픽업, 배달되는 과정을 본다. 
    : delivery driver는 픽업, 유저에게 배달하고 completed버튼을 누를 것임 
    : 이렇게 위와같은 설명으로 3개의 resolver를 생성할 것임
      1. owner가 restuarant에 들어오는 order를 listene하기 위한 것 
      2. customer, delivery, owner가 특정 id의 order가 update 되는걸 보기 위한 것 
      3. delivery를 위한 pening pickup order resolver임 

# Payments
- Payments (CRON)



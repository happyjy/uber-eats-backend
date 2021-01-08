LECTURE INDEX

0.4 Requirements
0.5 How to Get Help
0.6 Backend Setup
0.7 This Course Structure

1 GRAPHQL API
1.0 Apollo Server Setup
1.1 Our First Resolver
1.2 ObjectType
1.3 Arguments
1.4 InputTypes and ArgumentTypes
1.5 Validating ArgsTypes

2 DATABASE CONFIGURATION
2.0 TypeORM and PostgreSQL
2.1 MacOS Setup
2.2 Windows Setup
2.3 TypeORM Setup
2.4 Introducing ConfigService
2.5 Configuring ConfigService
2.6 Validating ConfigService

3 TYPEORM AND NEST
[ ] 3.0 Our First Entity
[ ] 3.1 Data Mapper vs Active Record
[ ] 3.2 Injecting The Repository
[ ] 3.3 Recap
[ ] 3.4 Create Restaurant
[ ] 3.5 Mapped Types
[ ] 3.6 Optional Types and Columns
[ ] 3.7 Update Restaurant part One
[ ] 3.8 Update Restaurant part Two

4 USER CRUD
4.0 User Module Introduction
4.1 User Model
4.2 User Resolver and Service
4.3 Create Account Mutation part One
4.4 Create Account Mutation part Two
4.5 Create Account Mutation part Three
4.6 An Alternative Error
4.7 Hashing Passwords
4.8 Log In part One
4.9 Log In part Two

5 USER AUTHENTICATION
5.0 Introduction to Authentication
5.1 Generating JWT
5.2 JWT and Modules
5.3 JWT Module part One
5.4 JWT Module part Two
5.5 JWT Module part Three
5.6 Middlewares in NestJS
5.7 JWT Middleware
5.8 GraphQL Context
5.9 AuthGuard
5.10 AuthUser Decorator
5.11 Recap
5.12 userProfile Mutation
5.13 updateProfile part One
5.14 updateProfile part Two
5.15 updateProfile part Three
5.16 Recap

6 EMAIL VERIFICATION
6.0 Verification Entity
6.1 Creating Verifications
6.2 Verifying User part One
6.3 Verifying User part Two
6.4 Cleaning the Code
6.5 Mailgun Setup
6.6 Mail Module Setup
6.7 Mailgun API
6.8 Beautiful Emails
6.9 Refactor

7 UNIT TESTING THE USER SERVICE
7.0 Setting Up Tests
7.1 Mocking
7.2 Mocking part Two
7.3 Writing Our First Test
7.4 Recap
7.5 createAccount Test part One
7.6 createAccount Test part Two
7.7 login Test part One
7.8 login Test part Two
7.9 findById Test
7.10 editProfile Test part One
7.11 editProfile Test part Two
7.12 verifyEmail Test
7.13 Conclusions

8 UNIT TESTING JWT AND MAIL
8.0 JWT Service Test Setup
8.1 JWT Sign Test
8.2 JWT Verify Test
8.3 sendVerificationEmail Test
8.4 sendEmail Test

9 USER MODULE E2E
9.0 Setup part One
9.1 Setup part Two
9.2 Testing createAccount part One
9.3 Testing createAccount part Two
9.4 Testing login
9.5 Testing userProfile
9.6 Testing me
9.7 Testing editProfile
9.8 Testing verifyEmail
9.9 Conclusions

10 RESTAURANT CRUD
10.0 Restaurant Models
10.1 Relationships and InputTypes
10.2 createRestaurant part One
10.3 createRestaurant part Two
10.4 Roles part One
10.5 Roles part Two
10.6 Roles Recap
10.7 Edit Restaurant part One
10.8 Edit Restaurant part Two
10.9 Edit Restaurant part Three
10.10 Edit Restaurant Testing
10.11 Delete Restaurant
10.12 Categories part One
10.13 Categories part Two
10.14 Category
10.15 Pagination
10.16 Restaurants
10.17 Restaurant and Search
10.18 Search part Two

11 DISH AND ORDER CRUD
11.0 Dish Entity
11.1 Create Dish part One
11.2 Create Dish part Two
11.3 Edit and Delete Dish
11.4 Order Entity
11.5 Create Order part One
11.6 Order Items
11.7 Create Order part Two
11.8 Create Order part Three
11.9 Create Order part Four
11.10 Create Order part Five
11.11 Create Order part Six
11.12 getOrders part One
11.13 getOrders and getOrder
11.14 Edit Order

12 ORDER SUBSCRIPTIONS
12.0 Subscriptions part One
12.1 Subscriptions part Two
12.2 Subscription Authentication part One
12.3 Subscription Authentication part Two
12.4 PUB_SUB
12.5 Subscription Filter
12.6 Subscription Resolve
12.7 pendingOrders Subscription part One
12.8 pendingOrders Subscription part Two
12.9 cookedOrders
12.10 orderUpdates part One
12.11 orderUpdates
12.12 takeOrder

13 PAYMENTS
13.0 Payment Introduction
13.1 Payment Module
13.2 createPayment part One
13.3 createPayment part Two
13.4 getPayments Resolver
13.5 Task Scheduling is Awesome
13.6 Promoting Restaurants
13.7 Promoting Restaurants part Two
13.8 Backend Conclusions

14 FRONTEND SETUP
14.0 Create React App
14.1 TailwindCSS part One
14.2 TailwindCSS part Two
14.3 Apollo Setup
14.4 React Router Dom

15 AUTHENTICATION
15.0 Local Only Fields
15.1 React Hook Form
15.2 React Hook Form part Two
15.3 Router and @types
15.4 Form Design
15.5 Form Login
15.6 Login Mutation part One
15.7 Apollo Codegen
15.8 Login Mutation
15.9 Login Mutation part Two
15.10 UI Clonning
15.11 UI Clonning part Two
15.12 Create Account Mutation
15.13 Create Account Mutation part Two
15.14 Saving the Token
15.15 Using the Token
15.16 Routers and 404s
15.17 Header part One
15.18 Header part One

16 USER PAGES
16.0 Verifying Email part One
16.1 Verifying Email part Two
16.2 Edit Profile part One
16.3 Edit Profile part Two
16.4 writeFragment vs Refetch

17 RESTAURANTS
17.0 Restaurants Query
17.1 Categories Style
17.2 Restaurants List
17.3 Restaurants Pagination
17.4 Search part One
17.5 Search part Two
17.6 Category
17.7 Code Challenge
17.8 Restaurant part One
17.9 Restaurant part Two

18 TESTING REACT COMPONENTS
18.0 Tests Setup
18.1 App Tests
18.2 Button Tests
18.3 FormError and Restaurant Tests
18.4 Testing Header and 404
18.5 Login Tests part One
18.6 Login Tests part Two
18.7 Login Tests part Three
18.8 CreateAccount Tests part One
18.9 CreateAccount Tests part Two
18.10 CreateAccount Tests part Three
18.11 Conclusions

19 E2E REACT TESTING
19.0 Installing Cypress
19.1 Our First Cypress Test
19.2 Login E2E
19.3 Create Account E2E part One
19.4 Create Account E2E part Two
19.5 Custom Commands
19.6 EditProfile E2E part One
19.7 EditProfile E2E part Two

20 OWNER DASHBOARD
20.0 Order Dashboard Routes
20.1 Create Restaurant part One
20.2 File Upload part One
20.3 File Upload part Two
20.4 Create Restaurant part Two
20.5 Cache Optimization part One
20.6 Cache Optimization part Two
20.7 Restaurant Dashboard part One
20.8 Create Dish part One
20.9 Create Dish part Two
20.10 DishOptions part One
20.11 DishOptions part Two
20.12 Dish Component
20.13 Victory Charts part One
20.14 Victory Charts part Two
20.15 Victory Charts part Three
20.16 Conclusions

21 PAYMENTS
21.0 Introduction
21.1 Paddle Product Test
21.2 Paddle Integration part One
21.3 Paddle Integration part Two

22 MAKING AN ORDER
22.0 Extending the Dish Component
22.1 Making Order part One
22.2 Making Order part Two
22.3 Making Order part Three
22.4 Making Order part Four
22.5 Making Order part Five
22.6 Making Order part Six

23 REALTIME ORDER
23.0 Order Component
23.1 Subscription Setup
23.2 subscribeToMore
23.3 Restaurant Orders
23.4 Edit Order
23.5 Driver Dashboard part One
23.6 Driver Dashboard part Two
23.7 Driver Dashboard part Three
23.8 Address Geocoding
23.9 Painting Directions
23.10 Coocked Order Subscription
23.11 Final Test!
23.12 Conclusions

24 DEPLOY TO PRODUCTION
24.0 Heroku Setup
24.1 Heroku Databases
24.2 Heroku Conclusion
24.3 Netlify
24.4 Done!
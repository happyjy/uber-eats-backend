# filetree

src
 ┣ auth
 ┣ common
 ┃ ┣ dtos
 ┃ ┣ entities
 ┣ jwt
 ┣ mail
 ┣ restaurants
 ┃ ┣ dtos
 ┃ ┣ entities
 ┣ users
 ┃ ┣ dtos
 ┃ ┣ entities
 ┣ app.module.ts  : server, db, graphql, jwt, mail, 관련 설정을 한다.
 ┣ main.ts 
 ┗ schema.gql


---

 src
 ┣ auth
 ┣ common
 ┃ ┣ dtos
 ┃ ┣ entities
 ┣ jwt
 ┣ mail
 ┣ restaurants
 ┃ ┣ dtos
 ┃ ┣ entities
 ┣ users
 ┃ ┣ dtos
 ┃ ┣ entities
 ┣ app.module.ts
 ┣ main.ts 
 ┗ schema.gql


---

 src
 ┣ auth
 ┃ ┣ auth-user.decorator.ts: decorator(resolver접근 여부)
 ┃ ┣ auth.guard.ts
 ┃ ┗ auth.module.ts
 ┣ common
 ┃ ┣ dtos
 ┃ ┃ ┗ output.dto.ts
 ┃ ┣ entities
 ┃ ┃ ┗ core.entity.ts
 ┃ ┣ common.constants.ts
 ┃ ┗ common.module.ts
 ┣ jwt
 ┃ ┣ jwt.interfaces.ts
 ┃ ┣ jwt.middleware.ts
 ┃ ┣ jwt.module.ts
 ┃ ┣ jwt.service.spec.ts
 ┃ ┗ jwt.service.ts
 ┣ mail
 ┃ ┣ mail.interfaces.ts
 ┃ ┣ mail.module.ts
 ┃ ┣ mail.service.spec.ts
 ┃ ┗ mail.service.ts
 ┣ restaurants
 ┃ ┣ dtos
 ┃ ┃ ┣ create-restaurant.dto.ts
 ┃ ┃ ┗ update-restaurant.dto.ts
 ┃ ┣ entities
 ┃ ┃ ┗ restaurant.entity.ts
 ┃ ┣ restaurants.resolver.ts
 ┃ ┣ restaurants.module.ts
 ┃ ┗ restaurants.service.ts
 ┣ users
 ┃ ┣ dtos
 ┃ ┃ ┣ create-account.dto.ts
 ┃ ┃ ┣ edit-profile.dto.ts
 ┃ ┃ ┣ login.dto.ts
 ┃ ┃ ┣ user-profile.dto.ts
 ┃ ┃ ┗ verify-email.dto.ts
 ┃ ┣ entities
 ┃ ┃ ┣ user.entity.ts
 ┃ ┃ ┗ verification.entity.ts
 ┃ ┣ .DS_Store
 ┃ ┣ users.module.ts
 ┃ ┣ users.resolver.ts
 ┃ ┣ users.service.spec.ts
 ┃ ┗ users.service.ts
 ┣ app.module.ts
 ┣ main.ts
 ┗ schema.gql
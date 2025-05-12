import { UserResolver } from "./UserResolver.js"
import { CategoryResolver } from "./CategoryResolver.js";
import { ProductResolver } from "./ProductResolver.js";
import { OrderResolver } from "./OrderResolver.js";

export const resolvers=[
      UserResolver,
      CategoryResolver,
      ProductResolver,
      OrderResolver
]
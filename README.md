# GraphQL E-commerce API

A GraphQL-based backend for managing an e-commerce platform using Apollo Server, Prisma ORM, and PostgreSQL.

##  Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file with the following content:

```
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
```

### 4. Run migrations

```bash
npx prisma migrate dev --name init
```

### 5. Start the server

```bash
npm run dev
```

Server runs at: [http://localhost:4000/graphql](http://localhost:4000/graphql)

---

##  API Documentation

###  Authentication

* **Register**: `register(email, password)`
* **Login**: `login(email, password)`
* JWT-based authentication using `Authorization: Bearer <token>` header

###  User

* `me`: Get current authenticated user
* `users`: List all users (Admin only)

###  Product

* `products`: Get all products
* `product(id: ID)`: Get single product by ID
* `createProduct(...)`: Add a product (Admin only)
* `updateProduct(...)`: Update a product (Admin only)
* `deleteProduct(...)`: Delete a product (Admin only)

###  Category

* `categories`: Get all categories
* `createCategory(...)`: Add a category (Admin only)
* `updateCategory(...)`: Update a category (Admin only)
* `deleteCategory(...)`: Delete a category (Admin only)

###  Orders

* `createOrder(items: [{productId, quantity}])`: Create a new order
* `orders`: Get current user's orders
* `updateOrderStatus(id, status)`: Update order status (Admin only)

---

##  Example Queries & Mutations

###  Register

```graphql
mutation {
  register(email: "test@example.com", password: "secret") {
    token
    user { id email }
  }
}
```

###  Login

```graphql
mutation {
  login(email: "test@example.com", password: "secret") {
    token
    user { id email }
  }
}
```

###  Create Product (Admin)

```graphql
mutation {
  createProduct(
    name: "Shirt",
    description: "Cotton shirt",
    price: 999.99,
    inventory: 10,
    categoryId: "uuid-here"
  ) {
    id
    name
  }
}
```

###  Create Order

```graphql
mutation {
  createOrder(items: [
    { productId: "uuid-1", quantity: 2 },
    { productId: "uuid-2", quantity: 1 }
  ]) {
    id
    total
    orderItems {
      product { name }
      quantity
      price
    }
  }
}
```

---

##  SQL Migration Scripts

```sql
CREATE TABLE "User" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Category" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL
);

CREATE TABLE "Product" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price FLOAT NOT NULL,
  inventory INTEGER NOT NULL,
  categoryId UUID REFERENCES "Category"(id)
);

CREATE TABLE "Order" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES "User"(id),
  status TEXT DEFAULT 'PENDING',
  total FLOAT,
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "OrderItem" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orderId UUID REFERENCES "Order"(id),
  productId UUID REFERENCES "Product"(id),
  quantity INTEGER NOT NULL,
  price FLOAT NOT NULL
);
```

---

##  Tech Stack

* Node.js
* Apollo Server (GraphQL)
* Prisma ORM
* PostgreSQL
* JWT (authentication)

---

##  Admin Access

Ensure your JWT token belongs to a user with `role: "ADMIN"` to perform admin-only operations.


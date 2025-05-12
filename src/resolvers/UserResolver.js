import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";
// import { hashPassword, comparePasswords } from "../utils/hash.js";
import { generateToken } from "../utils/auth.js";

const prisma = new PrismaClient();
console.log("ssssssssss");
export const UserResolver = {
  Query:{
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return prisma.user.findUnique({ where: { id: user.userId } });
    },
    users: async () =>{
      return prisma.user.findMany();
    }

  },
  Mutation:{
    register: async (_, { email, password, firstName, lastName }) => {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
        },
      });

      const token = generateToken(user);
      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('Invalid credentials');

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error('Invalid credentials');

      const token = generateToken(user);
      return { token, user };
    },
  },
};

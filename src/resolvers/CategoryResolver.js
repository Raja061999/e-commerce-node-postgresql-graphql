
import { PrismaClient } from '@prisma/client';
import { isAdmin } from '../middleware/auth.js';

const prisma = new PrismaClient();

export const CategoryResolver={
    Query:{
        categories: () => prisma.category.findMany(),
        category: (_, { id }) => prisma.category.findUnique({ where: { id } }),
    
    },
    Mutation:{
        createCategory: (_, { name, description }) => {
            isAdmin(user); // Middleware function to ensure user is admin

            return prisma.category.create({ data: { name, description } });
          },
          updateCategory: async (_, { id, data }, { user }) => {
            console.log(user,"reslover")
            isAdmin(user); // Middleware function to ensure user is admin
          
            try {
              const existingCategory = await prisma.category.findUnique({ where: { id } });
              if (!existingCategory) {
                throw new Error('Category not found');
              }
          
              return await prisma.category.update({
                where: { id },
                data,
              });
            } catch (error) {
              throw new Error(error.message || 'Failed to update category');
            }
          }
          
      
    }
}
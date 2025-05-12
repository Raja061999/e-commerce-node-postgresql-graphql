import { PrismaClient } from '@prisma/client';
import { isAdmin } from '../middleware/auth.js';

const prisma = new PrismaClient();


export const ProductResolver={
    Query:{
        products: () => prisma.product.findMany(),
        product: (_, { id }) => prisma.product.findUnique({ where: { id } }),
    
    },
    Mutation:{
        createProduct: async (_, { name, description, price, inventory, categoryId }) => {
            const category = await prisma.category.findUnique({ where: { id: categoryId } });
            if (!category) throw new Error('Category not found');
      
            return await prisma.product.create({
              data: { name, description, price, inventory, categoryId },
            });
          },
          updateProduct: async (_, { id, data }, { user }) => {
            isAdmin(user); // Ensure admin
        
            const existing = await prisma.product.findUnique({ where: { id } });
            if (!existing) throw new Error('Product not found');
        
            return prisma.product.update({
              where: { id },
              data,
            }); 
          },
deleteProduct: async (_, { id }, { user }) => {
  isAdmin(user); // Ensure admin
  try {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new Error('Product not found');

    const productExists = await prisma.orderItem.findFirst({ where: { productId: id } });
    if (productExists) {
      throw new Error('Cannot delete the product as it is associated with existing orders.');
    }

    return await prisma.product.delete({ where: { id } });
  } catch (error) {
    throw new Error(error.message || 'Something went wrong while deleting the product.');
  }
}
      
    }
}
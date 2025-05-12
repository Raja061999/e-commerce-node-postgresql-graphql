
import { PrismaClient } from '@prisma/client';
import { isAdmin } from '../middleware/auth.js';

const prisma = new PrismaClient();

export const OrderResolver={
    Query:{
        orders: async (_, __, { user }) => {
            if (!user) throw new Error('Not authenticated');
          
            return prisma.order.findMany({
              where: { userId: user.userId },
              include: {
                user: true, 
                orderItems: {
                  include: {
                    product: true,
                  },
                },
              },
            });
          },
            order: async (_, { id }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            return prisma.order.findUnique({
              where: { id },
              include: {
                user: true,
                orderItems: {
                  include: {
                    product: true,
                  },
                },
              },
            });
          },
    
    },
    Mutation:{
        createOrder: async (_, { data }, { user }) => {
            if (!user) throw new Error('Not authenticated');
      
            const { items } = data;
            const productIds = items.map(i => i.productId);
            const products = await prisma.product.findMany({
              where: { id: { in: productIds } },
            });
      
            const orderItems = items.map(item => {
              const product = products.find(p => p.id === item.productId);
              if (!product) throw new Error(`Product not found: ${item.productId}`);
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price * item.quantity,
              };
            });
      
            const total = orderItems.reduce((sum, item) => sum + item.price, 0);
      
            return await prisma.order.create({
              data: {
                userId: user.userId,
                total,
                orderItems: {
                  create: orderItems,
                },
              },
              include: {
                orderItems: true,
                user: true,
              },
            });
          },

          updateOrderStatus: async (_, { id, status }, { user }) => {
            isAdmin(user); // Ensures only admins can update order status
          
            try {
              const existingOrder = await prisma.order.findUnique({ where: { id } });
              if (!existingOrder) {
                throw new Error('Order not found');
              }
          
              return await prisma.order.update({
                where: { id },
                data: { status },
              });
            } catch (error) {
              throw new Error(error.message || 'Failed to update order status');
            }
          }
          
      
    }
}
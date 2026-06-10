/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { router, publicProcedure } from '../trpc';
import type { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '~/server/prisma';

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */

export const userRouter = router({
  updateUsername: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        newUsername: z.string().min(2,"Username must be at least 2 characters long").max(20,"Username must be at most 20 characters long")
      })
    )
    .mutation(async({ input }) => {
      try {
        const updatedUser = await prisma.user.update({
          where: { id: input.id },
          data: { username: input.newUsername },
        });

        return {
          success: true,
          username: updatedUser.username,
        };
      } catch (error:any){
        if (error.code === 'P2002') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Username already exists. Please choose a different one.',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update username. Please try again later.',
        });
      }
    }),
});

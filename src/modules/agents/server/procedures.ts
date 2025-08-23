import { z } from "zod";
import { db } from "@/db";
import { agents } from "@/db/schema";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { agentsInsertSchema } from "../schema";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const [existingAgent] = await db
          .select({
            ...getTableColumns(agents),
            //Todo : change to actua Count
            meetingCount: sql<number>`5`
          })
          .from(agents)
          .where(eq(agents.id, input.id));

        if (!existingAgent) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Agent not found'
          });
        }

        return existingAgent;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch agent',
          cause: error
        });
      }
    }),

  getMany: protectedProcedure
    .query(async () => {
      try {
        const data = await db
          .select()
          .from(agents);

        return data;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch agents',
          cause: error
        });
      }
    }),

  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const [createdAgent] = await db
          .insert(agents)
          .values({
            ...input,
            userId: ctx.auth.user.id,
          })
          .returning();

        if (!createdAgent) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create agent'
          });
        }

        return createdAgent;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create agent',
          cause: error
        });
      }
    }),
});
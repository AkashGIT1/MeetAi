import { z } from "zod";
import { db } from "@/db";
import { agents } from "@/db/schema";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { agentsInsertSchema } from "../schema";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const [existingAgent] = await db
          .select({
            ...getTableColumns(agents),
            //Todo : change to actua Count
            meetingCount: sql<number>`1`
          })
          .from(agents)
          .where(and(
            eq(agents.id, input.id),
            eq(agents.userId, ctx.auth.user.id),
          )
        );

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
    .input(z.object({
      page: z.number().default(DEFAULT_PAGE),
      pageSize: z
      .number()
      .min(MIN_PAGE_SIZE)
      .max(MAX_PAGE_SIZE)
      .default(DEFAULT_PAGE_SIZE),
      search: z.string().nullish(),
    })
  )
    .query(async ({ ctx, input }) => {

      const {search, page, pageSize} = input; 

      try {
        const data = await db
          .select({
             ...getTableColumns(agents),
            //Todo : change to actua Count
            meetingCount: sql<number>`1`
          })
          .from(agents)
          .where(
            and(
              eq(agents.userId, ctx.auth.user.id),
              search ? ilike(agents.name, `%${search}%`) : undefined,
            )
          )
          .orderBy(desc(agents.createdAt), desc(agents.id))
          .limit(pageSize)
          .offset((page - 1) * pageSize)

        const total = await db
          .select({
            count: count(),
          })
          .from(agents)
          .where(
            and(
              eq(agents.userId, ctx.auth.user.id),
              search ? ilike(agents.name, `%${search}%`) : undefined,
            )
          );
          
        const totalPages = Math.ceil(total[0].count / pageSize);
        return {
          items: data,
          total: total[0].count,
          totalPages,
         };
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
import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { delay } from "@/inngest/utils";
import { z } from "zod";

export const messageRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .query(async ({ input }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId
        },
        include: {
          fragment: true
        },
        orderBy: {
          updatedAt: "asc",
        },
      });

      return messages;
    }),
  create: baseProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Value is required" })
          .max(10000, { message: "Value is too long" }),
        projectId: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .mutation(async ({ input }) => {
      // await delay(1000); // 1 second rate limit delay
      const createMessage = await prisma.message.create({
        data: {
          projectId: input.projectId,
          content: input.value,
          role: "USER",
          type: "RESULT",
        },
      });

      // await delay(1000); // 1 second rate limit delay
      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: input.projectId,
        },
      });
      return createMessage;
    }),
});

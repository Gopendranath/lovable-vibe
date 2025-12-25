import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
// import { delay } from "@/inngest/utils";
import { z } from "zod";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";

export const projectsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Id is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      const existingProjects = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId
        }
      });

      if(!existingProjects) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found"})
      }

      return existingProjects;
    }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const projects = await prisma.project.findMany({
      where: {
        userId: ctx.auth.userId
      },
      orderBy: {
        updatedAt: "asc",
      },
    });

    return projects;
  }),
  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Prompt is required" })
          .max(10000, { message: "Prompt is too long" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // await delay(1000); // 1 second rate limit delay
      const createdProject = await prisma.project.create({
        data: {
          name: generateSlug(2, {
            format: "kebab",
          }),
          userId: ctx.auth.userId,
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });

      // await delay(1000); // 1 second rate limit delay
      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createdProject.id,
        },
      });

      return createdProject;
    }),
});

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Fakerator from "fakerator";
import { TRPCError } from "@trpc/server";

export const nameGeneratorRouter = createTRPCRouter({
  sendMessage: protectedProcedure.query(async () => {
    const fakerator = Fakerator("jp-JP");
    const name = fakerator.names.name();

    if (!name) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Name generation failed",
      });
    }

    return {
      name,
    };
  }),
});

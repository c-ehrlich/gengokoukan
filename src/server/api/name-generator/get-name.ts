import { protectedProcedure } from "~/server/api/trpc";
import gimei from "browser-gimei";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const getName = protectedProcedure
  .input(z.object({ gender: z.string() }))
  .query(async ({ input }) => {
    let nameObj: GimeiName;
    switch (input.gender) {
      case "male":
        nameObj = gimei.male();
        break;
      case "female":
        nameObj = gimei.female();
        break;
      case "nonbinary":
        nameObj = Math.random() > 0.5 ? gimei.male() : gimei.female();
        break;
      default:
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Invalid gender - please use 'male', 'female', or 'nonbinary'",
        });
    }

    const name = `${nameObj.kanji()}（${nameObj.hiragana()}）`;

    if (!name) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Name generation failed",
      });
    }

    return {
      name,
    };
  })

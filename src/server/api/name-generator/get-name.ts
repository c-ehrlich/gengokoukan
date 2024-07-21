import { TRPCError } from "@trpc/server";
import gimei from "browser-gimei";
import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";

export function makeGimeiName(gender: string) {
  let nameObj: GimeiName;
  switch (gender) {
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
        message: "Invalid gender - please use 'male', 'female', or 'nonbinary'",
      });
  }

  const name = `${nameObj.kanji()}（${nameObj.hiragana()}）`;

  return name;
}

export const getName = protectedProcedure
  .input(z.object({ gender: z.string() }))
  .query(async ({ input }) => {
    const name = makeGimeiName(input.gender);

    if (!name) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Name generation failed",
      });
    }

    return {
      name,
    };
  });

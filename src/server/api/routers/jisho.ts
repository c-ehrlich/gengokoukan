import { z } from "zod";

import JishoAPI from "unofficial-jisho-api";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const jishoRouter = createTRPCRouter({
  definition: protectedProcedure
    .input(z.object({ word: z.string() }))
    .query(async ({ input }) => {
      const jisho = new JishoAPI();
      const result = await jisho.searchForPhrase(input.word);
      console.log(result);
      const withoutWeirdDefinitions = result.data.filter(
        (def) => !def.slug.match(/^\d/) && !def.slug.match(/\d$/),
      );
      return withoutWeirdDefinitions;
    }),
});

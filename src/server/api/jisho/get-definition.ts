import JishoAPI from "unofficial-jisho-api";
import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";

export const getDefinition = protectedProcedure
  .input(z.object({ word: z.string() }))
  .query(async ({ input }) => {
    const jisho = new JishoAPI();
    const result = await jisho.searchForPhrase(input.word);
    const withoutWeirdDefinitions = result.data.filter(
      (def) => !def.slug.match(/^\d/) && !def.slug.match(/\d$/),
    );
    return withoutWeirdDefinitions;
  });

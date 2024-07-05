import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { vocabWordsTable } from "~/server/db/schema/vocab-words";
import { and, eq } from "drizzle-orm";

const ONE_DAY = 1000 * 60 * 60 * 24;
const SRS_MULTIPLIER = 1.8;

export const vocabRouter = createTRPCRouter({
  bumpSRS: protectedProcedure
    .input(z.object({ word: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.transaction(async (tx) => {
        const [vocabWord] = await tx
          .select()
          .from(vocabWordsTable)
          .where(
            and(
              eq(vocabWordsTable.word, input.word),
              eq(vocabWordsTable.userId, ctx.session.user.id),
            ),
          );

        if (!vocabWord) {
          const newNextDue = new Date(Date.now() + ONE_DAY * 3);
          await tx.insert(vocabWordsTable).values({
            userId: ctx.session.user.id,
            word: input.word,
            nextDue: newNextDue,
            srsLevel: 1,
          });

          return {
            type: "new",
            word: input.word,
            nextDue: newNextDue,
          };
        } else {
          const newSrsLevel = Math.max(1, vocabWord.srsLevel - 1);
          const newNextDue = new Date(
            Date.now() + ONE_DAY * SRS_MULTIPLIER ** newSrsLevel,
          );

          console.log("updated", input.word, newSrsLevel, newNextDue);

          await tx
            .update(vocabWordsTable)
            .set({
              srsLevel: newSrsLevel,
              nextDue: newNextDue,
            })
            .where(
              and(
                eq(vocabWordsTable.word, vocabWord.word),
                eq(vocabWordsTable.userId, ctx.session.user.id),
              ),
            );
          return {
            type: "updated",
            word: input.word,
            nextDue: newNextDue,
          };
        }
      });

      return res;
    }),
});

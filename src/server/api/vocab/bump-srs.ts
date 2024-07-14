import { and, eq } from "drizzle-orm";
import { type LibSQLDatabase } from "drizzle-orm/libsql";
import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import { type DBSchema } from "~/server/db";
import { dbCallWithSpan } from "~/server/db/dbCallWithSpan";
import { vocabWordsTable } from "~/server/db/schema/vocab-words";

const ONE_DAY = 1000 * 60 * 60 * 24;
const SRS_MULTIPLIER = 1.8;

/**
 * DB
 */

const bumpSRSWordTransaction = dbCallWithSpan(
  "bumpSRSWordTransaction",
  async ({
    db,
    word,
    userId,
  }: {
    db: LibSQLDatabase<DBSchema>;
    word: string;
    userId: string;
  }) => {
    return db.transaction(async (tx) => {
      const [vocabWord] = await tx
        .select()
        .from(vocabWordsTable)
        .where(
          and(
            eq(vocabWordsTable.word, word),
            eq(vocabWordsTable.userId, userId),
          ),
        );

      if (!vocabWord) {
        const newNextDue = new Date(Date.now() + ONE_DAY * 3);
        await tx.insert(vocabWordsTable).values({
          userId: userId,
          word: word,
          nextDue: newNextDue,
          srsLevel: 1,
        });

        return {
          type: "new",
          word: word,
          nextDue: newNextDue,
        };
      } else {
        const newSrsLevel = Math.max(1, vocabWord.srsLevel - 1);
        const newNextDue = new Date(
          Date.now() + ONE_DAY * SRS_MULTIPLIER ** newSrsLevel,
        );

        console.log("updated", word, newSrsLevel, newNextDue);

        await tx
          .update(vocabWordsTable)
          .set({
            srsLevel: newSrsLevel,
            nextDue: newNextDue,
          })
          .where(
            and(
              eq(vocabWordsTable.word, vocabWord.word),
              eq(vocabWordsTable.userId, userId),
            ),
          );
        return {
          type: "updated",
          word: word,
          nextDue: newNextDue,
        };
      }
    });
  },
);

/**
 * PROCEDURE
 */

export const bumpSRS = protectedProcedure
  .input(z.object({ word: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const res = await bumpSRSWordTransaction({
      db: ctx.db,
      userId: ctx.session.user.id,
      word: input.word,
    });

    return res;
  });

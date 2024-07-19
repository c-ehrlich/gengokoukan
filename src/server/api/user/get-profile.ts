import { protectedProcedure } from "../trpc";
import { type LibSQLDatabase } from "drizzle-orm/libsql";
import { type DBSchema } from "~/server/db";
import { dbCallWithSpan } from "~/server/db/dbCallWithSpan";

const getProfileQuery = dbCallWithSpan(
  "getUserProfile",
  async ({ db, userId }: { db: LibSQLDatabase<DBSchema>; userId: string }) => {
    return db.query.userProfilesTable.findFirst({
      where: (userProfilesTable, { eq }) =>
        eq(userProfilesTable.userId, userId),
    });
  },
);

export const getProfile = protectedProcedure.query(async ({ ctx }) => {
  const profile = await getProfileQuery({
    db: ctx.db,
    userId: ctx.session.user.id,
  });

  return profile;
});

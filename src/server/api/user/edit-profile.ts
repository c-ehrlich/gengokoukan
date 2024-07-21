import { protectedProcedure } from "../trpc";
import {
  createEditProfileSchema,
  type CreateEditProfileSchema,
} from "./create-profile.schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { type LibSQLDatabase } from "drizzle-orm/libsql";
import { type DBSchema } from "~/server/db";
import { dbCallWithSpan } from "~/server/db/db-call-with-span";
import { userProfilesTable } from "~/server/db/schema/user-profiles";

/**
 * DB
 */
const editProfileDb = dbCallWithSpan(
  "editProfile",
  async ({
    db,
    userId,
    profile,
  }: {
    db: LibSQLDatabase<DBSchema>;
    userId: string;
    profile: CreateEditProfileSchema;
  }) => {
    const { dob, ...rest } = profile;
    const _date = dob ? new Date(dob) : null;
    return db
      .update(userProfilesTable)
      .set({
        dob: _date,
        ...rest,
      })
      .where(eq(userProfilesTable.userId, userId))
      .returning();
  },
);

export const editProfile = protectedProcedure
  .input(createEditProfileSchema)
  .mutation(async ({ ctx, input }) => {
    const [profile] = await editProfileDb({
      db: ctx.db,
      userId: ctx.session.user.id,
      profile: input,
    });

    if (!profile) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Profile creation failed",
      });
    }

    return { profile };
  });

import { protectedProcedure } from "../trpc";
import {
  createProfileSchema,
  type CreateProfileSchema,
} from "./create-profile.schema";
import { TRPCError } from "@trpc/server";
import { type LibSQLDatabase } from "drizzle-orm/libsql";
import { type DBSchema } from "~/server/db";
import { dbCallWithSpan } from "~/server/db/db-call-with-span";
import { userProfilesTable } from "~/server/db/schema/user-profiles";

/**
 * DB
 */

const createProfileDb = dbCallWithSpan(
  "createProfile",
  async ({
    db,
    userId,
    profile,
  }: {
    db: LibSQLDatabase<DBSchema>;
    userId: string;
    profile: CreateProfileSchema;
  }) => {
    const { dob, ...rest } = profile;
    const _date = new Date(dob);
    return db
      .insert(userProfilesTable)
      .values({
        userId: userId,
        dob: _date,
        ...rest,
      })
      .returning();
  },
);

export const createProfile = protectedProcedure
  .input(createProfileSchema)
  .mutation(async ({ ctx, input }) => {
    const [profile] = await createProfileDb({
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

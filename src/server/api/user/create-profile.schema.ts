import { z } from "zod";

export const createProfileSchema = z.object({
  gender: z.enum(["male", "female", "nonbinary"]),
  dob: z.number(),
  jlptLevel: z.enum(["N1+", "N1", "N2", "N3", "N4", "N5"]),
  location: z.string(),
  interests: z.string(),
  goals: z.string(),
});
export type CreateProfileSchema = z.infer<typeof createProfileSchema>;

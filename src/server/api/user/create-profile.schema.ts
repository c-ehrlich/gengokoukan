import { z } from "zod";

export const createEditProfileSchema = z.object({
  name: z.string().min(1),
  gender: z.enum(["male", "female", "nonbinary"]),
  dob: z.date(), // convert to number for db
  jlptLevel: z.enum(["N1+", "N1", "N2", "N3", "N4", "N5"]),
  location: z.string().min(1),
  interests: z.string().min(1),
  goals: z.string().min(1),
});
export type CreateEditProfileSchema = z.infer<typeof createEditProfileSchema>;

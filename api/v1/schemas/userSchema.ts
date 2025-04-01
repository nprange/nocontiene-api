import { z } from 'zod';

export const getUserByUsernameParamsSchema = z.object({
  username: z.string().min(1),
});

export const userInputSchema = z.object({
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(75),
  username: z.string().min(3).max(30),
  email: z.string().email().max(254),
  password: z.string().max(72),
});

export type UserInputValues = z.infer<typeof userInputSchema>;

export const userSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  email: z.string(),
  created_at: z.union([
    z.date().transform(date => date.toISOString()),
    z.string().datetime(),
  ]),
  updated_at: z.union([
    z.date().transform(date => date.toISOString()),
    z.string().datetime(),
  ]),
});

export type UserSchema = z.infer<typeof userSchema>;

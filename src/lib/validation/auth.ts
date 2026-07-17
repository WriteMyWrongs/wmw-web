import { z } from "zod";

/**
 * Auth input schemas, shared by the forms and the server actions so the
 * client and server validate identically. The username rule mirrors the
 * `^[a-z0-9_]{3,24}$` check constraint on `profiles.username`.
 */

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Enter a valid email address.");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(72, "Password must be at most 72 characters.");

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(
    /^[a-z0-9_]{3,24}$/,
    "Username must be 3–24 characters: lowercase letters, numbers, or underscores.",
  );

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  displayName: z.string().trim().max(80).optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});

export const magicLinkSchema = z.object({
  email: emailSchema,
});

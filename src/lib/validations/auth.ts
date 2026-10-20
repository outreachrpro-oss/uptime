import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  organizationName: z.string().min(2).max(120).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8).max(128),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(255),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
  website: z.string().max(0).optional(), // honeypot
});

import z from "zod";

export const usernameSchema = z.string().min(3).max(20);

export const signUpSchema = z.object({
	username: usernameSchema,
	password: z.string().min(8),
	email: z.string().email(),
});

export type TSignUp = z.infer<typeof signUpSchema>;

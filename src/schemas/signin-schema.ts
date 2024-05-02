import z from "zod";

export const signInSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export type TSignIn = z.infer<typeof signInSchema>;

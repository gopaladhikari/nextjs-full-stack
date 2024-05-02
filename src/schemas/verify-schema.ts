import z from "zod";

export const verifySchema = z.object({
	code: z.string().length(6, "Must be 6 characters"),
});

export type TVerifyCode = z.infer<typeof verifySchema>;

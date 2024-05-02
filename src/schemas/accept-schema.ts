import z from "zod";

export const acceptMessageSchema = z.object({
	message: z.string().min(1),
});

export type TAcceptMessage = z.infer<typeof acceptMessageSchema>;

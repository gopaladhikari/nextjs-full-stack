import z from "zod";

export const mesageSchema = z.object({
	content: z.string().min(1),
});

export type TMessage = z.infer<typeof mesageSchema>;

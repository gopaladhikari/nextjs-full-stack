import z from "zod";

const { MONGO_URI, RESEND_API_KEY, NEXT_AUTH_SECRET, OPENAI_API_KEY, DOMAIN } =
	process.env;

const envSchema = z.object({
	mongoUri: z.string(),
	resendApiKey: z.string(),
	nextAuthSecret: z.string(),
	openAiApiKey: z.string(),
	domain: z.string(),
});

const envValidation = envSchema.safeParse({
	mongoUri: MONGO_URI,
	resendApiKey: RESEND_API_KEY,
	nextAuthSecret: NEXT_AUTH_SECRET,
	openAiApiKey: OPENAI_API_KEY,
	domain: DOMAIN,
});

if (!envValidation.success) throw new Error(envValidation.error.message);

export const env: Readonly<typeof envValidation.data> = envValidation.data;

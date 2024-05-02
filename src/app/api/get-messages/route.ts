import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import { env } from "@/conf/env";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
	apiKey: env.openAiApiKey,
});

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
	try {
		const prompt =
			"Can you suggest insightful and engaging comments for both movies and TV shows? Feel free to include reviews, critiques, analyses, or even just fun observations. Let's share some thoughts on the latest entertainment!";

		// Ask OpenAI for a streaming chat completion given the prompt
		const response = await openai.completions.create({
			model: "gpt-3.5-turbo-instruct",
			max_tokens: 400,
			stream: true,
			prompt,
		});

		// Convert the response into a friendly text-stream
		const stream = OpenAIStream(response);

		// Respond with the stream
		return new StreamingTextResponse(stream);
	} catch (error) {
		if (error instanceof OpenAI.APIError) {
			const { name, status, message, headers } = error;
			return NextResponse.json(
				{
					name,
					status,
					message,
					headers,
				},
				{ status }
			);
		} else console.error(`Error in suggest message`, error);
	}
}

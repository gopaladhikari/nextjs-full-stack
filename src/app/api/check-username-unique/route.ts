import z from "zod";
import { connectToDB } from "@/lib/db";
import { NextRequest } from "next/server";
import { User } from "@/models/user-model";
import { usernameSchema } from "@/schemas/signup-schema";

const userNameQuerySchema = z.object({
	username: usernameSchema,
});

export async function GET(req: NextRequest) {
	await connectToDB();

	try {
		const { searchParams } = new URL(req.url);
		const queryParam = { username: searchParams.get("username") };

		const isValid = userNameQuerySchema.safeParse(queryParam);

		if (!isValid.success)
			return Response.json(
				{
					sucess: false,
					message: isValid.error.message,
				},
				{
					status: 400,
				}
			);

		const { username } = isValid.data;

		const existingVerifiedUser = await User.findOne({
			username,
			isVerified: true,
		});

		if (existingVerifiedUser)
			return Response.json(
				{
					sucess: false,
					message: "Username already taken",
				},
				{
					status: 400,
				}
			);

		return Response.json(
			{
				sucess: false,
				message: "Username is availale",
			},
			{
				status: 400,
			}
		);
	} catch (error) {
		console.error(`Error checking username`, error);
		return Response.json(
			{
				sucess: false,
				message: (error as Error).message,
			},
			{
				status: 500,
			}
		);
	}
}

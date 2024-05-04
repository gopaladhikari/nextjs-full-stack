import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/user-model";
import { ApiError } from "next/dist/server/api-utils";
import { ApiResponse } from "@/types/api-response";

export async function POST(req: NextRequest) {
	await connectToDB();

	const session = await getServerSession();
	const user = session?.user;

	if (!user)
		return Response.json(
			{
				sucess: false,
				message: "Not authenticated",
			},
			{
				status: 500,
			}
		);

	const { acceptMessages } = await req.json();

	try {
		const updatedUser = await User.findByIdAndUpdate(
			user._id,
			{
				acceptMessages,
			},
			{ new: true }
		);

		if (!updatedUser)
			return Response.json(
				{
					sucess: false,
					message: "User not found",
				},
				{
					status: 401,
				}
			);

		return Response.json(
			{
				sucess: true,
				message: "User updated",
				user: updatedUser,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return Response.json(
			{
				sucess: false,
				message: (error as Error).message,
			},
			{ status: 500 }
		);
	}
}

export async function GET(req: NextRequest) {
	await connectToDB();

	const session = await getServerSession();
	const user = session?.user;

	if (!user)
		return Response.json(
			{
				sucess: false,
				message: "Not authenticated",
			},
			{
				status: 500,
			}
		);

	try {
		const foundUser = await User.findById(user._id);

		if (!foundUser)
			return Response.json(
				{
					sucess: false,
					message: "User not found",
				},
				{
					status: 401,
				}
			);

		return Response.json(
			{
				sucess: true,
				message: "User found",
				isAcceptingMessage: foundUser.isAcceptingMessage,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return Response.json(
			{
				sucess: false,
				message: (error as Error).message,
			},
			{
				status: 401,
			}
		);
	}
}

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/user-model";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: NextRequest) {
	await connectToDB();

	const user = await getCurrentUser();

	if (!user)
		return NextResponse.json(
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
			return NextResponse.json(
				{
					sucess: false,
					message: "User not found",
				},
				{
					status: 401,
				}
			);

		return NextResponse.json(
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
		return NextResponse.json(
			{
				sucess: false,
				message: (error as Error).message,
			},
			{ status: 500 }
		);
	}
}

export async function GET() {
	await connectToDB();

	const user = await getCurrentUser();

	if (!user)
		return NextResponse.json(
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
			return NextResponse.json(
				{
					sucess: false,
					message: "User not found",
				},
				{
					status: 404,
				}
			);

		return NextResponse.json(
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
		return NextResponse.json(
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

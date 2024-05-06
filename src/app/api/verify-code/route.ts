import { connectToDB } from "@/lib/db";
import { User } from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	await connectToDB();

	const { username, code } = await req.json();

	try {
		const user = await User.findOneAndUpdate(
			{
				username,
				verifyCodeExpiry: {
					$gt: new Date(),
				},
				verifyCode: code,
			},
			{
				$set: {
					isVerified: true,
				},
				$unset: {
					verifyCodeExpiry: 1,
					verifyCode: 1,
				},
			},
			{ new: true }
		);

		if (!user)
			return NextResponse.json(
				{
					message: "Invalid username, code or expired code",
					sucess: false,
				},
				{ status: 404 }
			);

		return NextResponse.json(
			{
				message: "User verified",
				sucess: true,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: (error as Error).message,
				sucess: false,
			},
			{
				status: 500,
			}
		);
	}
}

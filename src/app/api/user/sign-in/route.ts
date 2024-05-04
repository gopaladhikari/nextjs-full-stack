import { connectToDB } from "@/lib/db";
import { User } from "@/models/user-model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	await connectToDB();

	const { email, password } = await req.json();

	try {
		const user = await User.findOne({ email });

		if (!user)
			return NextResponse.json(
				{
					message: "User not found",
					sucess: false,
				},
				{ status: 404 }
			);

		if (!user.isVerified)
			return NextResponse.json(
				{
					message: "User not verified",
					sucess: false,
				},
				{ status: 401 }
			);

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch)
			return NextResponse.json(
				{
					message: "Invalid email or password",
					sucess: false,
				},
				{ status: 401 }
			);

		return NextResponse.json(
			{
				message: "Logged in successfully",
				sucess: true,
				data: user,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: "Something went wrong",
				sucess: false,
			},
			{ status: 500 }
		);
	}
}

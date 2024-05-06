import { connectToDB } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/sendMail";
import { User } from "@/models/user-model";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	await connectToDB();

	try {
		const { username, email, password } = await req.json();

		const existedVerifiedUser = await User.findOne({
			username,
			isVerified: true,
		});

		if (existedVerifiedUser)
			return NextResponse.json(
				{
					message: "username already exist",
					sucess: false,
				},
				{ status: 409 }
			);

		const existedUserByEmail = await User.findOne({ email });

		if (existedUserByEmail) {
			if (existedUserByEmail.isVerified)
				return NextResponse.json(
					{
						message: "User already exist",
						sucess: false,
					},
					{ status: 409 }
				);
			else {
				const hasedPassword = await bcrypt.hash(password, 12);
				const expiryDate = new Date();
				expiryDate.setHours(expiryDate.getHours() + 1);
				const verifyCode = Math.floor(Math.random() * 1000000).toString();
				const updatedUser = await User.findOneAndUpdate(
					{ email },
					{
						password: hasedPassword,
						verifyCodeExpiry: expiryDate,
						verifyCode,
					}
				);

				if (!updatedUser)
					return NextResponse.json(
						{
							message: "Failed to update user",
							success: false,
						},
						{ status: 500 }
					);

				const emailInfo = await sendVerificationEmail(
					email,
					username,
					verifyCode
				);

				if (!emailInfo.sucess) {
					User.findByIdAndDelete(updatedUser._id);
					return NextResponse.json(
						{
							message: emailInfo.message,
							success: false,
						},
						{ status: 500 }
					);
				}

				return NextResponse.json(
					{
						message: emailInfo.message,
						success: true,
					},
					{ status: 200 }
				);
			}
		} else {
			const hasedPassword = await bcrypt.hash(password, 12);
			const expiryDate = new Date();
			expiryDate.setHours(expiryDate.getHours() + 1);
			const verifyCode = Math.floor(Math.random() * 1000000).toString();

			const newUser = await User.create({
				username,
				email,
				password: hasedPassword,
				verifyCodeExpiry: expiryDate,
				verifyCode,
			});

			if (!newUser)
				return NextResponse.json(
					{
						message: "Failed to create user",
						success: false,
					},
					{ status: 500 }
				);

			const emailInfo = await sendVerificationEmail(
				email,
				username,
				verifyCode
			);

			if (!emailInfo.sucess) {
				User.findByIdAndDelete(newUser._id);
				return NextResponse.json(
					{
						message: emailInfo.message,
						success: false,
					},
					{ status: 500 }
				);
			}

			console.log("emailInfo", emailInfo);

			return NextResponse.json(
				{
					message: "User created sucessfully. Please verify your email.",
					success: true,
				},
				{ status: 201 }
			);
		}
	} catch (error) {
		console.error(`Error creating user: ${error}`);
		return NextResponse.json(
			{
				message: (error as Error).message || "Failed to create user",
				success: false,
			},
			{ status: 500 }
		);
	}
}

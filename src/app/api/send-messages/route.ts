import { connectToDB } from "@/lib/db";
import { Message, User } from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	await connectToDB();
	const { username, content } = await request.json();

	try {
		const user = await User.findOne({ username }).exec();

		if (!user) {
			return NextResponse.json(
				{ message: "User not found", success: false },
				{ status: 404 }
			);
		}

		if (!user.isAcceptingMessage) {
			return NextResponse.json(
				{ message: "User is not accepting messages", success: false },
				{ status: 403 } // 403 Forbidden status
			);
		}

		const newMessage = { content, createdAt: new Date() };

		// Push the new message to the user's messages array
		user.messages.push(newMessage as Message);
		await user.save();

		return NextResponse.json(
			{ message: "Message sent successfully", success: true },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error adding message:", error);
		return NextResponse.json(
			{ message: "Internal server error", success: false },
			{ status: 500 }
		);
	}
}

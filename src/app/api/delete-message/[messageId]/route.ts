import { connectToDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { User } from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";

interface Params {
	params?: {
		messageId?: string;
	};
}

export async function DELETE(req: NextRequest, { params }: Params) {
	const messageId = params?.messageId;

	if (!messageId)
		return NextResponse.json(
			{ message: "Invalid params", success: false },
			{ status: 400 }
		);

	await connectToDB();

	const user = await getCurrentUser();

	try {
		const updatedUser = await User.updateOne(
			{ _id: user?._id },
			{
				$pull: {
					messages: {
						_id: params.messageId,
					},
				},
			}
		);

		if (updatedUser.modifiedCount === 0)
			return NextResponse.json(
				{ message: "Message not found", success: false },
				{ status: 404 }
			);

		return NextResponse.json(
			{ message: "Message deleted", success: true },
			{
				status: 200,
			}
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Error deleting message", success: false },
			{ status: 500 }
		);
	}
}

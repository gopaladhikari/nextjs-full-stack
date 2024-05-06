import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "@/models/user-model";
import { connectToDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	await connectToDB();
	const session = await getServerSession(authOptions);
	const _user = session?.user;

	if (!session || !_user) {
		return NextResponse.json(
			{ success: false, message: "Not authenticated" },
			{ status: 401 }
		);
	}
	const userId = new mongoose.Types.ObjectId(_user._id);
	try {
		const user = await User.aggregate([
			{ $match: { _id: userId } },
			{ $unwind: "$messages" },
			{ $sort: { "messages.createdAt": -1 } },
			{ $group: { _id: "$_id", messages: { $push: "$messages" } } },
		]).exec();

		if (!user || user.length === 0) {
			return NextResponse.json(
				{ message: "User not found", success: false },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ messages: user[0].messages },
			{
				status: 200,
			}
		);
	} catch (error) {
		console.error("An unexpected error occurred:", error);
		return NextResponse.json(
			{ message: "Internal server error", success: false },
			{ status: 500 }
		);
	}
}

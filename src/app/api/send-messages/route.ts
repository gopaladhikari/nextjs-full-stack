import { connectToDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { User } from "@/models/user-model";

export async function GET() {
	await connectToDB();
	const session = await getServerSession();

	const user = session?.user;

	if (!user)
		return Response.json(
			{ message: "Unauthorized" },
			{
				status: 401,
			}
		);

	const userId = new mongoose.Types.ObjectId(user._id);

	try {
		const aggregatedUser = await User.aggregate([
			{ $match: { id: userId } },
			{
				$unwind: "$messages",
			},
			{
				$sort: { "$messages.createdAt": -1 },
			},
			{
				$group: { _id: "$_id", messages: { $push: "$messages" } },
			},
		]);

		if (aggregatedUser.length === 0) {
			return Response.json(
				{ message: "No messages found" },
				{
					status: 404,
				}
			);
		}

		return Response.json(
			{
				messages: aggregatedUser[0].messages,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return Response.json(
			{ message: (error as Error).message },
			{
				status: 500,
			}
		);
	}
}

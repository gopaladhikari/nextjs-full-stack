import { env } from "@/conf/env";
import mongoose from "mongoose";

type ConnectionObject = {
	isConnected?: number;
};

const connection: ConnectionObject = {};

export async function connectToDB(): Promise<void> {
	if (connection.isConnected) {
		console.log("Already connected");
		return;
	}

	try {
		const conn = await mongoose.connect(`${env.mongoUri}/nextjs-full-stack`);
		connection.isConnected = conn.connections[0].readyState;
		console.log("Connected to DB", conn.connections[0].readyState);
	} catch (error) {
		console.error(`MongoDB connection failed: ${error}`);
		throw new Error("MongoDB connection failed");
	}
}

import { Schema, model, Document, models, Model } from "mongoose";

export interface Message extends Document {
	content: string;
	createdAt: Date;
}

export interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	isVerified: boolean;
	verifyCode: string;
	verifyCodeExpiry: Date;
	isAcceptingMessage: boolean;
	messages: Message[];
}

const messageSchema: Schema<Message> = new Schema({
	content: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const userSchema: Schema<IUser> = new Schema(
	{
		username: {
			type: String,
			required: [true, "Username is required"],
			unique: true,
			trim: true,
		},

		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			trim: true,
			match: [/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi, "Invalid email"],
		},

		password: {
			type: String,
			required: [true, "Password is required"],
			trim: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		verifyCode: {
			type: String,
			required: [true, "Verify code is required"],
			trim: true,
		},

		verifyCodeExpiry: {
			type: Date,
			required: [true, "Verify code expiry is required"],
		},

		isAcceptingMessage: {
			type: Boolean,
			default: true,
		},

		messages: [messageSchema],
	},
	{
		timestamps: true,
	}
);

const User = (models.User as Model<IUser>) || model<IUser>("User", userSchema);

export { User };

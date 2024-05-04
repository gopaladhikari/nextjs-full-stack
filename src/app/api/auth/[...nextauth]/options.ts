import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/db";
import { env } from "@/conf/env";
import { User } from "@/models/user-model";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "example@email.com",
				},
				password: {
					label: "Password",
					type: "password",
					placeholder: "********",
				},
			},

			async authorize(credentials): Promise<any> {
				await connectToDB();

				if (!credentials?.email || !credentials?.password)
					throw new Error("Email and password is required.");

				try {
					const user = await User.findOne({ email: credentials?.email });

					if (!user) throw new Error("No user found with this email.");

					if (!user.isVerified) throw new Error("Please verify your account.");

					const isPasswordCorrect = await bcrypt.compare(
						credentials.password,
						user.password
					);

					if (!isPasswordCorrect) throw new Error("Invalid email or password.");

					return user;
				} catch (error) {
					throw new Error((error as Error).message);
				}
			},
		}),
	],

	pages: {
		signIn: "/sign-in",
	},

	session: {
		strategy: "jwt",
	},

	callbacks: {
		async session({ session, token }) {
			if (session && session.user) {
				session.user._id = token._id?.toString();
				session.user.username = token.username;
				session.user.isVerified = token.isVerified;
				session.user.isAcceptingMessage = token.isAcceptingMessage;
			}
			return session;
		},
		async jwt({ token, user }) {
			if (user) {
				token._id = user?._id;
				token.isVerified = user?.isVerified;
				token.username = user?.username;
				token.isAcceptingMessage = user?.isAcceptingMessage;
			}
			return token;
		},
	},

	secret: env.nextAuthSecret,
};

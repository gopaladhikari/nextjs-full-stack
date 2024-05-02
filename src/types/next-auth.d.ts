import "next-auth";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface User {
		_id?: string;
		isVerified?: boolean;
		isAcceptingMessage?: boolean;
		username?: stirng;
	}

	interface Session {
		user?: {
			_id?: string;
			isVerified?: boolean;
			isAcceptingMessage?: boolean;
			username?: stirng;
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		_id?: string;
		isVerified?: boolean;
		isAcceptingMessage?: boolean;
		username?: stirng;
	}
}

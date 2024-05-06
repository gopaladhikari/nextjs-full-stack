import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export const getCurrentUser = async () => {
	const session = await getServerSession(authOptions);
	return session?.user;
};

import { Message } from "@/models/user-model";

export interface ApiResponse {
	sucess: boolean;
	message: string;
	isAcceptingMessage?: boolean;
	messages?: Array<Message>;
}

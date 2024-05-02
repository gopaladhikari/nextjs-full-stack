import { env } from "@/conf/env";
import { Resend } from "resend";
import { EmailVerificationCodeTemplate } from "../../emails/email-verification-code";

const resend = new Resend(env.resendApiKey);

export async function sendVerificationEmail(
	email: string,
	username: string,
	otp: string
) {
	try {
		const data = await resend.emails.send({
			from: "onboarding@resend.dev",
			to: email,
			subject: "Hello world",
			react: EmailVerificationCodeTemplate({ username, otp }),
		});

		return {
			sucess: true,
			message: "Verification email send sucessfully.",
		};
	} catch (error) {
		console.error(`Error sending verification email: ${error}`);

		return {
			sucess: false,
			message: "Error sending verification email",
		};
	}
}

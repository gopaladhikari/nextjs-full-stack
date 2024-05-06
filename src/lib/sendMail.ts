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
		const res = await resend.emails.send({
			from: "onboarding@resend.dev",
			to: email,
			subject: "Verify you email",
			react: EmailVerificationCodeTemplate({ username, otp }),
		});

		if (res.data)
			return {
				sucess: true,
				message: "Verification email send sucessfully.",
			};

		return {
			sucess: false,
			message: res.error?.message ?? "Error sending verification email",
		};
	} catch (error) {
		console.error(`Error sending verification email: ${error}`);

		return {
			sucess: false,
			message: "Error sending verification email",
		};
	}
}

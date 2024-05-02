import { Html } from "@react-email/html";
import {
	Head,
	Font,
	Preview,
	Heading,
	Row,
	Section,
	Link,
	Text,
} from "@react-email/components";

type Props = {
	username: string;
	otp: string;
};

export function EmailVerificationCodeTemplate({ username, otp }: Props) {
	return (
		<Html lang="en" dir="ltr">
			<Head>
				<title>Verification Code</title>
				<Font
					fontFamily="Roboto"
					fallbackFontFamily="Verdana"
					webFont={{
						url: "https://fonts.googleapis.com/css?family=Roboto",
						format: "woff2",
					}}
					fontWeight={400}
					fontStyle="normal"
				/>
			</Head>

			<Preview>Here&apos;s you verification code: {otp}</Preview>

			<Section>
				<Row>
					<Heading as="h2">Hello {username}</Heading>
				</Row>
				<Row>
					<Text>
						Thank you for registering.Please use code to complete your
						registration.
					</Text>
				</Row>
				<Row>
					<Text>{otp}</Text>
				</Row>

				<Row>
					<Text>
						If you did not requested this code, please ignore this email.
					</Text>
				</Row>

				<Row>
					<Link href={`https://localhost:3000/verify/${otp}`}>
						Click here to verify user
					</Link>
				</Row>
			</Section>
		</Html>
	);
}

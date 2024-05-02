import type { Metadata } from "next";
// import { Poppins } from "next/font/google";
import { AuthProvider } from "@/context/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

// const poppins = Poppins({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
	title: "Nextjs full stack application",
	description: "Nextjs full stack messagin app powered by AI",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<AuthProvider>
				<body className="font-sans">
					<main className="antialiased container">{children}</main>
					<Toaster />
				</body>
			</AuthProvider>
		</html>
	);
}

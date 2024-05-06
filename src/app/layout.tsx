import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AuthProvider } from "@/context/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

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
		<html lang="en" className="dark" suppressHydrationWarning>
			<AuthProvider>
				<body className={poppins.className} suppressHydrationWarning>
					<Navbar />
					<main className="antialiased container">{children}</main>
					<Toaster />
				</body>
			</AuthProvider>
		</html>
	);
}

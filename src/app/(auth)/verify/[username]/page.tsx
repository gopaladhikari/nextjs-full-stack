"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TVerifyCode, verifySchema } from "@/schemas/verify-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ApiError } from "@/types/api-error";

interface Props {
	params?: {
		username?: string;
	};
}

export default function Page({ params }: Props) {
	const { toast } = useToast();
	if (!params?.username) redirect("/sign-up");

	const router = useRouter();

	const form = useForm<TVerifyCode>({
		resolver: zodResolver(verifySchema),
	});

	const onSubmit: SubmitHandler<TVerifyCode> = async (data) => {
		try {
			const res = await axios.post("/api/verify-code", {
				code: data.code,
				username: params.username,
			});

			if (res.data) {
				toast({ title: "Success", description: res.data.message });
				router.replace("/sign-in");
			}
		} catch (error) {
			const axiosError = error as AxiosError<ApiError>;
			toast({
				variant: "destructive",
				title: "Verification failed",
				description:
					axiosError.response?.data.message ?? "Something went wrong",
			});
		}
	};

	return (
		<main>
			<section className="max-w-sm mx-auto border mt-16 rounded-md p-4">
				<h1 className="text-3xl font-bold text-center p-4">Sign up</h1>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="code"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Code</FormLabel>
									<FormControl>
										<Input
											placeholder="Your code"
											inputMode="numeric"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
								</>
							) : (
								"Submit"
							)}
						</Button>
					</form>
				</Form>
			</section>
		</main>
	);
}

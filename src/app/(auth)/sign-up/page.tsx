"use client";

import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import { ApiError } from "@/types/api-error";
import { signUpSchema, TSignUp } from "@/schemas/signup-schema";
import { ApiResponse } from "@/types/api-response";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { CircleCheck, Loader2, Ban } from "lucide-react";

export default function Page() {
	const [isChecking, setIsChecking] = useState(false);
	const [usernameError, setUsernameError] = useState("");
	const [username, setUsername] = useState("");
	const [usernameMessage, setUsernameMessage] = useState("");
	const [isClient, setIsClient] = useState(false);

	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<TSignUp>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	const debounced = useDebounceCallback(setUsername, 500);

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		const checkUnique = async () => {
			setUsernameError("");
			setUsernameMessage("");
			if (username) {
				setIsChecking(true);
				setUsernameError("");
				try {
					const res = await axios.get<ApiResponse>(
						`/api/check-username-unique?username=${username}`
					);

					setUsernameMessage(res.data.message);
				} catch (error) {
					const axiosError = error as AxiosError<ApiError>;
					setUsernameError(
						axiosError.response?.data.message ?? "Something went wrong"
					);
				} finally {
					setIsChecking(false);
				}
			}
		};

		checkUnique();
	}, [username]);

	const onSubmit: SubmitHandler<TSignUp> = async (data) => {
		try {
			const res = await axios.post("/api/user/sign-up", data);
			toast({
				title: "Success",
				description: res.data.message,
			});
			router.replace(`/verify/${data.username}`);
		} catch (error) {
			const axiosError = error as AxiosError<ApiError>;
			toast({
				variant: "destructive",
				title: "Signup failed",
				description:
					axiosError.response?.data.message ?? "Something went wrong",
			});
		} finally {
			setIsChecking(false);
		}
	};

	if (!isClient) return null;

	return (
		<section className="max-w-sm mx-auto border mt-16 rounded-md p-4">
			<h1 className="text-3xl font-bold text-center p-4">Sign up</h1>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input
										placeholder="Your username"
										{...field}
										onChange={(e) => {
											field.onChange(e);
											debounced(e.target.value);
										}}
									/>
								</FormControl>
								{isChecking && <Loader2 className="w-4 h-4 animate-spin" />}
								<>
									{usernameError && (
										<p className="text-destructive text-sm flex gap-2 items-center">
											<Ban size={16} className="mt-1" /> {username} username is
											not available
										</p>
									)}

									{usernameMessage && (
										<p className="text-emerald-400 text-sm flex gap-2 items-center">
											<CircleCheck size={16} className="mt-1" />
											{username} {usernameMessage.toLowerCase()}
										</p>
									)}
								</>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="Your email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="Your password"
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
							"Sign up"
						)}
					</Button>
				</form>
			</Form>
		</section>
	);
}

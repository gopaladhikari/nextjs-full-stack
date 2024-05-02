"use client";

import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { signInSchema, TSignIn } from "@/schemas/signin-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { ApiError } from "@/types/api-error";

export default function Page() {
	const [isChecking, setIsChecking] = useState(false);
	const [usernameError, setUsernameError] = useState("");
	const [usernameMessage, setUsernameMessage] = useState("");

	const form = useForm<TSignIn>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const [debouncedValue, setValue] = useDebounceValue(form.watch("email"), 500);

	useEffect(() => {
		const checkUnique = async () => {
			if (debouncedValue) {
				setIsChecking(true);
				setUsernameError("");
				try {
					const res = await axios.get(
						`/api/check-username-unique?username=${debouncedValue}`
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
	}, [debouncedValue]);

	async function onSubmit(values: TSignIn) {
		console.log(values);
	}

	return (
		<main>
			<h1 className="text-3xl font-bold text-center p-4">Sign in</h1>
			<p>Debounced value: {debouncedValue}</p>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="Your email" {...field} />
								</FormControl>
								<FormDescription>
									This is your public display name.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input placeholder="Your password" {...field} />
								</FormControl>
								<FormDescription>
									This is your public display name.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</main>
	);
}

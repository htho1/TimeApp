"use client";

import ky from "ky";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

import { authToken } from "../lib/stores";

async function makeAuthRequest(username: string, pswd: string) {
	const res = await ky.post("http://localhost:8080/auth", {headers: {
		username: username,
		pswd: pswd
	}});

	return res.text();
}

async function makeRegisterRequest(username: string, pswd: string) {
	const res = await ky.post("http://localhost:8080/register", {headers: {
		username: username,
		pswd: pswd
	}});

	return res.text();
}

const FormSchema = z.object({
	username: z.string(),
	pswd: z.string()
});

export default function LoginForm({ isSignUp }: { isSignUp: boolean }) {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			username: "",
			pswd: ""
		}
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		if (isSignUp) {
			makeRegisterRequest(data.username, data.pswd).then(
				(res) => {
					if (res === "Done.") {
						makeAuthRequest(data.username, data.pswd).then(
							(res) => {
								if (res === "ErrHashFail") {
									alert("Failed to log in: incorrect password");
								} else if (res === "ErrNoDocuments") {
									alert("Failed to log in: no users exist. Maybe create an account?");
								} else if (res === "ErrAlreadyAuthed") {
									alert("This user is already logged in somewhere else");
								} else {
									authToken.setState({ token: res });
									sessionStorage.setItem("auth_token", res);
									console.log(res);
								}
							}
						)
					}
				}
			);
		} else {
			makeAuthRequest(data.username, data.pswd).then(
				(res) => {
					if (res === "ErrHashFail") {
						alert("Failed to log in: incorrect password");
					} else if (res === "ErrNoDocuments") {
						alert("Failed to log in: no users exist. Maybe create an account?");
					} else if (res === "ErrAlreadyAuthed") {
						alert("This user is already logged in somewhere else");
					} else {
						authToken.setState({ token: res });
						sessionStorage.setItem("auth_token", res);
						console.log(res);
					}
				}
			);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="pb-1">
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input placeholder="Username" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="pswd"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input type="password" placeholder="Password" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<div className="flex items-center justify-center pt-4">
					<div className="pr-1"><AlertDialogCancel>Cancel</AlertDialogCancel></div>
					<AlertDialogAction asChild><Button type="submit">{isSignUp ? "Sign up" : "Log in"}</Button></AlertDialogAction>
				</div>
			</form>
		</Form>
	);
}
"use client";

import Header from "@/components/header";
import LoginForm from "@/components/login-form";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {	
	const [signUpDialogOpen, signUpDialogSetOpen] = useState(false);
	const [logInDialogOpen, logInDialogSetOpen] = useState(false);

	return (
		<div className="h-screen flex items-center justify-center">
			<div className="flex-wrap">
				<div className="pb-4">
					<Header text="TimeApp" />
				</div>

				<div className="flex items-center justify-center">
					<div className="pr-1">
						<AlertDialog open={signUpDialogOpen} onOpenChange={signUpDialogSetOpen}>
							<AlertDialogTrigger asChild>
								<Button>Sign up</Button>
							</AlertDialogTrigger>
								<AlertDialogContent className="max-w-sm">
									<AlertDialogHeader className="flex items-center justify-center">
										<AlertDialogTitle>Sign up</AlertDialogTitle>
										<AlertDialogDescription className="text-center">
											Already have an account? You can log in <a href="#"
											className="text-sky-600 underline"
											onClick={
												(event) => {
													event.stopPropagation();
													signUpDialogSetOpen(false);
													logInDialogSetOpen(true);
												}
											}>here</a>.
										</AlertDialogDescription>
									</AlertDialogHeader>

									<div className="flex items-center justify-center">
										<AlertDialogFooter>
											<LoginForm isSignUp={true} />
										</AlertDialogFooter>
									</div>
								</AlertDialogContent>
						</AlertDialog>
					</div>

					<div className="pl-1">
						<AlertDialog open={logInDialogOpen} onOpenChange={logInDialogSetOpen}>
							<AlertDialogTrigger asChild>
								<Button variant="outline">Log in</Button>
							</AlertDialogTrigger>
							<AlertDialogContent className="max-w-sm">
								<AlertDialogHeader className="flex items-center justify-center">
									<AlertDialogTitle>Log in</AlertDialogTitle>
									<AlertDialogDescription className="text-center">
										Don't have an account? Make one <a href="#"
										className="text-sky-600 underline"
										onClick={
											(event) => {
												event.stopPropagation();
												logInDialogSetOpen(false);
												signUpDialogSetOpen(true);
											}
										}>here!</a>
									</AlertDialogDescription>
								</AlertDialogHeader>

								<div className="flex items-center justify-center">
										<AlertDialogFooter>
											<LoginForm isSignUp={false} />
										</AlertDialogFooter>
									</div>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
			</div>
		</div>
	);
}

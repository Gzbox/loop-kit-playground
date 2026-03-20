import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("ErrorBoundary caught:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex min-h-svh items-center justify-center p-4">
					<Card className="w-full max-w-md">
						<CardHeader className="text-center">
							<div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
								<AlertTriangle className="size-6" />
							</div>
							<CardTitle>Something went wrong</CardTitle>
							<CardDescription>
								An unexpected error occurred. Please try again.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{this.state.error && (
								<pre className="overflow-auto rounded-md bg-muted p-3 text-xs text-muted-foreground">
									{this.state.error.message}
								</pre>
							)}
							<Button
								className="w-full"
								onClick={() => {
									this.setState({ hasError: false, error: null });
									window.location.href = "/";
								}}
							>
								Go to Dashboard
							</Button>
						</CardContent>
					</Card>
				</div>
			);
		}

		return this.props.children;
	}
}

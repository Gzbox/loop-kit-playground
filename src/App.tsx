import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

function App() {
	return (
		<div className="flex min-h-svh items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Admin System</CardTitle>
					<CardDescription>
						shadcn/ui components initialized successfully.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button className="w-full">Get Started</Button>
				</CardContent>
			</Card>
		</div>
	);
}

export default App;

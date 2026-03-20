import { AppLayout } from "@/components/layout/app-layout";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

function App() {
	return (
		<AppLayout breadcrumbs={[{ label: "Dashboard" }]}>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader>
						<CardDescription>Total Users</CardDescription>
						<CardTitle className="text-2xl">1,284</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground">
							+12% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Revenue</CardDescription>
						<CardTitle className="text-2xl">¥45,231</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground">
							+8.2% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Active Orders</CardDescription>
						<CardTitle className="text-2xl">573</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground">
							+3.1% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Conversion</CardDescription>
						<CardTitle className="text-2xl">2.4%</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-xs text-muted-foreground">
							+0.3% from last month
						</p>
					</CardContent>
				</Card>
			</div>
		</AppLayout>
	);
}

export default App;

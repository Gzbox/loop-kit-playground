import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users")({
	component: UsersPage,
});

const mockUsers = [
	{
		id: 1,
		name: "Zhang Wei",
		email: "zhangwei@example.com",
		role: "Admin",
		status: "Active",
	},
	{
		id: 2,
		name: "Li Na",
		email: "lina@example.com",
		role: "Editor",
		status: "Active",
	},
	{
		id: 3,
		name: "Wang Fang",
		email: "wangfang@example.com",
		role: "Viewer",
		status: "Inactive",
	},
	{
		id: 4,
		name: "Chen Ming",
		email: "chenming@example.com",
		role: "Editor",
		status: "Active",
	},
	{
		id: 5,
		name: "Liu Yang",
		email: "liuyang@example.com",
		role: "Admin",
		status: "Active",
	},
];

function UsersPage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">User Management</h1>
					<p className="text-muted-foreground">
						Manage your team members and their roles.
					</p>
				</div>
				<Button>Add User</Button>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>All Users</CardTitle>
					<CardDescription>
						A list of all users in your organization.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{mockUsers.map((user) => (
								<TableRow key={user.id}>
									<TableCell className="font-medium">{user.name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										<Badge
											variant={user.role === "Admin" ? "default" : "secondary"}
										>
											{user.role}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge
											variant={
												user.status === "Active" ? "outline" : "secondary"
											}
										>
											{user.status}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}

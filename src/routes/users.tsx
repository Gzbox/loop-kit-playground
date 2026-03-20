import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export const Route = createFileRoute("/users")({
	component: UsersPage,
});

interface User {
	id: number;
	name: string;
	email: string;
	role: "Admin" | "Editor" | "Viewer";
	status: "Active" | "Inactive";
}

const initialUsers: User[] = [
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

const userSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	role: z.enum(["Admin", "Editor", "Viewer"]),
});

type UserFormData = z.infer<typeof userSchema>;

function UsersPage() {
	const { t } = useTranslation();
	const [users, setUsers] = useState<User[]>(initialUsers);
	const [search, setSearch] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [deleteId, setDeleteId] = useState<number | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm<UserFormData>({
		resolver: zodResolver(userSchema),
		defaultValues: { name: "", email: "", role: "Viewer" },
	});

	const filteredUsers = users.filter(
		(u) =>
			u.name.toLowerCase().includes(search.toLowerCase()) ||
			u.email.toLowerCase().includes(search.toLowerCase()),
	);

	const onSubmit = (data: UserFormData) => {
		const newUser: User = {
			id: Math.max(0, ...users.map((u) => u.id)) + 1,
			...data,
			status: "Active",
		};
		setUsers((prev) => [...prev, newUser]);
		reset();
		setDialogOpen(false);
	};

	const handleDelete = (id: number) => {
		setUsers((prev) => prev.filter((u) => u.id !== id));
		setDeleteId(null);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						{t("users.title")}
					</h1>
					<p className="text-muted-foreground">{t("users.subtitle")}</p>
				</div>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 size-4" />
							{t("users.addUser")}
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{t("users.addUser")}</DialogTitle>
							<DialogDescription>
								Add a new team member to your organization.
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="grid gap-2">
								<Label htmlFor="user-name">{t("users.name")}</Label>
								<Input
									id="user-name"
									placeholder="Full name"
									{...register("name")}
								/>
								{errors.name && (
									<p className="text-xs text-destructive">
										{errors.name.message}
									</p>
								)}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="user-email">{t("users.email")}</Label>
								<Input
									id="user-email"
									type="email"
									placeholder="email@example.com"
									{...register("email")}
								/>
								{errors.email && (
									<p className="text-xs text-destructive">
										{errors.email.message}
									</p>
								)}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="user-role">{t("users.role")}</Label>
								<Select
									defaultValue="Viewer"
									onValueChange={(val) =>
										setValue("role", val as UserFormData["role"])
									}
								>
									<SelectTrigger id="user-role">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Admin">Admin</SelectItem>
										<SelectItem value="Editor">Editor</SelectItem>
										<SelectItem value="Viewer">Viewer</SelectItem>
									</SelectContent>
								</Select>
								{errors.role && (
									<p className="text-xs text-destructive">
										{errors.role.message}
									</p>
								)}
							</div>
							<DialogFooter>
								<Button type="submit">{t("common.add")}</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>{t("users.allUsersTitle")}</CardTitle>
							<CardDescription>
								{t("users.allUsersDescription")}
							</CardDescription>
						</div>
						<div className="relative w-64">
							<Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
							<Input
								placeholder={t("common.search")}
								className="pl-8"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t("users.name")}</TableHead>
								<TableHead>{t("users.email")}</TableHead>
								<TableHead>{t("users.role")}</TableHead>
								<TableHead>{t("users.status")}</TableHead>
								<TableHead className="w-12" />
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredUsers.map((user) => (
								<TableRow key={user.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar className="size-8">
												<AvatarFallback className="text-xs">
													{user.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<span className="font-medium">{user.name}</span>
										</div>
									</TableCell>
									<TableCell className="text-muted-foreground">
										{user.email}
									</TableCell>
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
											className={
												user.status === "Active"
													? "border-emerald-500 text-emerald-600"
													: ""
											}
										>
											{user.status}
										</Badge>
									</TableCell>
									<TableCell>
										<Dialog
											open={deleteId === user.id}
											onOpenChange={(open) =>
												setDeleteId(open ? user.id : null)
											}
										>
											<DialogTrigger asChild>
												<Button variant="ghost" size="icon">
													<Trash2 className="size-4 text-muted-foreground" />
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>{t("common.delete")}</DialogTitle>
													<DialogDescription>
														Are you sure you want to delete {user.name}? This
														action cannot be undone.
													</DialogDescription>
												</DialogHeader>
												<DialogFooter>
													<Button
														variant="outline"
														onClick={() => setDeleteId(null)}
													>
														{t("common.cancel")}
													</Button>
													<Button
														variant="destructive"
														onClick={() => handleDelete(user.id)}
													>
														{t("common.delete")}
													</Button>
												</DialogFooter>
											</DialogContent>
										</Dialog>
									</TableCell>
								</TableRow>
							))}
							{filteredUsers.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={5}
										className="text-center text-muted-foreground py-8"
									>
										No users found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}

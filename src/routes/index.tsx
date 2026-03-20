import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import {
	Activity,
	ArrowDownRight,
	ArrowUpRight,
	DollarSign,
	ShoppingCart,
	TrendingUp,
	Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

export const Route = createFileRoute("/")({
	component: DashboardPage,
});

const revenueData = [
	{ month: "Jan", revenue: 18600 },
	{ month: "Feb", revenue: 22400 },
	{ month: "Mar", revenue: 19800 },
	{ month: "Apr", revenue: 28200 },
	{ month: "May", revenue: 32100 },
	{ month: "Jun", revenue: 38500 },
	{ month: "Jul", revenue: 35200 },
];

const userGrowthData = [
	{ month: "Jan", users: 820 },
	{ month: "Feb", users: 932 },
	{ month: "Mar", users: 1024 },
	{ month: "Apr", users: 1098 },
	{ month: "May", users: 1167 },
	{ month: "Jun", users: 1220 },
	{ month: "Jul", users: 1284 },
];

const activityFeed = [
	{
		id: 1,
		user: "Zhang Wei",
		action: "created a new order",
		time: "2 min ago",
		avatar: "ZW",
	},
	{
		id: 2,
		user: "Li Na",
		action: "updated user profile",
		time: "15 min ago",
		avatar: "LN",
	},
	{
		id: 3,
		user: "Wang Fang",
		action: "deleted inactive account",
		time: "1 hour ago",
		avatar: "WF",
	},
	{
		id: 4,
		user: "Chen Ming",
		action: "exported analytics report",
		time: "2 hours ago",
		avatar: "CM",
	},
	{
		id: 5,
		user: "Liu Yang",
		action: "changed system settings",
		time: "3 hours ago",
		avatar: "LY",
	},
];

interface StatCardProps {
	title: string;
	value: string;
	change: number;
	icon: React.ReactNode;
}

function StatCard({ title, value, change, icon }: StatCardProps) {
	const isPositive = change >= 0;
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardDescription className="text-sm font-medium">
					{title}
				</CardDescription>
				<div className="text-muted-foreground">{icon}</div>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				<div className="flex items-center gap-1 pt-1">
					{isPositive ? (
						<ArrowUpRight className="size-4 text-emerald-500" />
					) : (
						<ArrowDownRight className="size-4 text-red-500" />
					)}
					<span
						className={`text-xs font-medium ${isPositive ? "text-emerald-500" : "text-red-500"}`}
					>
						{isPositive ? "+" : ""}
						{change}%
					</span>
					<span className="text-xs text-muted-foreground">vs last month</span>
				</div>
			</CardContent>
		</Card>
	);
}

function DashboardPage() {
	const { t } = useTranslation();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">
					{t("dashboard.title")}
				</h1>
				<p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title={t("dashboard.totalUsers")}
					value="1,284"
					change={12}
					icon={<Users className="size-4" />}
				/>
				<StatCard
					title={t("dashboard.revenue")}
					value="¥45,231"
					change={8.2}
					icon={<DollarSign className="size-4" />}
				/>
				<StatCard
					title={t("dashboard.activeOrders")}
					value="573"
					change={3.1}
					icon={<ShoppingCart className="size-4" />}
				/>
				<StatCard
					title={t("dashboard.conversion")}
					value="2.4%"
					change={0.3}
					icon={<TrendingUp className="size-4" />}
				/>
			</div>

			{/* Charts */}
			<Tabs defaultValue="revenue" className="space-y-4">
				<TabsList>
					<TabsTrigger value="revenue">
						<DollarSign className="mr-1 size-4" />
						{t("dashboard.revenue")}
					</TabsTrigger>
					<TabsTrigger value="users">
						<Users className="mr-1 size-4" />
						{t("dashboard.totalUsers")}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="revenue">
					<Card>
						<CardHeader>
							<CardTitle>{t("dashboard.revenue")}</CardTitle>
							<CardDescription>
								Monthly revenue for the current year
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={300}>
								<AreaChart data={revenueData}>
									<defs>
										<linearGradient
											id="revenueFill"
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop
												offset="5%"
												stopColor="hsl(var(--primary))"
												stopOpacity={0.3}
											/>
											<stop
												offset="95%"
												stopColor="hsl(var(--primary))"
												stopOpacity={0}
											/>
										</linearGradient>
									</defs>
									<CartesianGrid
										strokeDasharray="3 3"
										className="stroke-border"
									/>
									<XAxis
										dataKey="month"
										className="text-xs"
										tick={{ fill: "hsl(var(--muted-foreground))" }}
									/>
									<YAxis
										className="text-xs"
										tick={{ fill: "hsl(var(--muted-foreground))" }}
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: "hsl(var(--card))",
											border: "1px solid hsl(var(--border))",
											borderRadius: "var(--radius)",
											color: "hsl(var(--card-foreground))",
										}}
									/>
									<Area
										type="monotone"
										dataKey="revenue"
										stroke="hsl(var(--primary))"
										fill="url(#revenueFill)"
										strokeWidth={2}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="users">
					<Card>
						<CardHeader>
							<CardTitle>{t("dashboard.totalUsers")}</CardTitle>
							<CardDescription>User growth over time</CardDescription>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={userGrowthData}>
									<CartesianGrid
										strokeDasharray="3 3"
										className="stroke-border"
									/>
									<XAxis
										dataKey="month"
										className="text-xs"
										tick={{ fill: "hsl(var(--muted-foreground))" }}
									/>
									<YAxis
										className="text-xs"
										tick={{ fill: "hsl(var(--muted-foreground))" }}
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: "hsl(var(--card))",
											border: "1px solid hsl(var(--border))",
											borderRadius: "var(--radius)",
											color: "hsl(var(--card-foreground))",
										}}
									/>
									<Bar
										dataKey="users"
										fill="hsl(var(--primary))"
										radius={[4, 4, 0, 0]}
									/>
								</BarChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Activity Feed */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<Activity className="size-4" />
						<CardTitle>Recent Activity</CardTitle>
					</div>
					<CardDescription>Latest actions across the system</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-1">
						{activityFeed.map((item, index) => (
							<div key={item.id}>
								<div className="flex items-center gap-3 py-3">
									<Avatar className="size-8">
										<AvatarFallback className="text-xs">
											{item.avatar}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 space-y-0.5">
										<p className="text-sm">
											<span className="font-medium">{item.user}</span>{" "}
											{item.action}
										</p>
										<p className="text-xs text-muted-foreground">{item.time}</p>
									</div>
									<Badge variant="outline" className="text-xs">
										Event
									</Badge>
								</div>
								{index < activityFeed.length - 1 && <Separator />}
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

import { Link } from "@tanstack/react-router";
import {
	ChevronRight,
	Home,
	LayoutDashboard,
	type LucideIcon,
	Settings,
	Users,
} from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

interface NavItem {
	title: string;
	url: string;
	icon?: LucideIcon;
	isActive?: boolean;
	items?: { title: string; url: string }[];
}

const navMain: NavItem[] = [
	{
		title: "Dashboard",
		url: "/",
		icon: Home,
	},
	{
		title: "User Management",
		url: "/users",
		icon: Users,
		items: [
			{ title: "All Users", url: "/users" },
			{ title: "Roles", url: "/users" },
		],
	},
	{
		title: "Settings",
		url: "/settings",
		icon: Settings,
		items: [
			{ title: "Profile", url: "/settings" },
			{ title: "Preferences", url: "/settings" },
		],
	},
];

export function AppSidebar() {
	return (
		<Sidebar collapsible="icon" variant="sidebar">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link to="/">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
									<LayoutDashboard className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">Admin System</span>
									<span className="truncate text-xs text-muted-foreground">
										Management Console
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navMain.map((item) =>
								item.items ? (
									<Collapsible
										key={item.title}
										asChild
										defaultOpen={item.isActive}
										className="group/collapsible"
									>
										<SidebarMenuItem>
											<CollapsibleTrigger asChild>
												<SidebarMenuButton tooltip={item.title}>
													{item.icon && <item.icon />}
													<span>{item.title}</span>
													<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
												</SidebarMenuButton>
											</CollapsibleTrigger>
											<CollapsibleContent>
												<SidebarMenuSub>
													{item.items.map((sub) => (
														<SidebarMenuSubItem key={sub.title}>
															<SidebarMenuSubButton asChild>
																<Link to={sub.url}>
																	<span>{sub.title}</span>
																</Link>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													))}
												</SidebarMenuSub>
											</CollapsibleContent>
										</SidebarMenuItem>
									</Collapsible>
								) : (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild tooltip={item.title}>
											<Link to={item.url}>
												{item.icon && <item.icon />}
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								),
							)}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg">
							<div className="flex aspect-square size-8 items-center justify-center rounded-full bg-muted">
								<Users className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">Admin User</span>
								<span className="truncate text-xs text-muted-foreground">
									admin@example.com
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}

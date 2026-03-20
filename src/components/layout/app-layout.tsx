import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

interface AppLayoutProps {
	children: React.ReactNode;
	breadcrumbs?: { label: string; href?: string }[];
}

export function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
	return (
		<TooltipProvider>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<AppHeader breadcrumbs={breadcrumbs} />
					<main className="flex-1 overflow-auto p-4">{children}</main>
				</SidebarInset>
			</SidebarProvider>
		</TooltipProvider>
	);
}

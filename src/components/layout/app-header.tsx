import { PanelLeft } from "lucide-react";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

interface AppHeaderProps {
	breadcrumbs?: { label: string; href?: string }[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
	return (
		<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
			<SidebarTrigger className="-ml-1">
				<PanelLeft className="size-4" />
				<span className="sr-only">Toggle sidebar</span>
			</SidebarTrigger>
			<Separator orientation="vertical" className="mr-2 h-4!" />
			<Breadcrumb>
				<BreadcrumbList>
					{breadcrumbs.map((crumb, index) => {
						const isLast = index === breadcrumbs.length - 1;
						return (
							<span key={crumb.label} className="contents">
								{index > 0 && <BreadcrumbSeparator />}
								<BreadcrumbItem>
									{isLast || !crumb.href ? (
										<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
									) : (
										<BreadcrumbLink href={crumb.href}>
											{crumb.label}
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
							</span>
						);
					})}
				</BreadcrumbList>
			</Breadcrumb>
			<div className="ml-auto flex items-center gap-1">
				<LanguageSwitcher />
				<ThemeToggle />
			</div>
		</header>
	);
}

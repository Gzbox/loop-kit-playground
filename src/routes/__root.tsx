import { AppLayout } from "@/components/layout/app-layout";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	);
}

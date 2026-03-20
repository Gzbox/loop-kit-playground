import { AppLayout } from "@/components/layout/app-layout";
import { useAuthStore } from "@/stores/auth";
import { Outlet, createRootRoute, redirect } from "@tanstack/react-router";

export const Route = createRootRoute({
	beforeLoad: ({ location }) => {
		const { isAuthenticated } = useAuthStore.getState();
		if (!isAuthenticated && location.pathname !== "/login") {
			throw redirect({ to: "/login" });
		}
	},
	component: RootComponent,
});

function RootComponent() {
	const { isAuthenticated } = useAuthStore.getState();

	if (!isAuthenticated) {
		return <Outlet />;
	}

	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	);
}

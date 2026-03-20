import { ErrorBoundary } from "@/components/error-boundary";
import { AppLayout } from "@/components/layout/app-layout";
import { Toaster } from "@/components/ui/sonner";
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
		return (
			<ErrorBoundary>
				<Outlet />
				<Toaster richColors closeButton position="top-right" />
			</ErrorBoundary>
		);
	}

	return (
		<ErrorBoundary>
			<AppLayout>
				<Outlet />
			</AppLayout>
			<Toaster richColors closeButton position="top-right" />
		</ErrorBoundary>
	);
}

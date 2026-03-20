import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
	id: string;
	name: string;
	email: string;
	role: "admin" | "editor" | "viewer";
}

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
}

// Mock API delay
const mockLogin = async (
	email: string,
	_password: string,
): Promise<{ user: User; token: string }> => {
	await new Promise((resolve) => setTimeout(resolve, 800));
	if (email === "admin@example.com") {
		return {
			user: {
				id: "1",
				name: "Admin",
				email: "admin@example.com",
				role: "admin",
			},
			token: "mock-jwt-token-admin",
		};
	}
	throw new Error("Invalid credentials");
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			token: null,
			isAuthenticated: false,
			login: async (email: string, password: string) => {
				const { user, token } = await mockLogin(email, password);
				set({ user, token, isAuthenticated: true });
			},
			logout: () => {
				set({ user: null, token: null, isAuthenticated: false });
			},
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({
				user: state.user,
				token: state.token,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);

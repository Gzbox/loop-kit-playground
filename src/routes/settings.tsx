import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
});

const profileSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	bio: z.string().max(200, "Bio must be 200 characters or less").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function SettingsPage() {
	const { t, i18n } = useTranslation();
	const user = useAuthStore((s) => s.user);
	const { theme, setTheme } = useThemeStore();

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: user?.name ?? "",
			email: user?.email ?? "",
			bio: "",
		},
	});

	const onSubmit = (_data: ProfileFormData) => {
		toast.success("Profile updated successfully!");
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">
					{t("settings.title")}
				</h1>
				<p className="text-muted-foreground">{t("settings.subtitle")}</p>
			</div>
			<Separator />

			<Tabs defaultValue="profile" className="space-y-4">
				<TabsList>
					<TabsTrigger value="profile">{t("nav.profile")}</TabsTrigger>
					<TabsTrigger value="preferences">{t("nav.preferences")}</TabsTrigger>
				</TabsList>

				<TabsContent value="profile">
					<Card>
						<CardHeader>
							<CardTitle>{t("settings.profileTitle")}</CardTitle>
							<CardDescription>
								{t("settings.profileDescription")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={handleSubmit(onSubmit)}
								className="max-w-md space-y-4"
							>
								<div className="grid gap-2">
									<Label htmlFor="profile-name">
										{t("settings.nameLabel")}
									</Label>
									<Input
										id="profile-name"
										placeholder={t("settings.namePlaceholder")}
										{...register("name")}
									/>
									{errors.name && (
										<p className="text-xs text-destructive">
											{errors.name.message}
										</p>
									)}
								</div>
								<div className="grid gap-2">
									<Label htmlFor="profile-email">
										{t("settings.emailLabel")}
									</Label>
									<Input
										id="profile-email"
										type="email"
										placeholder={t("settings.emailPlaceholder")}
										{...register("email")}
									/>
									{errors.email && (
										<p className="text-xs text-destructive">
											{errors.email.message}
										</p>
									)}
								</div>
								<div className="grid gap-2">
									<Label htmlFor="profile-bio">Bio</Label>
									<Textarea
										id="profile-bio"
										placeholder="Tell us about yourself"
										className="resize-none"
										rows={3}
										{...register("bio")}
									/>
									{errors.bio && (
										<p className="text-xs text-destructive">
											{errors.bio.message}
										</p>
									)}
								</div>
								<Button type="submit" disabled={!isDirty}>
									{t("common.save")}
								</Button>
							</form>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="preferences">
					<div className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Appearance</CardTitle>
								<CardDescription>
									Customize the look and feel of the application.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Theme</Label>
										<p className="text-xs text-muted-foreground">
											Select your preferred theme
										</p>
									</div>
									<Select
										value={theme}
										onValueChange={(val) =>
											setTheme(val as "light" | "dark" | "system")
										}
									>
										<SelectTrigger className="w-32">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="light">Light</SelectItem>
											<SelectItem value="dark">Dark</SelectItem>
											<SelectItem value="system">System</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Language</CardTitle>
								<CardDescription>
									Choose your preferred language.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Language / 语言</Label>
										<p className="text-xs text-muted-foreground">
											Interface language
										</p>
									</div>
									<Select
										value={i18n.language}
										onValueChange={(val) => {
											i18n.changeLanguage(val);
											localStorage.setItem("language", val);
										}}
									>
										<SelectTrigger className="w-32">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="zh-CN">中文</SelectItem>
											<SelectItem value="en-US">English</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Notifications</CardTitle>
								<CardDescription>
									Manage your notification preferences.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Email notifications</Label>
										<p className="text-xs text-muted-foreground">
											Receive email about account activity
										</p>
									</div>
									<Switch defaultChecked />
								</div>
								<Separator />
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>System notifications</Label>
										<p className="text-xs text-muted-foreground">
											Browser push notifications
										</p>
									</div>
									<Switch />
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}

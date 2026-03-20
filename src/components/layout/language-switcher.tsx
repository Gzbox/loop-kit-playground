import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

const languages = [
	{ code: "zh-CN", label: "中文" },
	{ code: "en-US", label: "EN" },
] as const;

export function LanguageSwitcher() {
	const { i18n } = useTranslation();

	const currentIndex = languages.findIndex((l) => l.code === i18n.language);
	const nextLang = languages[(currentIndex + 1) % languages.length];

	const toggleLanguage = () => {
		i18n.changeLanguage(nextLang.code);
		localStorage.setItem("language", nextLang.code);
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleLanguage}
			title={`Switch to ${nextLang.label}`}
		>
			<Languages className="size-4" />
			<span className="sr-only">Switch language</span>
		</Button>
	);
}

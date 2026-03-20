import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enUS from "./en-US.json";
import zhCN from "./zh-CN.json";

const savedLanguage = localStorage.getItem("language") ?? "zh-CN";

i18n.use(initReactI18next).init({
	resources: {
		"en-US": { translation: enUS },
		"zh-CN": { translation: zhCN },
	},
	lng: savedLanguage,
	fallbackLng: "zh-CN",
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;

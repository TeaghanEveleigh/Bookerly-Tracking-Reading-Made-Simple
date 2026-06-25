import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../assets/locales/en/translations.json";
import es from "../assets/locales/es/translations.json";

export const defaultNS = "translation";

export const resources = {
	en: {
		translation: en,
	},
	es: {
		translation: es,
	},
} as const;

void i18n.use(initReactI18next).init({
	defaultNS,
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
	lng: "en",
	resources,
});

export default i18n;

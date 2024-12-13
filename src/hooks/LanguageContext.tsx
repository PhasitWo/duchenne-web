import { useContext, createContext, type PropsWithChildren, useState, Fragment } from "react";
import dict from "../dictionary";
import type { Dict } from "../dictionary";

export type Language = "th" | "en";
type TranslateType = (token: string) => string;

const LanguageContext = createContext<{ currentLang: Language; setCurrentLang: Function; translate: TranslateType }>({
    currentLang: "th",
    setCurrentLang: () => null,
    translate: () => "Out of language context provider",
});

export function useLanguage() {
    const val = useContext(LanguageContext);
    return val;
}
export function LanguageProvider({ children }: PropsWithChildren) {
    const [currentLang, setCurrentLang] = useState<Language>("th");

    const translate: TranslateType = (token) => dict[currentLang as keyof Dict][token] ?? "NO TOKEN FOUND IN DICTIONARY";

    return (
        <LanguageContext.Provider value={{ currentLang: currentLang, setCurrentLang: setCurrentLang, translate: translate }}>
            {children}
        </LanguageContext.Provider>
    );
}
export function Translate({ token }: { token: string }) {
    const { currentLang } = useLanguage();
    return <Fragment>{dict[currentLang as keyof Dict][token] ?? "NO TOKEN FOUND IN DICTIONARY"}</Fragment>;
}

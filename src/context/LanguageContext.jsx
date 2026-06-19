import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getTranslation, LANGUAGES } from "../i18n/translations";

const LanguageContext = createContext(null);
const STORAGE_KEY = "dv-language";

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem(STORAGE_KEY) || "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === "ur" ? "ur" : lang === "roman" ? "ur-Latn" : "en";
    
    // 🟢 FIXED: Urdu select hone par bhi direction ko hamesha "ltr" rakha hai
    // Is se dots, brackets, aur sliders kabhi apni jagah se nahi hilenge aur layout sahi rahega
    document.documentElement.dir = "ltr"; 
  }, [lang]);

  const t = (key) => getTranslation(lang, key);

  const value = useMemo(() => ({ lang, setLang, t, languages: LANGUAGES }), [lang]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
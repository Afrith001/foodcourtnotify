import { useTheme } from "@/hooks/useTheme";
import i18n from "@/lib/i18n";
import { Languages, Sun, Moon, Settings as SettingsIcon, LogOut, UtensilsCrossed } from "lucide-react";
import { useShop } from "@/hooks/useShop";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { useNavigate } from "@tanstack/react-router";

export function TopBar() {
  const { shop } = useShop();
  const navigate = useNavigate();
  const { theme, toggle: toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut(getFirebaseAuth());
    navigate({ to: "/auth" });
  };

  const toggleLanguage = () => {
    const currentLang = i18n.language || "en";
    const nextLang = currentLang.startsWith("ta") ? "en" : "ta";
    i18n.changeLanguage(nextLang);
  };

  if (!shop) return null;

  const currentLangLabel = (i18n.language || "en").startsWith("ta") ? "தமிழ்" : "EN";

  return (
    <header className="h-20 border-b border-[#d8b46b]/50 bg-[linear-gradient(135deg,_rgba(255,250,243,0.98),_rgba(243,228,200,0.95))] flex items-center justify-between px-6 sticky top-0 z-40 select-none backdrop-blur">
      {/* Left: Logo & Restaurant Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#efe0c6] border border-[#d8b46b]/70 flex items-center justify-center shadow-sm">
          <UtensilsCrossed className="w-5 h-5 text-[#6b1d1d]" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-[#7c5f48] uppercase tracking-widest leading-none">
            Restaurant Name
          </span>
          <span className="text-base font-bold text-[#4a0f0f] uppercase tracking-tight mt-0.5">
            {shop.name}
          </span>
        </div>
      </div>

      {/* Right: Minimal Settings Icons */}
      <div className="flex items-center gap-3">
        {/* Language Selector */}
        <button
          onClick={toggleLanguage}
          title="Toggle Language"
          className="flex items-center gap-1.5 px-3 h-10 rounded-xl text-[#6b1d1d] hover:bg-[#f5ebdc] border border-[#d8b46b]/60 transition-colors text-xs font-bold focus:outline-none cursor-pointer"
        >
          <Languages className="w-4 h-4 text-[#6b1d1d]" />
          <span className="text-[#6b1d1d]">{currentLangLabel}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50 border border-slate-100 transition-colors focus:outline-none cursor-pointer"
        >
          {theme === "dark" ? <Sun className="w-4.5 h-4.5 text-[#6b1d1d]" /> : <Moon className="w-4.5 h-4.5 text-[#6b1d1d]" />}
        </button>

        {/* Settings Icon */}
        <button
          onClick={() => navigate({ to: "/settings" })}
          title="Settings"
          className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50 border border-slate-100 transition-colors focus:outline-none cursor-pointer"
        >
          <SettingsIcon className="w-4.5 h-4.5 text-slate-500" />
        </button>

        {/* Logout Icon */}
        <button
          onClick={handleSignOut}
          title="Logout"
          className="w-10 h-10 flex items-center justify-center rounded-xl text-[#6b1d1d] hover:bg-[#f5ebdc] hover:text-[#4a0f0f] border border-[#d8b46b]/60 transition-colors focus:outline-none cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>
      </div>
    </header>
  );
}

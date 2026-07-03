import React from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  UserCheck, 
  Users, 
  BookOpen, 
  Award, 
  Lock, 
  HelpCircle, 
  Info,
  ChevronDown,
  Search,
  Menu,
  X,
  Sun,
  Moon
} from "lucide-react";

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  user?: any;
  settings?: any;
  darkMode?: boolean;
  toggleDarkMode?: () => void;
}

export default function Header({ 
  currentView, 
  setView, 
  isAdminLoggedIn, 
  onLogout,
  searchQuery,
  setSearchQuery,
  user,
  settings,
  darkMode,
  toggleDarkMode
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false);

  const handleViewChange = (view: string) => {
    setView(view);
    setIsMenuOpen(false);
  };

  const getNavBtnClass = (viewName: string) => {
    const isActive = currentView === viewName;
    return `px-3.5 py-2.5 md:px-2 lg:px-3 xl:px-3.5 text-xs md:text-[11px] lg:text-xs xl:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 md:gap-1 lg:gap-2 w-full md:w-auto text-left md:text-center md:border-b-2 hover:text-[#1e5894] whitespace-nowrap shrink-0 ${
      isActive 
        ? "bg-blue-50/80 md:bg-white text-[#1e5894] font-bold border-l-4 border-l-[#1e5894] md:border-l-0 md:border-b-[#1e5894] pl-2.5 md:pl-2 lg:pl-3" 
        : "border-transparent text-slate-600 hover:bg-slate-100 md:hover:bg-transparent"
    }`;
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-slate-200 no-print">
      {/* Top Banner Bar */}
      <div className="hidden md:block w-full bg-[#1e5894] text-white py-1.5 px-4 text-xs">
        <div className="w-full px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-blue-200" />
              <span>+977-1-5524320</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium hidden md:inline-flex">
              <Mail className="w-3.5 h-3.5 text-blue-200" />
              <span>info@mathscouncil.edu.np</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium hidden lg:inline-flex">
              <MapPin className="w-3.5 h-3.5 text-blue-200" />
              <span>Lalitpur, Nepal</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView("faq")}
              className={`hover:text-blue-100 transition-colors flex items-center gap-1 ${currentView === "faq" ? "text-blue-200 underline font-semibold" : ""}`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQ</span>
            </button>
            <span className="text-blue-400">|</span>
            <button 
              onClick={() => setView("inquiry")}
              className={`hover:text-blue-100 transition-colors flex items-center gap-1 ${currentView === "inquiry" ? "text-blue-200 underline font-semibold" : ""}`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Inquiry / Contact</span>
            </button>
            {isAdminLoggedIn && (
              <>
                <span className="text-blue-400">|</span>
                <button 
                  onClick={onLogout}
                  className="bg-red-700 px-2 py-0.5 rounded text-[11px] font-semibold hover:bg-red-800 transition-colors"
                >
                  Logout Admin
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Logo and Identity Header */}
      <div className="w-full px-4 md:px-8 py-3 sm:py-4 flex flex-row justify-between items-center gap-4">
        <div className="flex flex-row items-center gap-3 cursor-pointer text-left w-full md:w-auto" onClick={() => handleViewChange("home")}>
          {/* Custom Pagoda-Abacus traditional Nepalese logo using clean SVGs & CSS (Human-made look) */}
          <div className="relative w-11 h-11 sm:w-16 sm:h-16 bg-white border-2 border-[#1e5894] rounded flex items-center justify-center p-1 shadow-sm shrink-0">
            {/* Base and pillars */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#1e5894]">
              {/* Pagoda Roof */}
              <polygon points="50,5 95,28 5,28" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="3" />
              <polygon points="50,15 85,32 15,32" fill="currentColor" stroke="currentColor" strokeWidth="2" />
              
              {/* Abacus frame */}
              <rect x="20" y="32" width="60" height="52" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
              
              {/* Horizontal separator */}
              <line x1="20" y1="48" x2="80" y2="48" stroke="currentColor" strokeWidth="3" />
              
              {/* Vertical wires */}
              <line x1="32" y1="32" x2="32" y2="84" stroke="currentColor" strokeWidth="1.5" />
              <line x1="44" y1="32" x2="44" y2="84" stroke="currentColor" strokeWidth="1.5" />
              <line x1="56" y1="32" x2="56" y2="84" stroke="currentColor" strokeWidth="1.5" />
              <line x1="68" y1="32" x2="68" y2="84" stroke="currentColor" strokeWidth="1.5" />

              {/* Upper deck beads (1 bead on each rod) */}
              <circle cx="32" cy="40" r="3.5" fill="currentColor" />
              <circle cx="44" cy="40" r="3.5" fill="currentColor" />
              <circle cx="56" cy="40" r="3.5" fill="currentColor" />
              <circle cx="68" cy="40" r="3.5" fill="currentColor" />

              {/* Lower deck beads (several beads on rods) */}
              <circle cx="32" cy="55" r="3.5" fill="currentColor" />
              <circle cx="32" cy="62" r="3.5" fill="currentColor" />
              <circle cx="44" cy="69" r="3.5" fill="currentColor" />
              <circle cx="44" cy="76" r="3.5" fill="currentColor" />
              <circle cx="56" cy="55" r="3.5" fill="currentColor" />
              <circle cx="56" cy="62" r="3.5" fill="currentColor" />
              <circle cx="68" cy="62" r="3.5" fill="currentColor" />
              <circle cx="68" cy="69" r="3.5" fill="currentColor" />
            </svg>
          </div>
          
          <div className="text-left max-w-[calc(100%-3rem)] sm:max-w-md md:max-w-[420px]">
            <h1 className="text-[#1e5894] text-sm sm:text-xl md:text-[22px] font-bold tracking-tight font-serif leading-tight">
              {settings?.headerTitle || "Council for Mathematics Education"}
            </h1>
            <p className="text-[7.5px] sm:text-[9.5px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 sm:mt-1 uppercase tracking-wide leading-relaxed">
              <span className="block sm:hidden">{settings?.footerRegd || "Regd No. 843/054-055, Lalitpur"}</span>
              <span className="hidden sm:block">{settings?.headerSubtitle || "Regd No. 843/054-055, Lalitpur, Nepal"}</span>
            </p>
          </div>
        </div>

        {/* Right Info and Actions block (hidden on mobile, shown on desktop) */}
        <div className="hidden md:flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
          {/* Quick-type search field */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search portal..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== "search") {
                  handleViewChange("search");
                }
              }}
              onClick={() => {
                if (currentView !== "search") {
                  handleViewChange("search");
                }
              }}
              className="pl-8 pr-3 py-1.5 w-32 sm:w-44 md:w-48 text-xs bg-slate-100 border border-slate-300 focus:border-[#1e5894] focus:bg-white rounded-md outline-none transition-all placeholder:text-slate-400 font-semibold text-slate-700"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Global Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 text-xs font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-100 dark:border-zinc-800 dark:hover:bg-zinc-900 transition-all cursor-pointer flex items-center justify-center shrink-0 w-8 h-8 text-slate-700 dark:text-zinc-200"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-500 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-[#1e5894] shrink-0" />
            )}
          </button>
          
          <button
            onClick={() => handleViewChange("member-portal")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md border flex items-center gap-1.5 transition-all cursor-pointer ${
              currentView === "member-portal"
                ? "bg-[#1e5894] text-white border-[#1e5894]"
                : "bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-500 shadow-sm"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{user ? (user.displayName || "Member Dashboard") : "Join / Sign In"}</span>
          </button>

          {isAdminLoggedIn && (
            <button
              onClick={() => handleViewChange("admin")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md border flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === "admin"
                  ? "bg-[#1e5894] text-white border-[#1e5894]"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300 shadow-sm"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          )}

          {/* Right Info blocks (visible on large screens) */}
          <div className="hidden lg:flex gap-4 items-center text-xs text-slate-600 border-l pl-4 border-slate-200">
            <div>
              <span className="block text-slate-400 font-medium">Affiliation</span>
              <span className="font-semibold text-slate-700">GoN, Science Council</span>
            </div>
            <div className="border-l pl-4 border-slate-200">
              <span className="block text-slate-400 font-medium">Head Office</span>
              <span className="font-semibold text-slate-700">Lalitpur, Nepal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="bg-slate-50 border-t border-slate-200">
        <div className="w-full px-4 md:px-8 py-1.5 md:py-0.5 flex flex-col md:flex-row justify-between items-stretch md:items-center">
          {/* Mobile Navigation Header (Only visible on mobile/tablet) */}
          <div className="flex md:hidden justify-between items-center py-1 w-full">
            {/* Left side: Toggle menu icon with no text */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-[#1e5894] bg-white border border-slate-300 rounded-md shadow-sm active:bg-slate-100 cursor-pointer flex items-center justify-center"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-[#1e5894]" />}
            </button>

            {/* Right side: Search and Login just as icons in a single line */}
            <div className="flex items-center gap-2">
              {/* Mobile Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md border border-slate-300 bg-white text-slate-600 shadow-sm active:bg-slate-100 cursor-pointer flex items-center justify-center"
                aria-label="Toggle Theme"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-[#1e5894]" />}
              </button>

              <button
                onClick={() => handleViewChange("search")}
                className={`p-2 rounded-md border shadow-sm transition-all cursor-pointer flex items-center justify-center ${
                  currentView === "search"
                    ? "bg-[#1e5894] text-white border-[#1e5894]"
                    : "bg-white text-slate-600 border-slate-300 active:bg-slate-100"
                }`}
                aria-label="Search Portal"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleViewChange("member-portal")}
                className={`p-2 rounded-md border shadow-sm transition-all cursor-pointer flex items-center justify-center ${
                  currentView === "member-portal"
                    ? "bg-[#1e5894] text-white border-[#1e5894]"
                    : "bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-500 active:opacity-90"
                }`}
                aria-label="Member Portal"
              >
                <UserCheck className="w-5 h-5" />
              </button>

              {isAdminLoggedIn && (
                <button
                  onClick={() => handleViewChange("admin")}
                  className={`p-2 rounded-md border shadow-sm transition-all cursor-pointer flex items-center justify-center ${
                    currentView === "admin"
                      ? "bg-[#1e5894] text-white border-[#1e5894]"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300 active:bg-slate-200"
                  }`}
                  aria-label="Admin Panel"
                >
                  <Lock className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links container */}
          <nav className={`flex-col md:flex-row items-stretch md:items-center gap-1 md:gap-2 w-full ${isMenuOpen ? "flex mt-2 pb-2" : "hidden md:flex"}`}>
            <button
              onClick={() => handleViewChange("home")}
              className={getNavBtnClass("home")}
            >
              <span>Home</span>
            </button>
            
            <button
              onClick={() => handleViewChange("about")}
              className={getNavBtnClass("about")}
            >
              <span>About CME</span>
            </button>

            <button
              onClick={() => handleViewChange("programs")}
              className={getNavBtnClass("programs")}
            >
              <span>Programs & Training</span>
            </button>

            {/* Publications & News Dropdown */}
            <div 
              className="relative md:inline-block w-full md:w-auto"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`px-3.5 py-2.5 md:px-2 lg:px-3 xl:px-3.5 text-xs md:text-[11px] lg:text-xs xl:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between md:justify-center gap-1.5 w-full md:w-auto text-left md:text-center md:border-b-2 hover:text-[#1e5894] whitespace-nowrap shrink-0 ${
                  currentView === "publications" || currentView === "blogs" || currentView === "blog-post"
                    ? "bg-blue-50/80 md:bg-white text-[#1e5894] font-bold border-l-4 border-l-[#1e5894] md:border-l-0 md:border-b-[#1e5894] pl-2.5 md:pl-2 lg:pl-3" 
                    : "border-transparent text-slate-600 hover:bg-slate-100 md:hover:bg-transparent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 shrink-0" />
                  <span>Publications & News</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform hidden md:inline-block ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu List */}
              {isDropdownOpen && (
                <div className="absolute left-0 mt-0 md:mt-1 w-full md:w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1.5 animate-fadeIn">
                  <button
                    onClick={() => {
                      handleViewChange("publications");
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 ${
                      currentView === "publications" ? "text-[#1e5894] bg-blue-50/50" : "text-slate-700"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Academic Journals & Guides</span>
                  </button>
                  <button
                    onClick={() => {
                      handleViewChange("blogs");
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 ${
                      currentView === "blogs" || currentView === "blog-post" ? "text-[#1e5894] bg-blue-50/50" : "text-slate-700"
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>Blogs & Educational News</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleViewChange("membership")}
              className={getNavBtnClass("membership")}
            >
              <GraduationCap className="w-4 h-4 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 shrink-0" />
              <span>Membership Form</span>
            </button>

            <button
              onClick={() => handleViewChange("team")}
              className={getNavBtnClass("team")}
            >
              <Users className="w-4 h-4 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 shrink-0" />
              <span>Team Members</span>
            </button>

            {/* Inquiry/Contact shown on all screens now, and FAQ remains mobile-only since top-bar has FAQ on desktop */}
            <button
              onClick={() => handleViewChange("inquiry")}
              className={getNavBtnClass("inquiry")}
            >
              <Mail className="w-4 h-4 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 shrink-0" />
              <span>Contact Us</span>
            </button>

            <button
              onClick={() => handleViewChange("faq")}
              className={`${getNavBtnClass("faq")} md:hidden`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>FAQ</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

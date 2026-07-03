import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Home from "./components/Home";
import AboutCME from "./components/AboutCME";
import Programs from "./components/Programs";
import Publications from "./components/Publications";
import MembershipForm from "./components/MembershipForm";
import TeamMembers from "./components/TeamMembers";
import Inquiry from "./components/Inquiry";
import FAQ from "./components/FAQ";
import AdminDashboard from "./components/AdminDashboard";
import SearchPortal from "./components/SearchPortal";
import MemberAuth from "./components/MemberAuth";
import NotFound from "./components/NotFound";
import Blogs from "./components/Blogs";
import { getFirebaseClient } from "./lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { ArrowUp } from "lucide-react";

const viewToPathMap: Record<string, string> = {
  home: "/",
  about: "/about",
  programs: "/programs",
  publications: "/publications",
  membership: "/membership",
  "member-portal": "/member-portal",
  team: "/team",
  inquiry: "/inquiry",
  faq: "/faq",
  search: "/search",
  admin: "/admin",
  blogs: "/blogs",
  "blog-post": "/blogs",
  "not-found": "/not-found",
};

const pathToViewMap: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/programs": "programs",
  "/publications": "publications",
  "/membership": "membership",
  "/member-portal": "member-portal",
  "/team": "team",
  "/inquiry": "inquiry",
  "/faq": "faq",
  "/search": "search",
  "/admin": "admin",
  "/blogs": "blogs",
  "/blog": "blogs",
  "/not-found": "not-found",
};

export default function App() {
  const [currentView, _setView] = useState<string>("home");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("isAdminLoggedIn") === "true";
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [authInitializing, setAuthInitializing] = useState<boolean>(true);
  const [settings, setSettings] = useState<any>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const setView = (view: string, payload?: any) => {
    _setView(view);

    // Compute the URL pathname corresponding to the view
    let path = "/";
    if (view === "blog-post") {
      const blogId = payload || selectedPostId;
      path = blogId ? `/blog/${blogId}` : "/blogs";
    } else {
      path = viewToPathMap[view] || "/";
    }

    // Push state to browser history if it's different from the current path
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const fetchSettings = () => {
    fetch("/api/settings")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => {
        if (data) {
          setSettings(data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Support back/forward browser navigation and direct URLs
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path.startsWith("/blog/")) {
        const parts = path.split("/");
        const blogId = parts[2];
        if (blogId) {
          _setView("blog-post");
          setSelectedPostId(blogId);
        }
      } else {
        const view = pathToViewMap[path] || "not-found";
        _setView(view);
        setSelectedPostId(null);
      }
    };

    handleLocationChange();
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const ADMIN_EMAILS = [
    "bishalmishra9000@gmail.com",
    "council.edu.developer@gmail.com",
    "developer@bishal.com",
    "mathscouncil@gmail.com"
  ];

  useEffect(() => {
    let unsubscribe: any = null;
    getFirebaseClient()
      .then(({ auth }) => {
        unsubscribe = onAuthStateChanged(auth, (usr) => {
          setUser(usr);
          if (usr && usr.email && ADMIN_EMAILS.includes(usr.email.toLowerCase())) {
            setIsAdminLoggedIn(true);
            localStorage.setItem("isAdminLoggedIn", "true");
          } else if (localStorage.getItem("isAdminLoggedIn") !== "true") {
            setIsAdminLoggedIn(false);
          }
          
          // Auto-sync authenticated user details to central database profile collection
          if (usr && usr.email) {
            fetch("/api/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                email: usr.email,
                fullName: usr.displayName || usr.email.split("@")[0],
                phoneNumber: usr.phoneNumber || ""
              })
            }).catch((syncErr) => {
              console.warn("Auto background profile sync skipped:", syncErr);
            });
          }

          setAuthInitializing(false);
        });
      })
      .catch((err) => {
        console.error("Failed to initialize Firebase Auth listener:", err);
        setAuthInitializing(false);
      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Dynamically update unique SEO page titles, description and keywords from Firestore on view changes
  useEffect(() => {
    const titleMap: Record<string, string> = {
      home: "Council for Mathematics Education (CME) | Nepal",
      about: "About CME: History, Objectives & Academic Modernization | Council for Mathematics Education",
      programs: "Academic Programs & Teacher Capacity Training Workshops | CME Nepal",
      publications: "Academic Journals & Modernized School Syllabus Publications | CME",
      membership: "Apply for General, Institutional or Life Membership Online | CME Nepal",
      "member-portal": "Academic Member Central Portal & Profile | CME",
      team: "Executive Committee & Registered Members Directory | CME",
      inquiry: "Get in Touch, Support & Lalitpur Secretariat Coordinates | CME",
      faq: "Frequently Asked Questions, Guidelines & Syllabi | CME",
      search: "Search Syllabus, Journals, Textbook Archives & Database | CME",
      admin: "Administrative Central Secure Command Dashboard | CME",
      "not-found": "404 - Academic Resource Connection Offline | CME",
      blogs: "Blogs & Educational News | CME Nepal",
      "blog-post": "Read Article | Blogs & News | CME Nepal",
    };

    const descriptionMap: Record<string, string> = {
      home: "The Council for Mathematics Education (CME) is Nepal's premier academic organization dedicated to mathematics education research, teacher workshops, and school curriculum development.",
      about: "Discover the history, objectives, academic modernization milestones, and executive mission of the Council for Mathematics Education (CME) in Lalitpur, Nepal.",
      programs: "Explore professional teacher training programs, state capacity workshops, pedagogical methods, and instructional development symposia hosted by CME Nepal.",
      publications: "Access academic journals, school syllabi, textbook archives, research bulletins, and mathematics publications created by academic experts in Nepal.",
      membership: "Join CME Nepal. Fill out the online membership registration form for Institutional, Life, or General Academic Membership to connect with mathematical scholars.",
      "member-portal": "Log in to the CME Member Central Portal to access educational materials, directory records, and verify academic certifications.",
      team: "Meet the executive committee, central advisory board, and registered academic scholars of the Council for Mathematics Education of Nepal.",
      inquiry: "Contact the CME Lalitpur Secretariat. Find phone numbers, map directions, email addresses, and send dynamic support inquiries directly to our administrative team.",
      faq: "Find clear answers to frequently asked questions about membership registration fees, publication releases, and teacher training programs.",
      search: "Search the comprehensive database of mathematics resources, syllabus archives, journal documents, and academic publications of CME Nepal.",
      admin: "Secure portal for authorized CME administrators to manage registers, member applications, and public news releases.",
      "not-found": "The requested academic resource connection is offline. Return to the Council for Mathematics Education homepage.",
      blogs: "Read the latest educational news, academic articles, mathematical research summaries, and pedagogical discussions from CME experts.",
      "blog-post": "Read specific academic insights, textbook reviews, and educational bulletins published by the Council for Mathematics Education.",
    };

    const keywordsMap: Record<string, string> = {
      home: "mathematics education nepal, cme nepal, math teachers association, school syllabus lalitpur, mathematical research",
      about: "cme history, mathematical society nepal, education board, executive objectives, academic goals",
      programs: "teacher training, mathematics workshop, math teaching methods, pedagogical skills, nepal education",
      publications: "cme journals, syllabus archive, math textbook nepal, academic bulletin, scientific publications",
      membership: "register cme, math membership nepal, institutional membership, life member application",
      "member-portal": "member dashboard cme, verify membership, teacher credentials nepal, academic portal",
      team: "executive committee, advisory board, registered scholars cme, board of directors",
      inquiry: "contact cme, lalitpur secretariat, mathematics council phone, support email",
      faq: "cme faq, mathematics registration fees, training questions, syllabus inquiries",
      search: "search mathematics, find syllabus, lookup journals, math papers nepal",
      admin: "admin login, manage memberships, database portal",
      "not-found": "404 cme, page not found, broken link",
      blogs: "math educational blog, teacher resources, math research news, pedagogical articles",
      "blog-post": "academic post, mathematics research, school math insights",
    };

    const updateTags = (t: string, d: string, k: string) => {
      document.title = t;

      let desc = document.querySelector('meta[name="description"]');
      if (!desc) {
        desc = document.createElement("meta");
        desc.setAttribute("name", "description");
        document.head.appendChild(desc);
      }
      desc.setAttribute("content", d);

      let keyw = document.querySelector('meta[name="keywords"]');
      if (!keyw) {
        keyw = document.createElement("meta");
        keyw.setAttribute("name", "keywords");
        document.head.appendChild(keyw);
      }
      keyw.setAttribute("content", k);
    };

    // Apply defaults instantly
    const defTitle = titleMap[currentView] || "Council for Mathematics Education (CME) | Nepal";
    const defDesc = descriptionMap[currentView] || "Council for Mathematics Education (CME) in Lalitpur, Nepal.";
    const defKeyw = keywordsMap[currentView] || "mathematics education nepal, cme nepal, mathematics council";
    updateTags(defTitle, defDesc, defKeyw);

    // Fetch from Firestore
    let active = true;
    getFirebaseClient()
      .then(async ({ db }) => {
        const { doc, getDoc } = await import("firebase/firestore");
        const docRef = doc(db, "seoMeta", currentView || "home");
        const docSnap = await getDoc(docRef);
        if (active && docSnap.exists()) {
          const data = docSnap.data();
          const t = data.title || defTitle;
          const d = data.description || defDesc;
          const k = data.keywords || defKeyw;
          updateTags(t, d, k);
        }
      })
      .catch((err) => {
        console.warn("Firestore SEO metadata read failed, using local defaults:", err);
      });

    // Instantly scroll page to top on view changes to mimic dynamic native page loads
    window.scrollTo({ top: 0, behavior: "instant" as any });

    return () => {
      active = false;
    };
  }, [currentView]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleLoginSuccess = () => {
    localStorage.setItem("isAdminLoggedIn", "true");
    setIsAdminLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    setIsAdminLoggedIn(false);
    setView("home");
  };

  const handleFormSuccess = () => {
    // Redirect to home or keep on form
  };

  // Render view based on simple high-performance state-router
  const renderView = () => {
    switch (currentView) {
      case "home":
        return <Home setView={setView} />;
      case "about":
        return <AboutCME />;
      case "programs":
        return <Programs setView={setView} />;
      case "publications":
        return <Publications />;
      case "membership":
        return <MembershipForm onSuccess={handleFormSuccess} user={user} />;
      case "member-portal":
        return <MemberAuth setView={setView} user={user} onAdminLoginSuccess={handleLoginSuccess} />;
      case "team":
        return <TeamMembers />;
      case "inquiry":
        return <Inquiry settings={settings} />;
      case "faq":
        return <FAQ />;
      case "search":
        return (
          <SearchPortal 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            setView={setView} 
          />
        );
      case "admin":
        if (!isAdminLoggedIn) {
          setTimeout(() => setView("member-portal"), 0);
          return null;
        }
        return (
          <AdminDashboard 
            isAdminLoggedIn={isAdminLoggedIn} 
            onLoginSuccess={handleLoginSuccess} 
            onSettingsSaved={fetchSettings}
          />
        );
      case "blogs":
      case "blog-post":
        return (
          <Blogs 
            setView={setView} 
            selectedPostId={selectedPostId} 
            setSelectedPostId={setSelectedPostId} 
          />
        );
      case "not-found":
        return <NotFound setView={setView} />;
      default:
        return <NotFound setView={setView} />;
    }
  };

  if (authInitializing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-12 h-12">
            {/* Outer track */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
            {/* Spinning indicator */}
            <div className="absolute inset-0 rounded-full border-4 border-t-[#1e5894] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider animate-pulse">
            Loading
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white font-sans text-slate-800">
      {/* 1. Header component (with print omission style helper) */}
      <Header 
        currentView={currentView} 
        setView={setView} 
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
        settings={settings}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* 2. Main content area */}
      <main className="flex-1 w-full bg-white">
        {renderView()}
      </main>

      {/* 3. Footer Area (No AI-slop, completely human academic style) */}
      <footer className="w-full bg-[#162e4c] text-slate-300 py-10 border-t border-slate-700 mt-16 no-print">
        <div className="w-full px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand statement */}
          <div className="space-y-3.5 md:col-span-2">
            <h4 className="text-white font-serif font-bold text-sm tracking-wide">
              {settings?.headerTitle || "Council for Mathematics Education"}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {settings?.footerDescription || "Established in 1991 (2048 B.S.), CME is Nepal's premier government-recognized academic society, promoting syllabus modernisation, student olympiads, and intensive teacher-capacity development."}
            </p>
            <div className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
              {settings?.footerRegd || "Regd No. 843/054-055, Lalitpur, Nepal"}
            </div>
          </div>

          {/* Col 2: Internal Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Quick Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setView("about")} className="hover:text-amber-400 transition-colors">
                  History & Objectives
                </button>
              </li>
              <li>
                <button onClick={() => setView("programs")} className="hover:text-amber-400 transition-colors">
                  Teacher Training Schemes
                </button>
              </li>
              <li>
                <button onClick={() => setView("publications")} className="hover:text-amber-400 transition-colors">
                  CME Academic Journals
                </button>
              </li>
              <li>
                <button onClick={() => setView("membership")} className="hover:text-amber-400 transition-colors">
                  Online Membership Form
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Coordinates details */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Contact Secretariats
            </h4>
            <div className="text-xs text-slate-400 space-y-1.5 leading-relaxed">
              <p>
                <strong>Seat:</strong> {settings?.footerAddress || "Manbhawan, Ward 5, Lalitpur, Nepal"}
              </p>
              <p>
                <strong>Phones:</strong> {settings?.supportPhone || "+977-1-5524320 / +977-1-5544212"}
              </p>
              <p>
                <strong>Email:</strong> {settings?.supportEmail || "info@mathscouncil.edu.np"}
              </p>
            </div>
          </div>

        </div>

        {/* Lower copyright stripe */}
        <div className="w-full px-6 md:px-8 mt-8 pt-6 border-t border-slate-700/60 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 gap-3">
          <span>
            {settings?.footerCopyright || "© 1991 - 2026 Council for Mathematics Education. All Rights Reserved."}
          </span>
          <div className="flex gap-4">
            <button onClick={() => setView("faq")} className="hover:underline hover:text-slate-400">
              FAQs Structure
            </button>
          </div>
        </div>
      </footer>

      {/* 4. Floating subtle Back to Top action button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-[#1e5894] hover:bg-blue-800 text-white p-3 rounded-full shadow-lg border border-white/20 transition-all duration-300 transform hover:scale-115 flex items-center justify-center no-print focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          title="Back to Top"
          aria-label="Back to Top"
        >
          <ArrowUp className="w-5 h-5 text-amber-400" />
        </button>
      )}
    </div>
  );
}

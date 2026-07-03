import React, { useState, useEffect } from "react";
import { 
  Search, 
  Book, 
  GraduationCap, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Info, 
  HelpCircle, 
  Printer, 
  Eye, 
  Loader2, 
  Calendar, 
  Award,
  Users
} from "lucide-react";
import { MembershipApplication } from "../types";

interface SearchPortalProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setView: (view: string) => void;
}

interface IndexItem {
  id: string;
  type: "journal" | "program" | "document" | "member";
  category: string;
  title: string;
  description: string;
  meta: string;
  linkView?: string;
  raw?: any;
}

export default function SearchPortal({ searchQuery, setSearchQuery, setView }: SearchPortalProps) {
  const [activeTab, setActiveTab] = useState<"all" | "journals" | "programs" | "documents" | "members">("all");
  const [memberships, setMemberships] = useState<MembershipApplication[]>([]);
  const [loadingMemberships, setLoadingMemberships] = useState(true);
  const [selectedCard, setSelectedCard] = useState<MembershipApplication | null>(null);

  // Static index of Academic Journals & Publications
  const journalsIndex: IndexItem[] = [
    {
      id: "j_1",
      type: "journal",
      category: "Academic Journal",
      title: "The Mathematics Education Journal (Volume 34, Issue 1)",
      description: "Our flagship peer-reviewed journal. Featuring empirical research papers, classroom case-studies, visual geometry modules, and reviews of primary school textbooks.",
      meta: "Published: May 2026 • PDF Size: 4.2 MB",
      linkView: "publications"
    },
    {
      id: "j_2",
      type: "journal",
      category: "Mentoring Guidebook",
      title: "CME Secondary School Geometry Practice Toolkit",
      description: "A comprehensive handbook for teachers containing 120+ activity sheets, construction templates, and visual aids mapping the National Curriculum curriculum of Nepal.",
      meta: "Published: March 2026 • PDF Size: 8.1 MB",
      linkView: "publications"
    },
    {
      id: "j_3",
      type: "journal",
      category: "Competition Prep Kit",
      title: "Mathematical Logical Reasoning Olympiad Questions Compilation",
      description: "Compilation of puzzles, mental arithmetic games, and complex logic sequences used in the 2025 National Mathematics Camps.",
      meta: "Published: December 2025 • PDF Size: 3.5 MB",
      linkView: "publications"
    },
    {
      id: "j_4",
      type: "journal",
      category: "Bulletin",
      title: "Council Newsletter & Bulletin (Quarterly Edition)",
      description: "Reports from district coordinators, list of newly approved life members, event photos, and notifications from the National Executive Committee.",
      meta: "Published: June 2026 • PDF Size: 1.8 MB",
      linkView: "publications"
    }
  ];

  // Static index of Training Programs
  const programsIndex: IndexItem[] = [
    {
      id: "p_1",
      type: "program",
      category: "Continuous Project",
      title: "Primary School Math-Lab Empowerment Scheme",
      description: "Providing low-cost wooden, cardboard, and magnetic concrete visual models to schools to help pupils understand basic fraction, volume, and geometric formulas.",
      meta: "Target: Primary & Lower-Secondary Teachers",
      linkView: "programs"
    },
    {
      id: "p_2",
      type: "program",
      category: "Semi-annual Training",
      title: "Secondary Level Practical Curriculum Training",
      description: "An intensive 5-day to 10-day hands-on teacher mentoring program focusing on modern pedagogical changes, child psychology, and continuous assessment strategies.",
      meta: "Target: Registered Secondary Mathematics Educators",
      linkView: "programs"
    },
    {
      id: "p_3",
      type: "program",
      category: "Annual Competition",
      title: "Annual Mathematics Talent Search & Olympiads",
      description: "Collaborating with district education hubs to run non-standard, logical, and curiosity-driven mathematics contests to identify and mentor brilliant young minds.",
      meta: "Target: High School Students (Grades 8-12)",
      linkView: "programs"
    },
    {
      id: "p_4",
      type: "program",
      category: "Specialized Research Grants",
      title: "Indigenous Mathematics Research & Preservation",
      description: "Sponsoring field surveys and historical research on traditional Vedic, Himalayan, and Nepalese indigenous counting, calculation, and astrological systems.",
      meta: "Target: Post-graduate Scholars & Researchers",
      linkView: "programs"
    }
  ];

  // Static index of Membership Guidelines, Forms, and Documents
  const documentsIndex: IndexItem[] = [
    {
      id: "d_1",
      type: "document",
      category: "Official Application",
      title: "CME Membership Application Form (Online Submission Portal)",
      description: "Official form to register for General, Life, or International memberships. Requires professional details, institution affiliation, and payment voucher details.",
      meta: "Format: Interactive Online Form • Real-time review",
      linkView: "membership"
    },
    {
      id: "d_2",
      type: "document",
      category: "Membership Rules",
      title: "CME Life Membership Fee Structure and Guidelines",
      description: "Lifelong scholar enrollment document. Fee: One-time payment of NPR 3,000. Exempt from annual renewal fees. Includes full access to newsletters, voting rights, and CME publications.",
      meta: "Requirements: Math Teacher or University Scholar",
      linkView: "faq"
    },
    {
      id: "d_3",
      type: "document",
      category: "Membership Rules",
      title: "CME General Membership Fee Structure and Guidelines",
      description: "Annual subscription structure for school and high school educators. Entry Fee: NPR 100, Annual Subscription: NPR 200. Requires annual renewal.",
      meta: "Requirements: Practicing Mathematics Teacher in Nepal",
      linkView: "faq"
    },
    {
      id: "d_4",
      type: "document",
      category: "Membership Rules",
      title: "International Membership Guidelines",
      description: "Regulations and fees for researchers, professors, and scholars from foreign countries collaborating with mathematics research hubs in Nepal.",
      meta: "Format: Custom Academic Application",
      linkView: "faq"
    },
    {
      id: "d_5",
      type: "document",
      category: "Membership Credentials",
      title: "Official Digital Membership Card & Certificate",
      description: "Verified certificate containing member name, photo, CME ID, registration serial number, and executive signatures. Available for download immediately upon application approval.",
      meta: "Format: High-quality printable card",
      linkView: "membership"
    }
  ];

  // Load verified memberships from the backend database for live search!
  useEffect(() => {
    setLoadingMemberships(true);
    fetch("/api/memberships")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setMemberships(data || []);
        setLoadingMemberships(false);
      })
      .catch(() => {
        setLoadingMemberships(false);
      });
  }, []);

  // Build the dynamic membership records results
  const membersIndex: IndexItem[] = memberships.map((m) => ({
    id: `m_${m.id}`,
    type: "member" as const,
    category: `CME Verified ${m.membershipType} Member`,
    title: m.fullName.toUpperCase(),
    description: `Affiliated with: ${m.affiliation || m.institution || "CME Nepal"} • Designation: ${m.designation || "Mathematics Educator"}. Registered serial code: ${m.serialNo}.`,
    meta: m.status === "Approved" 
      ? `Official ID: ${m.membershipId || "Pending Code"} • Status: Verified Approved` 
      : `Status: Application Processing (${m.status})`,
    linkView: "membership",
    raw: m
  }));

  // Combine search indexes
  const fullIndex = [...journalsIndex, ...programsIndex, ...documentsIndex, ...membersIndex];

  // Search logic helper
  const filteredItems = fullIndex.filter((item) => {
    // Check search query matches
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const matchesQuery = 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.meta.toLowerCase().includes(query);

    if (!matchesQuery) return false;

    // Filter by tab selection
    if (activeTab === "all") return true;
    if (activeTab === "journals" && item.type === "journal") return true;
    if (activeTab === "programs" && item.type === "program") return true;
    if (activeTab === "documents" && item.type === "document") return true;
    if (activeTab === "members" && item.type === "member") return true;

    return false;
  });

  // Filter tab list based on Tab state (when query is empty)
  const finalFilteredItems = filteredItems.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "journals") return item.type === "journal";
    if (activeTab === "programs") return item.type === "program";
    if (activeTab === "documents") return item.type === "document";
    if (activeTab === "members") return item.type === "member";
    return true;
  });

  const getAvatarUrl = (photo: string | undefined, name: string) => {
    if (photo) return photo;
    if (name.toLowerCase().includes("hari") || name.toLowerCase().includes("ram") || name.toLowerCase().includes("chandra")) {
      return "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256";
    }
    return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256";
  };

  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-amber-100 text-slate-900 font-bold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const triggerPrintCard = () => {
    window.print();
  };

  return (
    <div className="w-full px-4 md:px-8 py-8" id="cme-global-search-portal">
      
      {/* 1. Page Title Header */}
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h2 className="text-[#1e5894] text-xl sm:text-2xl font-serif font-bold flex items-center gap-2">
          <Search className="w-6 h-6 text-amber-500 shrink-0" />
          <span>Unified Portal Search</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
          Quickly find Academic Journals • Training Programs • Membership Status & Official Documents
        </p>
      </div>

      {/* 2. Interactive Search Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
        <div className="max-w-2xl mx-auto">
          <label className="block text-slate-500 font-bold uppercase tracking-wider text-[11px] mb-2 text-center">
            Enter Keywords (e.g. Geometry, Olympiad, Journal, or a Teacher Name)
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search journals, curriculum schemes, members..."
              className="w-full text-sm sm:text-base border-2 border-[#1e5894]/20 focus:border-[#1e5894] rounded-lg pl-11 pr-4 py-3 outline-none transition-colors shadow-inner"
              id="global-search-portal-input"
              autoFocus
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
          
          {/* Suggested quick terms */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs text-slate-500">
            <span>Popular:</span>
            {["Geometry", "Olympiad", "Journal", "Life Member", "DR. RAM", "Toolkit"].map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="bg-slate-100 hover:bg-slate-200 text-[#1e5894] px-2 py-0.5 rounded font-medium transition-colors text-[11px]"
              >
                "{term}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Category Filters */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-4 mb-6 text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-md font-semibold transition-colors ${
            activeTab === "all"
              ? "bg-[#1e5894] text-white"
              : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          All Results ({fullIndex.filter(i => !searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.description.toLowerCase().includes(searchQuery.toLowerCase())).length})
        </button>
        <button
          onClick={() => setActiveTab("journals")}
          className={`px-4 py-2 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === "journals"
              ? "bg-[#1e5894] text-white"
              : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          <Book className="w-4 h-4 shrink-0" />
          <span>Academic Journals ({journalsIndex.filter(i => !searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.description.toLowerCase().includes(searchQuery.toLowerCase())).length})</span>
        </button>
        <button
          onClick={() => setActiveTab("programs")}
          className={`px-4 py-2 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === "programs"
              ? "bg-[#1e5894] text-white"
              : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          <Award className="w-4 h-4 shrink-0" />
          <span>Training Programs ({programsIndex.filter(i => !searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.description.toLowerCase().includes(searchQuery.toLowerCase())).length})</span>
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`px-4 py-2 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === "documents"
              ? "bg-[#1e5894] text-white"
              : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span>Membership Docs ({documentsIndex.filter(i => !searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.description.toLowerCase().includes(searchQuery.toLowerCase())).length})</span>
        </button>
        <button
          onClick={() => setActiveTab("members")}
          className={`px-4 py-2 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === "members"
              ? "bg-[#1e5894] text-white"
              : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          <span>Verified Register ({memberships.filter(i => !searchQuery || i.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || i.affiliation.toLowerCase().includes(searchQuery.toLowerCase())).length})</span>
        </button>
      </div>

      {/* 4. Live Loading Indicators */}
      {loadingMemberships && (
        <div className="flex items-center justify-center gap-2 py-6 text-xs text-slate-500 font-semibold">
          <Loader2 className="w-4 h-4 animate-spin text-[#1e5894]" />
          <span>Searching active databases...</span>
        </div>
      )}

      {/* 5. Search Results Grid */}
      {finalFilteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-lg p-8">
          <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-slate-700 text-base">No Matching Records Found</h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto">
            We couldn't find anything matching "<strong className="text-[#1e5894] font-semibold">{searchQuery}</strong>" in our journals, curriculum training schemes, or verified membership directory.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 bg-[#1e5894] text-white px-4 py-1.5 rounded text-xs font-semibold hover:bg-blue-800 transition-colors"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {finalFilteredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              id={`search-result-item-${item.id}`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex justify-between items-center gap-2 mb-2">
                  <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded shrink-0 ${
                    item.type === "journal" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                    item.type === "program" ? "bg-blue-50 text-[#1e5894] border border-blue-100" :
                    item.type === "document" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                    "bg-[#1e5894]/10 text-[#1e5894] border border-[#1e5894]/20"
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">
                    {item.type}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-slate-800 font-bold text-xs sm:text-sm font-serif leading-snug">
                  {highlightMatch(item.title, searchQuery)}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                  {highlightMatch(item.description, searchQuery)}
                </p>
              </div>

              {/* Card Footer Controls */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium text-[10px] sm:text-xs">
                  {item.meta}
                </span>

                <div className="w-full sm:w-auto flex justify-end gap-1.5 self-stretch sm:self-auto">
                  {item.type === "member" && item.raw?.status === "Approved" && (
                    <button
                      onClick={() => setSelectedCard(item.raw)}
                      className="bg-[#1e5894] hover:bg-blue-800 text-white px-3 py-1.5 rounded font-bold text-[10px] flex items-center gap-1 shadow-sm uppercase tracking-wider shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View/Print Card</span>
                    </button>
                  )}
                  {item.type === "journal" && (
                    <button
                      onClick={() => {
                        alert("Your academic download has started. This compilation is offered free for registered members of the Council.");
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded font-bold text-[10px] flex items-center gap-1 shadow-sm uppercase tracking-wider shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  )}
                  {item.linkView && (
                    <button
                      onClick={() => setView(item.linkView!)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded font-bold text-[10px] flex items-center gap-0.5 uppercase tracking-wider shrink-0 border border-slate-200"
                    >
                      <span>Navigate Portal</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Dynamic printable card popup for searching verified members */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-2xl w-full p-6 shadow-xl relative no-print">
            <button 
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>

            <h3 className="text-xs font-bold text-slate-800 border-b pb-2 mb-4 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-5 h-5 text-[#1e5894]" />
              <span>Official Digital Membership Card</span>
            </h3>

            {/* Print Area - CSS styled beautiful traditional card */}
            <div id="membership-card-print" className="bg-white border-4 border-double border-[#1e5894] p-5 rounded-lg relative overflow-hidden shadow max-w-md mx-auto">
              <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-64 h-64 text-[#1e5894]">
                  <polygon points="50,5 95,28 5,28" fill="currentColor" />
                  <rect x="20" y="32" width="60" height="52" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </div>

              {/* Card Header */}
              <div className="text-center border-b border-slate-300 pb-2 mb-3 relative z-10">
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest block">Regd No. 843/054-055, Lalitpur, Nepal</span>
                <h4 className="text-[#1e5894] text-xs font-bold uppercase tracking-tight font-serif mt-0.5">Council for Mathematics Education</h4>
                <div className="bg-[#1e5894] text-white text-[8px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm inline-block mt-1 font-bold">
                  {selectedCard.membershipType} Member Certificate Card
                </div>
              </div>

              {/* Card Body */}
              <div className="flex gap-4 relative z-10 items-start">
                <img 
                  src={getAvatarUrl(selectedCard.photoUrl, selectedCard.fullName)}
                  alt={selectedCard.fullName}
                  className="w-20 h-24 border border-[#1e5894] rounded object-cover bg-slate-100 shrink-0"
                />

                <div className="flex-1 space-y-1.5 text-[10px] text-slate-700">
                  <div>
                    <span className="text-slate-400 block font-bold text-[7px] uppercase tracking-wider">MEMBER NAME</span>
                    <strong className="text-slate-900 font-serif text-xs uppercase block">{selectedCard.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[7px] uppercase tracking-wider font-mono">REGISTRATION SERIAL</span>
                    <span className="font-mono font-bold text-[#1e5894]">{selectedCard.serialNo}</span>
                  </div>
                  
                  {selectedCard.status === "Approved" && (
                    <div>
                      <span className="text-slate-400 block font-bold text-[7px] uppercase tracking-wider font-mono">OFFICIAL CME ID</span>
                      <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
                        {selectedCard.membershipId || "PENDING GENERATION"}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-[9px] border-t pt-1.5 mt-1">
                    <div>
                      <span className="text-slate-400 block font-bold text-[7px] uppercase">AFFILIATION</span>
                      <span className="truncate block font-medium max-w-[100px]">{selectedCard.affiliation || selectedCard.institution}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold text-[7px] uppercase">DESIGNATION</span>
                      <span className="truncate block font-medium max-w-[100px]">{selectedCard.designation}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signatures stripe */}
              <div className="border-t border-slate-300 mt-4 pt-3 flex justify-between items-center relative z-10">
                <div className="text-center">
                  <div className="font-serif italic text-[9px] text-[#1e5894] font-semibold">Bishal Codes</div>
                  <div className="text-[6px] text-slate-400 font-bold uppercase tracking-wider border-t border-slate-200 pt-0.5 mt-0.5">Gen. Secretary</div>
                </div>
                <div className="text-center">
                  <div className="font-serif italic text-[9px] text-[#1e5894] font-semibold">Dr. H. P. Upadhyay</div>
                  <div className="text-[6px] text-slate-400 font-bold uppercase tracking-wider border-t border-slate-200 pt-0.5 mt-0.5">Council President</div>
                </div>
              </div>
            </div>

            {/* Print trigger footer controls */}
            <div className="mt-6 pt-4 border-t flex justify-end gap-2 text-xs font-semibold">
              <button
                onClick={triggerPrintCard}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded flex items-center gap-1 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Card</span>
              </button>
              <button
                onClick={() => setSelectedCard(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

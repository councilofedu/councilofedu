import React from "react";
import { motion } from "motion/react";
import { Home, Search, ArrowLeft, RefreshCw, AlertTriangle, BookOpen, Contact } from "lucide-react";

interface NotFoundProps {
  setView: (view: string) => void;
}

export default function NotFound({ setView }: NotFoundProps) {
  return (
    <div className="min-h-[80vh] bg-white flex flex-col items-center justify-center px-4 py-16 font-sans">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Animated Custom Disconnected LAN Cable SVG Illustration */}
        <div className="relative flex justify-center items-center h-64 md:h-72 w-full max-w-md mx-auto">
          {/* Subtle background glow effect */}
          <div className="absolute w-48 h-48 bg-cyan-100 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
          
          <svg
            viewBox="0 0 500 300"
            className="w-full h-full relative z-10 filter drop-shadow-md"
            aria-hidden="true"
          >
            <defs>
              {/* Copper pins gradient */}
              <linearGradient id="goldPin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              
              {/* Clear plastic plug housing gradient */}
              <linearGradient id="plasticBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
                <stop offset="60%" stopColor="#cbd5e1" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.6" />
              </linearGradient>

              {/* Socket inner shadow gradient */}
              <linearGradient id="socketInner" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
            </defs>

            {/* --- 1. WALL OUTLET / SOCKET --- */}
            <g transform="translate(60, 70)">
              {/* Wall face plate */}
              <rect x="0" y="0" width="100" height="120" rx="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="3" />
              {/* Screws */}
              <circle cx="50" cy="12" r="3" fill="#94a3b8" />
              <circle cx="50" cy="108" r="3" fill="#94a3b8" />
              
              {/* Outer bevel of the RJ-45 jack port */}
              <rect x="20" y="35" width="60" height="50" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
              
              {/* Socket cavity (darkness inside) */}
              <rect x="26" y="41" width="48" height="38" rx="2" fill="url(#socketInner)" />
              
              {/* 8 metal pins inside the socket */}
              <g stroke="#64748b" strokeWidth="1.5" opacity="0.8">
                <line x1="32" y1="41" x2="32" y2="55" />
                <line x1="37" y1="41" x2="37" y2="55" />
                <line x1="42" y1="41" x2="42" y2="55" />
                <line x1="47" y1="41" x2="47" y2="55" />
                <line x1="52" y1="41" x2="52" y2="55" />
                <line x1="57" y1="41" x2="57" y2="55" />
                <line x1="62" y1="41" x2="62" y2="55" />
                <line x1="67" y1="41" x2="67" y2="55" />
              </g>

              {/* CME Network Label */}
              <text x="50" y="27" fill="#1e3a8a" fontSize="7" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
                CME-NODE-01
              </text>
            </g>

            {/* --- 2. THE DISCONNECTED SPARKS & DANGER SIGN --- */}
            {/* Animated spark lines suggesting broken communication */}
            <motion.g
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              {/* Spark 1 */}
              <path d="M 180,110 L 210,95 L 205,115 L 225,105" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Spark 2 */}
              <path d="M 175,135 L 195,145 L 190,130 L 210,135" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </motion.g>

            {/* --- 3. THE SUSPENDED DISCONNECTED RJ-45 CABLE PLUG --- */}
            {/* Motion group for physical swaying/dangling of the loose cable end */}
            <motion.g
              animate={{
                y: [0, -10, 0],
                rotate: [0, 4, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4.5,
                ease: "easeInOut",
              }}
              style={{ originX: "420px", originY: "240px" }}
            >
              {/* Ethernet Cable Loop and trailing line */}
              <path
                d="M 285,160 C 350,210 400,260 440,240 C 470,225 430,170 380,150 C 330,130 300,145 285,160"
                fill="none"
                stroke="#64748b"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Core inner copper indicator visible inside cable slice if cut */}
              <path
                d="M 285,160 C 350,210 400,260 440,240 C 470,225 430,170 380,150 C 330,130 300,145 285,160"
                fill="none"
                stroke="#475569"
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* RJ-45 Male Connector Boot (strain relief) */}
              <path d="M 275,164 L 295,152 L 285,135 L 265,147 Z" fill="#334155" />
              <rect x="273" y="146" width="10" height="15" rx="1" fill="#475569" transform="rotate(-30 273 146)" />

              {/* The Clear Acrylic/Plastic Connector Body */}
              <rect
                x="220"
                y="110"
                width="40"
                height="60"
                rx="5"
                fill="url(#plasticBody)"
                stroke="#94a3b8"
                strokeWidth="1.5"
                transform="rotate(-30 240 140)"
              />

              {/* The Plastic Retaining Tab/Clip (depressed/disconnected) */}
              <path
                d="M 205,108 C 215,95 228,95 233,105"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="4"
                strokeLinecap="round"
                transform="rotate(-30 240 140)"
              />

              {/* Individual colorful ethernet wires exposed inside the clear plug casing */}
              <g transform="rotate(-30 240 140)" strokeWidth="2.5" strokeLinecap="square">
                {/* Stripe Orange */}
                <line x1="223" y1="125" x2="223" y2="160" stroke="#f97316" />
                {/* Solid Orange */}
                <line x1="227" y1="125" x2="227" y2="160" stroke="#ea580c" />
                {/* Stripe Green */}
                <line x1="231" y1="125" x2="231" y2="160" stroke="#22c55e" />
                {/* Solid Blue */}
                <line x1="235" y1="125" x2="235" y2="160" stroke="#3b82f6" />
                {/* Stripe Blue */}
                <line x1="239" y1="125" x2="239" y2="160" stroke="#60a5fa" />
                {/* Solid Green */}
                <line x1="243" y1="125" x2="243" y2="160" stroke="#16a34a" />
                {/* Stripe Brown */}
                <line x1="247" y1="125" x2="247" y2="160" stroke="#b45309" />
                {/* Solid Brown */}
                <line x1="251" y1="125" x2="251" y2="160" stroke="#78350f" />
              </g>

              {/* 8 Golden Copper contact pins at the extreme tip */}
              <g transform="rotate(-30 240 140)">
                <rect x="221" y="112" width="2" height="8" rx="0.5" fill="url(#goldPin)" />
                <rect x="225" y="112" width="2" height="8" rx="0.5" fill="url(#goldPin)" />
                <rect x="229" y="112" width="2" height="8" rx="0.5" fill="url(#goldPin)" />
                <rect x="233" y="112" width="2" height="8" rx="0.5" fill="url(#goldPin)" />
                <rect x="237" y="112" width="2" height="8" rx="0.5" fill="url(#goldPin)" />
                <rect x="241" y="112" width="2" height="8" rx="0.5" fill="url(#goldPin)" />
                <rect x="245" y="112" width="2" height="8" rx="0.5" fill="url(#goldPin)" />
                <rect x="249" y="112" width="2" height="8" rx="0.5" fill="url(#goldPin)" />
              </g>
            </motion.g>

            {/* --- 4. FLOATING PARTICLES (PACKET LOSS) --- */}
            <motion.circle cx="150" cy="190" r="3" fill="#cbd5e1" animate={{ y: [0, -20, 0], opacity: [0, 0.8, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 0.5 }} />
            <motion.circle cx="340" cy="90" r="4" fill="#f59e0b" opacity="0.7" animate={{ y: [0, 15, 0], opacity: [0.2, 0.9, 0.2] }} transition={{ repeat: Infinity, duration: 4 }} />
            <motion.circle cx="210" cy="220" r="2" fill="#ef4444" opacity="0.6" animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} />
          </svg>
        </div>

        {/* Dynamic 404 Status Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 text-red-700 rounded-full text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Error Code: 404 - Connection Disrupted</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            Academic Link Server Terminated
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
            The requested syllabus worksheet, mathematical journal archive, or secure server resource is offline or has been moved. The physical CME network link is currently <span className="font-bold text-red-600 underline decoration-wavy">disconnected</span>.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-24 bg-slate-200 mx-auto"></div>

        {/* Intelligent Action Gateways */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
          <button
            onClick={() => setView("home")}
            className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs group"
          >
            <div className="p-2 bg-blue-50 text-[#1e5894] rounded-lg group-hover:scale-110 transition-transform">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Return to Portal</div>
              <div className="text-[10px] text-slate-400 font-medium">Head back to the main homepage</div>
            </div>
          </button>

          <button
            onClick={() => setView("search")}
            className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs group"
          >
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:scale-110 transition-transform">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Syllabus Archive Search</div>
              <div className="text-[10px] text-slate-400 font-medium">Search the digitized directory</div>
            </div>
          </button>

          <button
            onClick={() => setView("publications")}
            className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs group"
          >
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">CME Publications</div>
              <div className="text-[10px] text-slate-400 font-medium">Browse journals & curriculum</div>
            </div>
          </button>

          <button
            onClick={() => setView("inquiry")}
            className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs group"
          >
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
              <Contact className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Report Broken Link</div>
              <div className="text-[10px] text-slate-400 font-medium">Notify the Secretariat developer</div>
            </div>
          </button>
        </div>

        {/* Back and Reload controls */}
        <div className="flex justify-center items-center gap-4 text-xs font-bold text-slate-500 pt-2">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
          <span>•</span>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Calendar, Loader2, Award, CheckCircle2 } from "lucide-react";
import { Program } from "../types";

interface ProgramsProps {
  setView?: (view: string) => void;
}

export default function Programs({ setView }: ProgramsProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/programs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load programs.");
        return res.json();
      })
      .then((data) => {
        setPrograms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to sync programs from Council database.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full px-4 md:px-8 py-8" id="programs-view-page">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h2 className="text-[#1e5894] text-xl sm:text-2xl font-serif font-bold">
          Programs & Training Schemes
        </h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
          Empowering Educators • Inspiring Young Logic Thinkers • Modernizing Curriculums
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#1e5894]" />
          <span className="text-xs font-semibold uppercase tracking-wider font-mono">Syncing Program Registries...</span>
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-red-50 rounded-lg border border-red-100 p-6 text-red-800 text-xs font-medium">
          {error}
        </div>
      ) : programs.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-lg border border-slate-200 p-6 text-slate-500 text-xs">
          No training programs listed at this moment. Please check back later.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map((act, index) => (
            <div 
              key={act.id || index} 
              className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <span className="inline-block bg-blue-50 text-[#1e5894] border border-blue-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-3">
                  {act.target}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-800 font-serif leading-tight">
                  {act.title}
                </h3>
                <p className="text-slate-600 text-xs mt-2.5 leading-relaxed">
                  {act.description}
                </p>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>{act.duration}</span>
                </span>
                <span className="text-slate-400 font-medium">Official CME Initiative</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 p-5 rounded-lg mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <div>
          <h4 className="font-bold text-amber-900 font-serif">Want to request a customized Teacher Mentoring Workshop in your school district?</h4>
          <p className="text-amber-800 mt-0.5">We dispatch trained educational experts with visual learning kits to districts upon formal academic invitations.</p>
        </div>
        <button 
          onClick={() => setView && setView("inquiry")}
          className="bg-[#1e5894] hover:bg-[#164372] text-white px-4 py-2 rounded text-xs font-semibold shrink-0 transition-colors cursor-pointer shadow"
        >
          Contact Our Training Secretary
        </button>
      </div>
    </div>
  );
}

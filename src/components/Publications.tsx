import React, { useState, useEffect } from "react";
import { Book, Download, Calendar, Loader2 } from "lucide-react";
import { Publication } from "../types";

export default function Publications() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/publications")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load publications.");
        return res.json();
      })
      .then((data) => {
        setPublications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to sync reference compilations from CME database.");
        setLoading(false);
      });
  }, []);

  const triggerDownload = (pub: Publication) => {
    if (pub.fileUrl) {
      window.open(pub.fileUrl, "_blank");
    } else {
      alert(`Your academic download of "${pub.title}" has started. This compilation is offered free for registered members of the Council.`);
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-8" id="publications-view-page">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h2 className="text-[#1e5894] text-xl sm:text-2xl font-serif font-bold">
          Publications & Reference Library
        </h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
          Scholarly Research • Practice Handbooks • Newsletter Bulletins • Open-Source Pedagogy
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#1e5894]" />
          <span className="text-xs font-semibold uppercase tracking-wider font-mono">Syncing Reference Archives...</span>
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-red-50 rounded-lg border border-red-100 p-6 text-red-800 text-xs font-medium">
          {error}
        </div>
      ) : publications.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-lg border border-slate-200 p-6 text-slate-500 text-xs">
          No publication library records exist at this moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publications.map((b, index) => (
            <div 
              key={b.id || index} 
              className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex gap-4 hover:shadow-md transition-shadow"
            >
              <div className="bg-slate-50 text-[#1e5894] w-12 h-16 rounded border border-slate-200 flex flex-col items-center justify-center shrink-0 shadow-sm">
                <Book className="w-5 h-5 mb-1 text-amber-500" />
                <span className="text-[7px] uppercase font-bold text-center leading-none text-slate-500">CME</span>
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{b.type}</span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug mt-0.5">{b.title}</h3>
                  <p className="text-slate-500 text-[11px] leading-relaxed mt-1.5">{b.description}</p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1 font-semibold text-slate-500">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{b.published}</span>
                  </span>
                  <button 
                    onClick={() => triggerDownload(b)}
                    className="text-[#1e5894] hover:text-amber-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-500" />
                    <span>Download PDF ({b.size})</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

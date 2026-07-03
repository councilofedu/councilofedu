import React from "react";
import { Award, Target, History, Calendar, FileText, CheckCircle2 } from "lucide-react";

export default function AboutCME() {
  return (
    <div className="w-full px-4 md:px-8 py-8">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h2 className="text-[#1e5894] text-xl sm:text-2xl font-serif font-bold">
          About the Council for Mathematics Education
        </h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
          Established 1991 (2048 B.S.) • Government Registered Professional Organization
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: History & Leadership */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-[#1e5894] font-serif mb-3 flex items-center gap-2">
              <History className="w-4.5 h-4.5 text-amber-500" />
              <span>Our Legacy & Historical Context</span>
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3">
              The Council for Mathematics Education (CME) was conceived in 1991 by a group of eminent Nepalese mathematics professors, educational researchers, and curriculum officers. Recognizing the steep hurdles students faced in visual logic, arithmetic reasoning, and general school performance, these visionaries saw an urgent need to form an independent, national-level scientific body.
            </p>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3">
              Registered formally with the Government of Nepal in Lalitpur, CME became the focal point for mathematical reforms. Our early work focused on organizing training modules for government school teachers, researching alternative pedagogical strategies, and drafting syllabus recommendations for the Ministry of Education.
            </p>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Today, CME remains the largest and most respected professional network of math teachers and scholars in Nepal, spanning primary, secondary, higher secondary, and university level education, fostering cooperation and excellence in mathematical sciences.
            </p>
          </section>

          <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-[#1e5894] font-serif mb-3 flex items-center gap-2">
              <Target className="w-4.5 h-4.5 text-amber-500" />
              <span>Core Mandates & Academic Directives</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1e5894] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Pedagogical Innovation</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed mt-1">
                    Transitioning schools from rote formula memorization to experiential, hands-on learning models.
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1e5894] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Curriculum Consultation</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed mt-1">
                    Collaborating with national and international bodies to audit, modernize, and update textbooks.
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1e5894] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Inclusive Education</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed mt-1">
                    Conducting dedicated workshops in remote districts to uplift underserved mathematics classrooms.
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1e5894] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Scholarly Exchanges</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed mt-1">
                    Fostering collaboration between Nepalese university faculties and global mathematical societies.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right 1 Column: Registration & Certificates */}
        <div className="space-y-6">
          <div className="bg-slate-100 p-5 rounded-lg border border-slate-200">
            <h4 className="font-serif font-bold text-sm text-[#1e5894] border-b border-slate-300 pb-2 mb-3">
              Official Identification
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block">Registration Authority:</span>
                <span className="font-semibold text-slate-800">District Administration Office (DAO), Lalitpur</span>
              </div>
              <div>
                <span className="text-slate-500 block">Registration No:</span>
                <span className="font-mono font-semibold text-slate-800">843 / 054 / 055 B.S.</span>
              </div>
              <div>
                <span className="text-slate-500 block">Affiliated with:</span>
                <span className="font-semibold text-slate-800">Social Welfare Council (SWC), Nepal</span>
              </div>
              <div>
                <span className="text-slate-500 block">Permanent Account Number (PAN):</span>
                <span className="font-mono font-semibold text-slate-800">302391024</span>
              </div>
              <div>
                <span className="text-slate-500 block">Official Seat:</span>
                <span className="font-semibold text-slate-800">Manbhawan, Lalitpur, Nepal</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-5 rounded-lg border border-amber-200 text-xs text-amber-900">
            <span className="flex items-center gap-1 font-bold text-[#1e5894] mb-2">
              <Award className="w-4.5 h-4.5" />
              <span>35 Years of Integrity</span>
            </span>
            <p className="leading-relaxed">
              Every life member and general member of our council plays an active role in steering mathematics instruction in school districts. Our strict, non-political membership rules ensure pure educational commitment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

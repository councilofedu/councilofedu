import React, { useState, useEffect } from "react";
import { HelpCircle, Loader2 } from "lucide-react";
import { FAQItem } from "../types";

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackFaqs: FAQItem[] = [
    {
      id: "faq_fallback_1",
      question: "What are the different types of memberships available in the Council?",
      answer: "The Council offers three categories of membership: 1) General Membership (available to school math teachers and educators, requiring an entry fee of NPR 100 and NPR 200 annual subscription), 2) Life Membership (one-time fee of NPR 3,000 for lifelong scholars and university teachers, with no annual charges), and 3) International Membership (for scholars from other countries who wish to collaborate with our research initiatives).",
      category: "Membership",
      order: 1
    },
    {
      id: "faq_fallback_2",
      question: "How can I apply for a membership, and how long does verification take?",
      answer: "You can apply directly via our online Membership Form page. You must fill in your correct academic affiliation, upload a photo, pay the required fee via the QR code printed on the form, and input the payment voucher transaction number. Once submitted, our administrative team typically audits and approves your application within 2-3 working days. Upon approval, you can download/print your official Certificate Membership Card directly from this portal!",
      category: "Membership",
      order: 2
    },
    {
      id: "faq_fallback_3",
      question: "I am a dedicated teacher, can I apply to become a Council Team Member?",
      answer: "Yes! The Council has various sub-committees, advisory boards, and staff roles. You can navigate to the Team Members page, click on the 'Apply to Join the Team' form, and submit your academic bio. Our general secretary and president review applications during our quarterly board meetings. If approved, your name and professional profile card will be listed directly in our team directory.",
      category: "Participation",
      order: 3
    },
    {
      id: "faq_fallback_4",
      question: "Are CME resources and publications free to download?",
      answer: "Most secondary toolkits, newsletters, and training manuals are free for registered members of the Council. High-end research compilations may require a small institutional charge, which is utilized for teacher training programs in rural school districts of Nepal.",
      category: "Resources",
      order: 4
    }
  ];

  useEffect(() => {
    fetch("/api/faqs")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          // Sort by order ascending
          const sorted = [...data].sort((a, b) => (a.order || 99) - (b.order || 99));
          setFaqs(sorted);
        } else {
          setFaqs(fallbackFaqs);
        }
        setLoading(false);
      })
      .catch(() => {
        setFaqs(fallbackFaqs);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full px-4 md:px-8 py-8">
      <div className="border-b border-slate-200 pb-4 mb-6 text-center">
        <h2 className="text-[#1e5894] text-xl sm:text-2xl font-serif font-bold flex items-center justify-center gap-1.5">
          <HelpCircle className="w-6 h-6 text-amber-500" />
          <span>Frequently Asked Questions (FAQ)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
          Fee Structures • Application Reviews • General Resources • Professional Standards
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-6 h-6 text-[#1e5894] animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={f.id || i} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm" id={`faq-item-${f.id}`}>
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-xs sm:text-sm font-bold text-[#1e5894] font-serif flex gap-2">
                  <span className="text-amber-500 font-bold shrink-0">Q{i + 1}:</span>
                  <span>{f.question}</span>
                </h3>
                {f.category && (
                  <span className="bg-slate-100 text-slate-500 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0">
                    {f.category}
                  </span>
                )}
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mt-2.5 leading-relaxed pl-6 border-l border-slate-100 whitespace-pre-line">
                {f.answer}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

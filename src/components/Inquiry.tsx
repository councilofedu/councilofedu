import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "./Toast";

interface InquiryProps {
  settings?: any;
}

export default function Inquiry({ settings }: InquiryProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.subject || !form.message) {
      setError("Please fill out all fields.");
      showToast("Please fill out all required fields.", "warning", "Validation Error");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        showToast(
          "Your academic inquiry was sent successfully. We'll reply within 48 hours.",
          "success",
          "Inquiry Received!"
        );
        setForm({ fullName: "", email: "", subject: "", message: "" });
      } else {
        setError(data.error || "Failed to post message.");
        showToast(
          data.error || "Failed to transmit inquiry. Please try again.",
          "error",
          "Inquiry Error"
        );
      }
    } catch (err) {
      setError("Network error. Please try again.");
      showToast(
        "Could not reach server. Please check your network and try again.",
        "error",
        "Connection Offline"
      );
    } finally {
      setLoading(false);
    }
  };

  const contactAddress = settings?.contactAddress || "Manbhawan, Ward 5, Lalitpur (Near Lalitpur High School), Lalitpur District, Nepal";
  const contactPhone = settings?.contactPhone || "+977-1-5524320 / +977-1-5544212";
  const contactEmails = settings?.contactEmails || "info@mathscouncil.edu.np, secretary@mathscouncil.edu.np";
  const contactOfficeHours = settings?.contactOfficeHours || "Sunday to Friday (Academic Session):\n10:00 AM – 4:00 PM (NPT)\nClosed on National Gazetted Holidays and Saturdays.";
  const contactMapEmbed = settings?.contactMapEmbed || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.670067064108!2d85.32045889999999!3d27.665677799999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19d13d9ed2c3%3A0xbd62ef28c7ba5593!2sLalitpur%20Madhyamik%20Vidyalaya%20(LMV)!5e0!3m2!1sen!2snp!4v1782899459479!5m2!1sen!2snp';

  const getMapSrc = (embedCodeOrUrl: string) => {
    if (!embedCodeOrUrl) return "";
    if (embedCodeOrUrl.includes("<iframe")) {
      const match = embedCodeOrUrl.match(/src="([^"]+)"/);
      if (match) return match[1];
    }
    return embedCodeOrUrl;
  };

  const mapUrl = getMapSrc(contactMapEmbed);

  return (
    <div className="w-full px-4 md:px-8 py-8">
      <div className="border-b border-slate-200 dark:border-zinc-800 pb-4 mb-6">
        <h2 className="text-[#1e5894] dark:text-blue-400 text-xl sm:text-2xl font-serif font-bold">
          Inquiry & Contact Desk
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
          Submit General Inquiries • Training Requests • Publication Cooperations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left 2 Columns: Information Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-black rounded-lg border border-slate-200 dark:border-zinc-800 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#1e5894] dark:text-blue-400 font-serif uppercase tracking-wider">
              Secretariat Headquarters
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex gap-3 items-start">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">CME Office Location:</span>
                  <span className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {contactAddress}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Official Lines:</span>
                  <span className="text-slate-600 dark:text-slate-300 font-mono leading-relaxed">
                    {contactPhone}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Emails:</span>
                  <span className="text-[#1e5894] dark:text-blue-400 font-mono leading-relaxed block whitespace-pre-line">
                    {contactEmails.split(',').map((email: string) => email.trim()).join('\n')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-zinc-950 border border-blue-200 dark:border-zinc-850 rounded-lg p-5 text-xs text-slate-600 dark:text-slate-300">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Office Hours:</h4>
            <p className="leading-relaxed whitespace-pre-line">
              {contactOfficeHours}
            </p>
          </div>
        </div>

        {/* Right 3 Columns: Contact Form */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-black rounded-lg border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 border-b dark:border-zinc-850 pb-2">
              Send an Official Inquiry
            </h3>

            {success ? (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 text-green-800 dark:text-green-300 p-4 rounded text-xs text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto" />
                <p className="font-bold">Your Inquiry has been logged!</p>
                <p className="text-slate-500 dark:text-slate-400">
                  We have cataloged your subject. Our administrative secretary will respond to your registered email address soon.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-2 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-4 py-1 rounded transition-colors"
                >
                  Write Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-300 p-3 rounded flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Bishal Codes"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-black border border-slate-300 dark:border-zinc-800 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-medium text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="e.g. developer@bishal.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-black border border-slate-300 dark:border-zinc-800 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-medium text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="e.g. Query about Annual Geometry Training"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-black border border-slate-300 dark:border-zinc-800 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-semibold text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">
                    Detailed Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Explain your inquiry clearly..."
                    value={form.message}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-black border border-slate-300 dark:border-zinc-800 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-medium text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#1e5894] hover:bg-[#123d6a] text-white font-semibold px-5 py-2 rounded shadow-sm transition-colors flex items-center gap-1.5 font-mono tracking-wider"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? "SENDING..." : "SEND INQUIRY"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Map Location Section */}
      {mapUrl && (
        <div className="mt-8 bg-white dark:bg-black rounded-lg border border-slate-200 dark:border-zinc-800 p-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#1e5894] dark:text-blue-400 font-serif uppercase tracking-wider mb-3">
            Secretariat Map Location
          </h3>
          <div className="w-full h-[450px] rounded overflow-hidden border border-slate-200 dark:border-zinc-800">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

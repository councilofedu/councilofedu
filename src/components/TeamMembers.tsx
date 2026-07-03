import React, { useState, useEffect } from "react";
import { 
  Users, 
  Mail, 
  Phone, 
  Award, 
  Briefcase, 
  BookOpen, 
  Upload, 
  Info,
  CheckCircle2,
  AlertCircle,
  Plus
} from "lucide-react";

import { TeamMember } from "../types";

export default function TeamMembers() {
  const [teamList, setTeamList] = useState<TeamMember[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [loading, setLoading] = useState(false);

  // Form states for Team Application
  const [appForm, setAppForm] = useState({
    fullName: "",
    role: "",
    category: "General Members",
    bio: "",
    affiliation: "",
    email: "",
    phone: "",
    photoUrl: ""
  });
  
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedMemberDetails, setSelectedMemberDetails] = useState<TeamMember | null>(null);

  // Fetch team list
  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/team");
      if (res.ok) {
        const data = await res.json();
        setTeamList(data);
      }
    } catch (err) {
      console.error("Error fetching team list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingPhoto(true);
      setFormError("");
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              file: reader.result as string, 
              folder: "team" 
            })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setAppForm(prev => ({
              ...prev,
              photoUrl: data.url
            }));
          } else {
            setFormError("Photo upload failed: " + (data.error || "Please try again."));
          }
        } catch (error) {
          console.error("Photo upload error:", error);
          setFormError("Failed to upload photo to Cloudinary secure server.");
        } finally {
          setUploadingPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appForm.fullName || !appForm.role || !appForm.email || !appForm.phone) {
      setFormError("Please fill out all required fields.");
      return;
    }

    setFormLoading(true);
    setFormError("");
    setFormSuccess(false);

    try {
      const res = await fetch("/api/team/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormSuccess(true);
        setAppForm({
          fullName: "",
          role: "",
          category: "General Members",
          bio: "",
          affiliation: "",
          email: "",
          phone: "",
          photoUrl: ""
        });
      } else {
        setFormError(data.error || "Failed to submit application.");
      }
    } catch (err) {
      console.error("Team application submit error:", err);
      setFormError("Network error. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // Filter team based on selected category dropdown (Exactly like 3rd screenshot)
  const filteredTeam = selectedCategory === "All Categories" 
    ? teamList 
    : teamList.filter(m => m.category === selectedCategory);

  // Default mock fallback avatars if photo is empty (academic illustrations)
  const getAvatarUrl = (member: TeamMember) => {
    if (member.photoUrl) return member.photoUrl;
    // High-quality professional standard placeholder headshots
    if (member.fullName.toLowerCase().includes("hari") || member.fullName.toLowerCase().includes("ram")) {
      return "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256";
    }
    if (member.fullName.toLowerCase().includes("sarita") || member.fullName.toLowerCase().includes("uma")) {
      return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256";
    }
    return "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256";
  };

  return (
    <div className="w-full px-4 md:px-8 py-8">
      {/* Detail Modal */}
      {selectedMemberDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 p-6 max-w-sm w-full shadow-lg relative">
            <button 
              onClick={() => setSelectedMemberDetails(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
            <div className="flex flex-col items-center text-center">
              <img 
                src={getAvatarUrl(selectedMemberDetails)} 
                alt={selectedMemberDetails.fullName}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#1e5894] shadow-sm mb-3"
              />
              <h4 className="text-base font-bold text-slate-800 font-serif">{selectedMemberDetails.fullName}</h4>
              <span className="text-xs text-indigo-700 font-bold uppercase tracking-wider">{selectedMemberDetails.role}</span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{selectedMemberDetails.affiliation}</p>
              
              <div className="w-full border-t border-slate-100 my-4 pt-3 text-left space-y-2 text-xs">
                <p className="text-slate-600 italic text-center">
                  "{selectedMemberDetails.bio || "No custom quote specified."}"
                </p>
                <div className="pt-2 border-t border-slate-50">
                  <span className="text-slate-400 block text-[10px] uppercase">Email Contact:</span>
                  <a href={`mailto:${selectedMemberDetails.email}`} className="text-[#1e5894] font-semibold hover:underline">
                    {selectedMemberDetails.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Direct Line:</span>
                  <span className="text-slate-700 font-mono font-semibold">{selectedMemberDetails.phone}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMemberDetails(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold px-4 py-1.5 rounded w-full transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Directory Header and category filter (Matches 3rd screenshot layout exactly!) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4 mb-8">
        <div>
          <h2 className="text-[#1e5894] text-xl sm:text-2xl font-serif font-bold">
            Team Members
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            The intellectual force behind our learning platform.
          </p>
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-slate-300 text-xs font-semibold text-slate-700 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1e5894]"
          >
            <option value="All Categories">All Categories</option>
            <option value="Executive Committee">Executive Committee</option>
            <option value="Advisory Board">Advisory Board</option>
            <option value="Staff">Staff</option>
            <option value="General Members">General Members</option>
          </select>
        </div>
      </div>

      {/* Grid of Team Cards */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">
          Loading team directory...
        </div>
      ) : filteredTeam.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs border border-dashed rounded bg-slate-50">
          No approved members found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTeam.map((member) => (
            <div 
              key={member.id} 
              className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 text-center flex flex-col justify-between items-center transition-all hover:shadow-md"
            >
              <div className="flex flex-col items-center">
                {/* Oval/round picture */}
                <img 
                  src={getAvatarUrl(member)}
                  alt={member.fullName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#1e5894] shadow-sm mb-3.5"
                />
                
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 font-serif leading-tight">
                  {member.fullName}
                </h3>
                
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block mt-1">
                  {member.role}
                </span>

                {member.bio && (
                  <p className="text-[11px] text-slate-500 italic mt-3 leading-relaxed px-1">
                    "{member.bio}"
                  </p>
                )}

                <div className="mt-3 text-[10px] text-slate-400 space-y-0.5 font-medium">
                  <span className="block">{member.affiliation || "CME Academic Officer"}</span>
                  <span className="block font-mono text-slate-500">{member.email}</span>
                  <span className="block font-mono text-slate-500">Phone: {member.phone}</span>
                </div>
              </div>

              <div className="w-full mt-4 pt-3 border-t border-slate-100">
                <button 
                  onClick={() => setSelectedMemberDetails(member)}
                  className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold py-1.5 rounded transition-colors text-center uppercase tracking-wide"
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Team Application Form Panel (Human Craft, perfectly normal design, no big buttons, no big text) */}
      <div className="mt-16 bg-white border border-slate-200 rounded-lg p-6 max-w-2xl mx-auto shadow-sm">
        <div className="border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
          <Plus className="w-4.5 h-4.5 text-amber-500 shrink-0" />
          <h3 className="text-sm sm:text-base font-bold text-slate-800 font-serif">
            Apply to Join the Team / Professional Panel
          </h3>
        </div>

        {formSuccess ? (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded text-xs text-center">
            <p className="font-bold">Your Application Has Been Dispatched!</p>
            <p className="mt-1 font-medium text-slate-600">
              The General Secretary will review your professional profile during the next executive audit. If approved, your team card will automatically generate in this directory. Thank you!
            </p>
            <button 
              onClick={() => setFormSuccess(false)}
              className="mt-4 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold px-4 py-1.5 rounded transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Bishal Codes"
                  value={appForm.fullName}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">
                  Proposed Role / Specialty *
                </label>
                <input
                  type="text"
                  name="role"
                  required
                  placeholder="e.g. Regional Training Director"
                  value={appForm.role}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">
                  Panel Classification *
                </label>
                <select
                  name="category"
                  value={appForm.category}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-semibold text-slate-700"
                >
                  <option value="Executive Committee">Executive Committee</option>
                  <option value="Advisory Board">Advisory Board</option>
                  <option value="Staff">Administrative Staff</option>
                  <option value="General Members">General Members</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">
                  Institution Affiliation
                </label>
                <input
                  type="text"
                  name="affiliation"
                  placeholder="e.g. Try For Learn"
                  value={appForm.affiliation}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">
                  Official Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. developer@bishal.com"
                  value={appForm.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">
                  Mobile / Phone Line *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. 9827801575"
                  value={appForm.phone}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-mono font-medium text-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">
                  Professional Bio / Short Statement (e.g. quote inside card)
                </label>
                <textarea
                  name="bio"
                  rows={2}
                  maxLength={180}
                  placeholder="e.g. 'A complete digital Teacher'"
                  value={appForm.bio}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-medium text-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">
                  Upload Profile Photograph
                </label>
                <div className="flex items-center gap-3 mt-1">
                  <label className={`border border-slate-300 rounded px-3 py-1.5 font-semibold flex items-center gap-1.5 ${uploadingPhoto ? 'bg-amber-50 text-amber-700 cursor-not-allowed' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'}`}>
                    {uploadingPhoto ? (
                      <>
                        <div className="w-3 h-3 border-2 border-t-transparent border-amber-600 rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                        <span>Upload Picture</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploadingPhoto}
                    />
                  </label>
                  {uploadingPhoto ? (
                    <span className="text-amber-600 font-medium animate-pulse">Contacting Cloudinary secure storage...</span>
                  ) : appForm.photoUrl ? (
                    <div className="flex items-center gap-2">
                      <span className="text-green-700 font-semibold font-serif">✓ Photo uploaded</span>
                      <a href={appForm.photoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">View</a>
                    </div>
                  ) : (
                    <span className="text-slate-400">Attach PNG or JPG format</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={formLoading}
                className="bg-[#1e5894] hover:bg-[#123d6a] text-white font-semibold px-5 py-2 rounded shadow-sm transition-colors text-xs font-mono tracking-wider"
              >
                {formLoading ? "SENDING..." : "SUBMIT APPLICATION"}
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}

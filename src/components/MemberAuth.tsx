import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  LogOut, 
  FileText, 
  PlusCircle, 
  QrCode, 
  Award, 
  Printer, 
  Calendar,
  AlertCircle,
  Clock,
  UserCheck,
  Phone
} from "lucide-react";
import { getFirebaseClient } from "../lib/firebaseClient";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser
} from "firebase/auth";

interface MemberAuthProps {
  setView: (view: string) => void;
  user: FirebaseUser | null;
  onAdminLoginSuccess?: () => void;
}

export default function MemberAuth({ setView, user, onAdminLoginSuccess }: MemberAuthProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [myMemberships, setMyMemberships] = useState<any[]>([]);
  const [fetchingMemberships, setFetchingMemberships] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your registered email address first.");
      setSuccess("");
      return;
    }
    setResetLoading(true);
    setError("");
    setSuccess("");
    try {
      const { auth } = await getFirebaseClient();
      await sendPasswordResetEmail(auth, email.trim());
      setSuccess(`A password reset link has been successfully dispatched to ${email}. Please check your inbox or spam folder.`);
    } catch (err: any) {
      console.error("Password reset failure:", err);
      setError(err.message || "Failed to transmit password reset link.");
    } finally {
      setResetLoading(false);
    }
  };

  // Fetch memberships for the logged in user
  useEffect(() => {
    if (user && user.email) {
      setFetchingMemberships(true);
      fetch(`/api/memberships/my?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setMyMemberships(data);
          }
        })
        .catch(err => console.error("Error fetching memberships:", err))
        .finally(() => setFetchingMemberships(false));
    }
  }, [user]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all credentials fields.");
      return;
    }
    setLoading(true);
    setError("");

    // Check if administrative credentials were typed into the unified login form
    if (email.trim().toLowerCase() === "admin" && password === "admin@123") {
      try {
        setSuccess("Administrator logged in successfully!");
        if (onAdminLoginSuccess) {
          onAdminLoginSuccess();
        }
        setView("admin");
      } catch (err: any) {
        console.error("Admin sign in redirect error:", err);
        setError("Failed to route to Administrator controls.");
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const { auth } = await getFirebaseClient();
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Logged in successfully!");
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err.message || "Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName || !phoneNumber) {
      setError("All fields (including Phone Number) are required for scholar registration.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { auth } = await getFirebaseClient();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: fullName
      });

      // Synchronize newly created user profile to backend database
      await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          fullName,
          phoneNumber
        })
      });

      setSuccess("Account created successfully!");
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(err.message || "Failed to register account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const { auth } = await getFirebaseClient();
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Auto-register Google login credentials into custom Users Profile collection
      if (userCredential.user) {
        await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: userCredential.user.email,
            fullName: userCredential.user.displayName || "Google Scholar User",
            phoneNumber: userCredential.user.phoneNumber || ""
          })
        }).catch(err => console.warn("Google registration profiling sync skipped:", err));
      }

      setSuccess("Logged in with Google successfully!");
    } catch (err: any) {
      console.error("Google sign in error:", err);
      if (err?.code === "auth/popup-blocked") {
        setError("Sign-In popup was blocked. Please allow popups or use the standard Email/Password Sign-In form.");
      } else {
        setError(err.message || "Failed to Sign-In with Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { auth } = await getFirebaseClient();
      await signOut(auth);
      setSuccess("Signed out successfully.");
      setMyMemberships([]);
    } catch (err: any) {
      console.error("Sign out error:", err);
    }
  };

  const handlePrintCard = () => {
    window.print();
  };

  // 1. Authenticated member dashboard layout
  if (user) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8 no-print">
          <div className="bg-gradient-to-r from-[#1e5894] to-[#2c75bc] px-6 py-6 md:px-8 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  CME Member Hub
                </span>
                {user.emailVerified && (
                  <span className="bg-blue-600/50 text-blue-200 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-300" />
                    Verified User
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-bold font-serif mt-2">
                Scholar Portal & Registry
              </h2>
              <p className="text-sm text-blue-100 mt-1">
                Manage your credentials, professional profiles, and national society memberships.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-white">
                  {user.displayName || "CME Scholar"}
                </div>
                <div className="text-xs text-blue-100">{user.email}</div>
              </div>

              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-lg text-amber-300">
                {(user.displayName || "C")[0].toUpperCase()}
              </div>

              <button
                onClick={handleSignOut}
                className="bg-slate-900/40 hover:bg-slate-950/60 border border-white/20 px-3.5 py-1.5 rounded-md text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
              >
                <LogOut className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* User profile & details sidebar */}
          <div className="lg:col-span-1 space-y-6 no-print">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-3 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[#1e5894]" />
                Scholar Profile
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <span className="block text-slate-400 font-medium mb-1">Full Legal Name</span>
                  <span className="font-bold text-slate-700 text-sm">
                    {user.displayName || "Not Configured"}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium mb-1">Registered Email</span>
                  <span className="font-semibold text-slate-700 text-sm">{user.email}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium mb-1">Account Created On</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {user.metadata.creationTime 
                      ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
                      : "Today"
                    }
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium mb-1">Scholar UID</span>
                  <span className="font-mono text-[11px] bg-slate-100 px-2 py-1 rounded text-slate-600 block break-all">
                    {user.uid}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-5 text-xs text-slate-700 space-y-2.5">
              <h4 className="font-bold text-[#1e5894] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                CME Digital Identity Benefits
              </h4>
              <p className="leading-relaxed">
                As a registered portal user, you can easily apply for General or Life memberships. Your application data is saved and verified directly by the central secretariat in Lalitpur. Once approved, your digital card acts as an official endorsement credential.
              </p>
            </div>
          </div>

          {/* Memberships column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm no-print">
              <div className="flex justify-between items-center border-b pb-4 mb-5">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-[#1e5894]" />
                  My CME Memberships
                </h3>
                <button
                  onClick={() => setView("membership")}
                  className="bg-[#1e5894] hover:bg-blue-800 text-white font-semibold text-xs px-3.5 py-1.5 rounded-md flex items-center gap-1.5 transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                  <span>New Application</span>
                </button>
              </div>

              {fetchingMemberships ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e5894] mb-3"></div>
                  <span className="text-xs">Fetching registry entries...</span>
                </div>
              ) : myMemberships.length === 0 ? (
                <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-lg">
                  <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-700">No Registry Entry Found</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                    We did not find any active or pending CME membership applications associated with your registered email <strong className="text-slate-600">{user.email}</strong>.
                  </p>
                  <button
                    onClick={() => setView("membership")}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#1e5894] hover:underline"
                  >
                    <span>Apply for Online Membership now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myMemberships.map((membership) => (
                    <div 
                      key={membership.id} 
                      className={`border rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                        membership.status === "Approved" 
                          ? "border-green-200 bg-green-50/20" 
                          : membership.status === "Rejected"
                          ? "border-red-200 bg-red-50/20"
                          : "border-amber-200 bg-amber-50/10"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-slate-800 text-sm">
                            {membership.fullName}
                          </span>
                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">
                            {membership.membershipType} Member
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          Application Serial No: <strong className="text-slate-700">{membership.serialNo || "Pending Allocation"}</strong>
                        </div>
                        <div className="text-xs text-slate-400">
                          Submitted On: {new Date(membership.submittedAt).toLocaleDateString()}
                        </div>
                        {membership.membershipId && (
                          <div className="text-xs text-[#1e5894] font-bold">
                            Official CME License ID: {membership.membershipId}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {membership.status === "Approved" ? (
                          <span className="bg-green-100 text-green-800 border border-green-200 text-xs px-2.5 py-1 rounded font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                            Approved
                          </span>
                        ) : membership.status === "Rejected" ? (
                          <span className="bg-red-100 text-red-800 border border-red-200 text-xs px-2.5 py-1 rounded font-bold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                            Rejected
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs px-2.5 py-1 rounded font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                            Pending Verification
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Approved Digital Card Display */}
            {myMemberships.some(m => m.status === "Approved") && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm no-print">
                  <div className="flex justify-between items-center border-b pb-3 mb-5">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-amber-500" />
                      Official Digital Credentials
                    </h3>
                    <button
                      onClick={handlePrintCard}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Card</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    Below is your official CME Digital Membership Card. You can print this card or export it as a PDF for school licensing, board validation, or credential submissions.
                  </p>
                </div>

                {/* The premium human-crafted Digital Membership Card itself */}
                {myMemberships.filter(m => m.status === "Approved").map((membership) => (
                  <div 
                    key={`card-${membership.id}`} 
                    className="w-full max-w-lg mx-auto bg-gradient-to-br from-[#12223a] to-[#1e3c66] text-white rounded-2xl p-6 shadow-xl border-2 border-amber-400/50 relative overflow-hidden font-sans"
                  >
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-400/5 rounded-full blur-xl -ml-16 -mb-16 pointer-events-none"></div>

                    {/* Card Header */}
                    <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4 relative z-10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-white border border-white/20 rounded-md flex items-center justify-center p-0.5">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-[#1e5894]">
                            <polygon points="50,5 95,28 5,28" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="3" />
                            <polygon points="50,15 85,32 15,32" fill="currentColor" stroke="currentColor" strokeWidth="2" />
                            <rect x="20" y="32" width="60" height="52" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
                            <line x1="20" y1="48" x2="80" y2="48" stroke="currentColor" strokeWidth="3" />
                            <line x1="32" y1="32" x2="32" y2="84" stroke="currentColor" strokeWidth="1.5" />
                            <line x1="44" y1="32" x2="44" y2="84" stroke="currentColor" strokeWidth="1.5" />
                            <line x1="56" y1="32" x2="56" y2="84" stroke="currentColor" strokeWidth="1.5" />
                            <line x1="68" y1="32" x2="68" y2="84" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="32" cy="40" r="3.5" fill="currentColor" />
                            <circle cx="44" cy="40" r="3.5" fill="currentColor" />
                            <circle cx="56" cy="40" r="3.5" fill="currentColor" />
                            <circle cx="68" cy="40" r="3.5" fill="currentColor" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-[13px] font-bold font-serif tracking-wide text-white uppercase leading-tight">
                            Council for Mathematics Education
                          </h4>
                          <span className="text-[9px] text-amber-300 font-semibold tracking-wider uppercase block">
                            Regd. No. 843/054-055, Lalitpur, Nepal
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded uppercase">
                        {membership.membershipType}
                      </span>
                    </div>

                    {/* Card Content Profile Grid */}
                    <div className="grid grid-cols-4 gap-4 items-center mb-4 relative z-10">
                      {/* Photo Holder */}
                      <div className="col-span-1 flex justify-center">
                        {membership.photoUrl ? (
                          <img 
                            src={membership.photoUrl} 
                            alt={membership.fullName} 
                            referrerPolicy="no-referrer"
                            className="w-18 h-22 object-cover rounded-md border-2 border-amber-400/40 bg-[#162e4c]" 
                          />
                        ) : (
                          <div className="w-18 h-22 rounded-md border-2 border-dashed border-white/20 flex flex-col items-center justify-center bg-white/5">
                            <User className="w-7 h-7 text-white/35" />
                            <span className="text-[8px] text-white/40 mt-1">NO PHOTO</span>
                          </div>
                        )}
                      </div>

                      {/* Info details */}
                      <div className="col-span-3 space-y-2 text-xs">
                        <div>
                          <span className="text-[9px] text-white/50 block">MEMBER FULL NAME</span>
                          <span className="font-bold text-sm tracking-wide text-white">
                            {membership.fullName}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[9px] text-white/50 block">MEMBERSHIP ID</span>
                            <span className="font-bold font-mono text-amber-300">
                              {membership.membershipId || "MEC-2026-PEND"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-white/50 block">QUALIFICATION</span>
                            <span className="font-semibold text-white/95">
                              {membership.qualification || "Educator"}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] text-white/50 block">AFFILIATION / INSTITUTION</span>
                          <span className="font-semibold text-white/95 text-[11px] truncate block">
                            {membership.affiliation || "CME Academic Society"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer details */}
                    <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-2 relative z-10">
                      <div className="text-[9px] text-white/40 font-mono space-y-0.5">
                        <div>SER NO: {membership.serialNo}</div>
                        <div>ISSUED ON: {new Date(membership.submittedAt).toLocaleDateString()}</div>
                        <div>VALIDITY: PERPETUAL / NON-TRANSFERABLE</div>
                      </div>

                      {/* Official Verified badge */}
                      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        <div className="text-right">
                          <span className="text-[8px] text-white/40 block leading-none">CME OFFICE</span>
                          <span className="text-[9px] font-bold text-emerald-400 leading-none">VERIFIED SEC.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Print-Only view styles injected dynamically */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            .no-print {
              display: none !important;
            }
            [key*="card-"] {
              visibility: visible !important;
              position: absolute !important;
              left: 50% !important;
              top: 10% !important;
              transform: translateX(-50%) !important;
              width: 500px !important;
              border: 2px solid #000 !important;
              background: #12223a !important;
              color: white !important;
              box-shadow: none !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            [key*="card-"] * {
              visibility: visible !important;
            }
          }
        `}} />
      </div>
    );
  }

  // 2. Unauthenticated Form layout (Professional Slate styling, absolutely no popup style)
  return (
    <div className="w-full max-w-md mx-auto px-4 py-16 no-print">
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-8 relative overflow-hidden">
        
        {/* Top brand header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-full bg-blue-50 border border-blue-200 items-center justify-center mb-3">
            <UserCheck className="w-6 h-6 text-[#1e5894]" />
          </div>
          <h2 className="text-xl font-bold font-serif text-[#1e5894]">
            {activeTab === "signin" ? "Login" : "Signup"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {activeTab === "signin" ? "Access your membership account" : "Create a new membership account"}
          </p>
        </div>

        {/* Dual Tab switches */}
        <div className="flex border-b border-slate-200 mb-6 bg-slate-50 p-1 rounded-lg">
          <button
            onClick={() => {
              setActiveTab("signin");
              setError("");
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === "signin"
                ? "bg-white text-[#1e5894] shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setActiveTab("signup");
              setError("");
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === "signup"
                ? "bg-white text-[#1e5894] shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Signup
          </button>
        </div>

        {/* Action Error / Success alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-lg text-xs mb-5 flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-lg text-xs mb-5 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{success}</p>
          </div>
        )}

        {/* Authentication submit form */}
        {activeTab === "signin" ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Email / Admin Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. developer@bishal.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 focus:border-[#1e5894] focus:ring-1 focus:ring-[#1e5894] rounded-lg outline-none transition-all font-medium text-slate-800 bg-white placeholder:text-slate-400"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Account Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="text-[10px] font-bold text-[#1e5894] hover:underline focus:outline-none"
                >
                  {resetLoading ? "Sending reset..." : "Forgot Password?"}
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 focus:border-[#1e5894] focus:ring-1 focus:ring-[#1e5894] rounded-lg outline-none transition-all font-medium text-slate-800 bg-white placeholder:text-slate-400"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e5894] hover:bg-blue-800 disabled:bg-slate-300 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {loading ? (
                <div className="w-4.5 h-4.5 border-b-2 border-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Full Legal Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Bishal Codes"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 focus:border-[#1e5894] focus:ring-1 focus:ring-[#1e5894] rounded-lg outline-none transition-all font-medium text-slate-800 bg-white placeholder:text-slate-400"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Registry Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. developer@bishal.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 focus:border-[#1e5894] focus:ring-1 focus:ring-[#1e5894] rounded-lg outline-none transition-all font-medium text-slate-800 bg-white placeholder:text-slate-400"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Phone / Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +977-98XXXXXXXX"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 focus:border-[#1e5894] focus:ring-1 focus:ring-[#1e5894] rounded-lg outline-none transition-all font-medium text-slate-800 bg-white placeholder:text-slate-400"
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Secure Account Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 focus:border-[#1e5894] focus:ring-1 focus:ring-[#1e5894] rounded-lg outline-none transition-all font-medium text-slate-800 bg-white placeholder:text-slate-400"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e5894] hover:bg-blue-800 disabled:bg-slate-300 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {loading ? (
                <div className="w-4.5 h-4.5 border-b-2 border-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Central Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Divider Stripe */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Academic Federations
          </span>
        </div>

        {/* Pro style Google Sign-In (Official Brand Guidelines implementation, no popup style) */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          type="button"
          className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-lg border border-slate-300 flex items-center justify-center gap-3 transition-all hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-400 cursor-pointer active:scale-[0.98]"
        >
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          <span>Continue with Google</span>
        </button>

      </div>
    </div>
  );
}

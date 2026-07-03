import React, { useState, useEffect } from "react";
import { useToast } from "./Toast";
import { 
  FileText, 
  Upload, 
  Info, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  AlertCircle,
  Clock,
  User,
  CheckCircle2,
  Camera
} from "lucide-react";

interface MembershipFormProps {
  onSuccess: (data: any) => void;
  user?: any;
}

export default function MembershipForm({ onSuccess, user }: MembershipFormProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    membershipType: "General",
    fullName: "",
    gender: "Male",
    qualification: "",
    affiliation: "",
    contactAddress: "",
    mobileNo: "",
    officeContactNo: "",
    email: "",
    institution: "",
    designation: "",
    institutionPhone: "",
    institutionEmail: "",
    proposedBy: "",
    proposedAddress: "",
    proposedDesignation: "",
    proposedDate: "",
    paymentMethod: "QR Code",
    voucherNo: "",
    paymentDate: new Date().toISOString().split("T")[0],
    signatureName: "",
    photoUrl: "",
    voucherUrl: ""
  });

  // Auto-fill form fields when a logged in user accesses the form
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.displayName || "",
        email: prev.email || user.email || ""
      }));
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successModal, setSuccessModal] = useState<any>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingVoucher, setUploadingVoucher] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'photoUrl' | 'voucherUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      if (field === 'photoUrl') setUploadingPhoto(true);
      else setUploadingVoucher(true);

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              file: reader.result as string, 
              folder: "memberships" 
            })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setFormData(prev => ({
              ...prev,
              [field]: data.url
            }));
            showToast(
              `Uploaded ${field === 'photoUrl' ? 'candidate photograph' : 'bank voucher receipt'} successfully!`,
              "success",
              "File Uploaded"
            );
          } else {
            setErrorMessage("File upload failed: " + (data.error || "Please try again."));
            showToast(
              data.error || "File upload failed. Please verify the file type and size.",
              "error",
              "Upload Failed"
            );
          }
        } catch (error) {
          console.error("Upload error:", error);
          setErrorMessage("Failed to upload file to Cloudinary server.");
          showToast(
            "Cloudinary file storage node could not be reached. Please check your connection.",
            "error",
            "Storage Engine Offline"
          );
        } finally {
          if (field === 'photoUrl') setUploadingPhoto(false);
          else setUploadingVoucher(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.mobileNo) {
      setErrorMessage("Please complete the required Personal Information fields (Full Name, Email, and Mobile No.)");
      showToast(
        "Please complete all mandatory personal information fields.",
        "warning",
        "Form Validation"
      );
      return;
    }
    if (!formData.voucherNo) {
      setErrorMessage("Payment verification is mandatory. Please provide a Voucher Number / Transaction reference.");
      showToast(
        "A bank voucher transaction reference or screenshot is required for official verification.",
        "warning",
        "Verification Required"
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setSuccessModal(resData.data);
        onSuccess(resData.data);
        showToast(
          `Membership application registered under Serial No. ${resData.data.serialNo}.`,
          "success",
          "Application Submitted!"
        );
        // Reset form
        setFormData({
          membershipType: "General",
          fullName: "",
          gender: "Male",
          qualification: "",
          affiliation: "",
          contactAddress: "",
          mobileNo: "",
          officeContactNo: "",
          email: "",
          institution: "",
          designation: "",
          institutionPhone: "",
          institutionEmail: "",
          proposedBy: "",
          proposedAddress: "",
          proposedDesignation: "",
          proposedDate: "",
          paymentMethod: "QR Code",
          voucherNo: "",
          paymentDate: new Date().toISOString().split("T")[0],
          signatureName: "",
          photoUrl: "",
          voucherUrl: ""
        });
      } else {
        setErrorMessage(resData.error || "Failed to submit membership application.");
        showToast(
          resData.error || "Failed to submit membership application. Please try again.",
          "error",
          "Submission Failed"
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("Network error. Please try again later.");
      showToast(
        "Failed to reach the CME server database. Check your internet connection.",
        "error",
        "Network Interrupted"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-8">
      {/* SUCCESS MODAL */}
      {successModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-lg w-full p-6 shadow-xl text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Application Submitted Successfully
            </h3>
            <div className="mt-3 text-xs text-slate-500 space-y-2 text-left bg-slate-50 p-4 rounded border border-slate-200">
              <div className="flex justify-between border-b pb-1">
                <span>Temporary Serial No:</span>
                <span className="font-bold font-mono text-slate-800">{successModal.serialNo}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span>Applicant Name:</span>
                <span className="font-bold text-slate-800">{successModal.fullName}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span>Membership Class:</span>
                <span className="font-semibold text-slate-800">{successModal.membershipType} Membership</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>Verification Status:</span>
                <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px] font-bold">Pending Review</span>
              </div>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed mt-4">
              Our Academic Audit Committee will verify the payment voucher and details within 48 hours. Upon approval, your official certificate card will be available inside the admin portal.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setSuccessModal(null)}
                className="bg-[#1e5894] hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded shadow transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white border-2 border-slate-300 rounded-lg shadow-sm p-6 relative">
        {/* Paper style official header (matches physical form in screenshot) */}
        <div className="text-center border-b border-slate-200 pb-5 mb-6">
          <span className="text-xs text-slate-500 font-mono block text-right font-semibold">Regd No. 843/054-055, Lalitpur</span>
          
          <h2 className="text-[#1e5894] text-xl sm:text-2xl font-serif font-bold tracking-tight uppercase">
            Council for Mathematics Education
          </h2>
          <span className="inline-block bg-[#1e5894] text-white text-[11px] font-bold tracking-widest uppercase px-3 py-0.5 rounded mt-1">
            Membership Application Form
          </span>
          <p className="text-slate-500 text-[10px] mt-1 italic">
            ESTD 1991 • Manbhawan, Lalitpur, Nepal
          </p>
        </div>

        {/* Warning messages if any */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded mb-6 text-xs flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* A. Letter Opener & Membership Category selection */}
          <div className="space-y-3 bg-slate-50 p-4 rounded border border-slate-200">
            <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed font-serif">
              Dear Sir,
              <br />
              I would like to apply for the <strong className="text-[#1e5894]">Life / General / International</strong> membership of the Council for Mathematics Education with the following personal and academic details.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Membership Class *
                </label>
                <select
                  name="membershipType"
                  value={formData.membershipType}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-medium"
                >
                  <option value="General">General (NPR 300 total first year)</option>
                  <option value="Life">Life (NPR 3000 one-time)</option>
                  <option value="International">International Scholar</option>
                </select>
              </div>

              {/* Photo placeholder area mirroring the paper's photo slot */}
              <div className="sm:col-span-2 flex items-center gap-4 justify-end">
                <div className="text-right">
                  <span className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Candidate Photo *</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Formal passport size portrait</span>
                </div>
                <label className="w-16 h-18 border-2 border-dashed border-slate-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors relative overflow-hidden">
                  {uploadingPhoto ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-4 h-4 border-2 border-t-transparent border-amber-500 rounded-full animate-spin"></div>
                      <span className="text-[8px] text-amber-600 font-bold mt-1">Saving...</span>
                    </div>
                  ) : formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Uploaded candidate" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span className="text-[9px] text-slate-400 font-bold mt-1">Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, "photoUrl")}
                    className="hidden"
                    disabled={uploadingPhoto}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* B. Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#1e5894] uppercase tracking-wider border-b border-slate-200 pb-1">
              1. Personal Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Name in (BLOCK LETTERS) *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. SARITA ADHIKARI"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1e5894] placeholder-slate-300 uppercase"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Highest Qualification *
                </label>
                <input
                  type="text"
                  name="qualification"
                  placeholder="e.g. M.Sc. Mathematics"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1e5894]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Affiliation / Research Body
                </label>
                <input
                  type="text"
                  name="affiliation"
                  placeholder="e.g. Tribhuvan University / Kathmandu University"
                  value={formData.affiliation}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1e5894]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Contact Address (Permanent / Current) *
                </label>
                <input
                  type="text"
                  name="contactAddress"
                  required
                  placeholder="e.g. Manbhawan, Lalitpur, Ward 5"
                  value={formData.contactAddress}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1e5894]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Mobile No *
                </label>
                <input
                  type="tel"
                  name="mobileNo"
                  required
                  placeholder="e.g. 9841XXXXXX"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Office Contact No
                </label>
                <input
                  type="tel"
                  name="officeContactNo"
                  placeholder="e.g. 01-55XXXXX"
                  value={formData.officeContactNo}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. name@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1e5894]"
                />
              </div>
            </div>
          </div>

          {/* C. Institutional Context (For official verification) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#1e5894] uppercase tracking-wider border-b border-slate-200 pb-1">
              2. Professional / Institutional Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Institution Name (Current Workplace)
                </label>
                <input
                  type="text"
                  name="institution"
                  placeholder="e.g. Lalitpur High School"
                  value={formData.institution}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1e5894]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  name="designation"
                  placeholder="e.g. Senior Math Teacher"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1e5894]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Institution Telephone
                </label>
                <input
                  type="tel"
                  name="institutionPhone"
                  placeholder="e.g. 01-44XXXXX"
                  value={formData.institutionPhone}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Institution Email
                </label>
                <input
                  type="email"
                  name="institutionEmail"
                  placeholder="e.g. contact@school.edu.np"
                  value={formData.institutionEmail}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1e5894]"
                />
              </div>
            </div>
          </div>

          {/* D. Proposer details (matches paper form constraint: proposed by a member of the council) */}
          <div className="space-y-4 bg-slate-50 p-4 rounded border border-slate-200">
            <h3 className="text-xs font-bold text-[#1e5894] uppercase tracking-wider border-b border-slate-200 pb-1">
              3. Proposed By (CME Council Member Verification)
            </h3>
            <p className="text-[10px] text-slate-500 italic">
              Note: Persons seeking (Life / General) membership must be proposed/seconded by an active registered member of the Council.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Proposer Name
                </label>
                <input
                  type="text"
                  name="proposedBy"
                  placeholder="e.g. Prof. Dr. Hari Prasad Upadhyay"
                  value={formData.proposedBy}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1e5894]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Proposer Designation / Address
                </label>
                <input
                  type="text"
                  name="proposedDesignation"
                  placeholder="e.g. CME President"
                  value={formData.proposedDesignation}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1e5894]"
                />
              </div>
            </div>
          </div>

          {/* E. Payment Information & Scan-to-pay QR mirroring physical screenshot */}
          <div className="space-y-4 border-t border-slate-200 pt-5">
            <h3 className="text-xs font-bold text-[#1e5894] uppercase tracking-wider border-b border-slate-200 pb-1">
              4. Membership Fee & Payment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              
              {/* Fee description column */}
              <div className="md:col-span-3 space-y-3.5">
                <div className="bg-slate-50 p-3.5 rounded border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <span className="font-bold text-slate-800 block mb-1">Official CME Fee Structure:</span>
                  <div className="flex justify-between border-b pb-1 border-slate-200">
                    <span>Entrance Processing Fee (All categories):</span>
                    <span className="font-bold font-mono">NRs. 50</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 border-slate-200">
                    <span>General Membership Subscriptions:</span>
                    <span className="font-bold font-mono">NPR. 100 Entry + 200 Annual</span>
                  </div>
                  <div className="flex justify-between text-amber-900 font-semibold bg-amber-100/40 p-1.5 rounded">
                    <span>Life Membership (Lifelong card):</span>
                    <span className="font-bold font-mono">NPR. 3000 (No yearly fees)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Payment Mode *
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-medium"
                    >
                      <option value="QR Code">FONEPAY / eSewa QR Scan</option>
                      <option value="Bank Transfer">Direct Bank Transfer</option>
                      <option value="Money Order">Money Order / Draft</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Voucher / TXN Reference No *
                    </label>
                    <input
                      type="text"
                      name="voucherNo"
                      required
                      placeholder="e.g. TXN-108239A"
                      value={formData.voucherNo}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Upload Payment Receipt (Voucher Image)
                    </label>
                    <div className="flex items-center gap-3 mt-1">
                      <label className={`border border-slate-300 rounded px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 ${uploadingVoucher ? 'bg-amber-50 text-amber-700 cursor-not-allowed' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'}`}>
                        {uploadingVoucher ? (
                          <>
                            <div className="w-3 h-3 border-2 border-t-transparent border-amber-600 rounded-full animate-spin"></div>
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 text-slate-500" />
                            <span>Upload Screenshot</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, "voucherUrl")}
                          className="hidden"
                          disabled={uploadingVoucher}
                        />
                      </label>
                      {uploadingVoucher ? (
                        <span className="text-[10px] text-amber-600 font-medium animate-pulse">Contacting Cloudinary secure storage...</span>
                      ) : formData.voucherUrl ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-green-700 font-semibold">✓ Voucher receipt uploaded</span>
                          <a href={formData.voucherUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 underline">View</a>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">Attach bank transfer statement or slip</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* QR payment image placeholder mirroring physical form QR code in screenshot */}
              <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase font-bold text-[#1e5894] tracking-wider block mb-1">
                  Scan to Pay CME
                </span>
                <div className="w-32 h-32 bg-white border border-slate-300 rounded p-1.5 flex items-center justify-center shadow-sm relative">
                  {/* Digital QR Code Pattern Mock */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800">
                    {/* Corners */}
                    <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                    <rect x="12" y="12" width="11" height="11" fill="currentColor" />
                    <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                    <rect x="77" y="12" width="11" height="11" fill="currentColor" />
                    <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                    <rect x="12" y="77" width="11" height="11" fill="currentColor" />
                    
                    {/* Tiny random patterns representing QR lines */}
                    <rect x="40" y="10" width="15" height="5" fill="currentColor" />
                    <rect x="40" y="25" width="5" height="15" fill="currentColor" />
                    <rect x="55" y="20" width="10" height="10" fill="currentColor" />
                    <rect x="10" y="40" width="5" height="15" fill="currentColor" />
                    <rect x="25" y="40" width="15" height="5" fill="currentColor" />
                    <rect x="45" y="45" width="10" height="10" fill="currentColor" />
                    <rect x="40" y="70" width="15" height="5" fill="currentColor" />
                    <rect x="45" y="80" width="5" height="10" fill="currentColor" />
                    <rect x="70" y="40" width="15" height="15" fill="currentColor" />
                    <rect x="85" y="60" width="10" height="5" fill="currentColor" />
                    <rect x="70" y="80" width="20" height="5" fill="currentColor" />
                    <rect x="80" y="70" width="5" height="10" fill="currentColor" />
                  </svg>
                  {/* Tiny center abacus logo for brand identity */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-0.5 border border-slate-300 rounded">
                    <span className="text-[7px] font-bold text-[#1e5894]">CME</span>
                  </div>
                </div>
                <span className="text-[9px] text-slate-500 font-bold mt-2 leading-tight">
                  fonepay / eSewa Merchant Wallet
                  <br />
                  <span className="text-[#1e5894]">Council for Mathematics Education</span>
                </span>
              </div>

            </div>
          </div>

          {/* F. Signature Validation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Candidate Electronic Signature *
              </label>
              <input
                type="text"
                name="signatureName"
                required
                placeholder="Type your full name to electronically sign"
                value={formData.signatureName}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-serif italic font-bold"
              />
              <span className="text-[9px] text-slate-400 block mt-1">
                By typing your name, you certify the correctness of all provided information.
              </span>
            </div>

            <div className="flex items-end justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1e5894] hover:bg-[#123d6a] text-white text-xs font-semibold px-6 py-2.5 rounded shadow-sm hover:shadow transition-all font-mono tracking-wider w-full sm:w-auto"
              >
                {loading ? "PROCESSING..." : "SUBMIT REGISTRATION"}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

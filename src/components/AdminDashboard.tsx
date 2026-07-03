import React, { useState, useEffect, useRef } from "react";
import { 
  Users, 
  GraduationCap, 
  Check, 
  X, 
  Eye, 
  Download, 
  Printer, 
  Lock, 
  ShieldAlert, 
  Clock, 
  FileText, 
  Mail, 
  Briefcase,
  ExternalLink,
  Edit2,
  CheckCircle2,
  UserCheck,
  Settings,
  MessageSquare,
  HelpCircle,
  Plus,
  Trash2,
  Save,
  Star,
  RefreshCw,
  Image as ImageIcon,
  UploadCloud,
  FolderOpen,
  Copy,
  FileDown,
  Book,
  LayoutDashboard,
  Activity,
  TrendingUp,
  MapPin,
  Sparkles,
  Globe,
  ArrowUp,
  ArrowDown,
  Menu,
  Send
} from "lucide-react";

import { 
  MembershipApplication, 
  TeamMember, 
  InquiryMessage, 
  SiteSettings, 
  BlogPost, 
  Testimonial, 
  FAQItem,
  Program,
  Publication
} from "../types";

import { getFirebaseClient } from "../lib/firebaseClient";
import { collection, onSnapshot, query } from "firebase/firestore";

const SEO_ROUTES = [
  { id: "home", name: "CME Portal Gateway / Home Page", defaultTitle: "Council for Mathematics Education (CME) | Nepal", defaultDesc: "The Council for Mathematics Education (CME) is Nepal's premier academic organization dedicated to mathematics education research, teacher workshops, and school curriculum development.", defaultKeywords: "mathematics education nepal, cme nepal, math teachers association, school syllabus lalitpur, mathematical research" },
  { id: "about", name: "About CME Page", defaultTitle: "About CME: History, Objectives & Academic Modernization | Council for Mathematics Education", defaultDesc: "Discover the history, objectives, academic modernization milestones, and executive mission of the Council for Mathematics Education (CME) in Lalitpur, Nepal.", defaultKeywords: "cme history, mathematical society nepal, education board, executive objectives, academic goals" },
  { id: "programs", name: "Academic Programs & Workshops", defaultTitle: "Academic Programs & Teacher Capacity Training Workshops | CME Nepal", defaultDesc: "Explore professional teacher training programs, state capacity workshops, pedagogical methods, and instructional development symposia hosted by CME Nepal.", defaultKeywords: "teacher training, mathematics workshop, math teaching methods, pedagogical skills, nepal education" },
  { id: "publications", name: "Publications & Books Archive", defaultTitle: "Academic Journals & Modernized School Syllabus Publications | CME", defaultDesc: "Access academic journals, school syllabi, textbook archives, research bulletins, and mathematics publications created by academic experts in Nepal.", defaultKeywords: "cme journals, syllabus archive, math textbook nepal, academic bulletin, scientific publications" },
  { id: "membership", name: "Online Membership Application", defaultTitle: "Apply for General, Institutional or Life Membership Online | CME Nepal", defaultDesc: "Join CME Nepal. Fill out the online membership registration form for Institutional, Life, or General Academic Membership to connect with mathematical scholars.", defaultKeywords: "register cme, math membership nepal, institutional membership, life member application" },
  { id: "member-portal", name: "Academic Member Central Portal", defaultTitle: "Academic Member Central Portal & Profile | CME", defaultDesc: "Log in to the CME Member Central Portal to access educational materials, directory records, and verify academic certifications.", defaultKeywords: "member dashboard cme, verify membership, teacher credentials nepal, academic portal" },
  { id: "team", name: "Executive Committee Directory", defaultTitle: "Executive Committee & Registered Members Directory | CME", defaultDesc: "Meet the executive committee, central advisory board, and registered academic scholars of the Council for Mathematics Education of Nepal.", defaultKeywords: "executive committee, advisory board, registered scholars cme, board of directors" },
  { id: "inquiry", name: "Interactive Helpdesk / Inquiries", defaultTitle: "Get in Touch, Support & Lalitpur Secretariat Coordinates | CME", defaultDesc: "Contact the CME Lalitpur Secretariat. Find phone numbers, map directions, email addresses, and send dynamic support inquiries directly to our administrative team.", defaultKeywords: "contact cme, lalitpur secretariat, mathematics council phone, support email" },
  { id: "faq", name: "FAQ & Guidelines Page", defaultTitle: "Frequently Asked Questions, Guidelines & Syllabi | CME", defaultDesc: "Find clear answers to frequently asked questions about membership registration fees, publication releases, and teacher training programs.", defaultKeywords: "cme faq, mathematics registration fees, training questions, syllabus inquiries" },
  { id: "search", name: "Search Syllabus & Database", defaultTitle: "Search Syllabus, Journals, Textbook Archives & Database | CME", defaultDesc: "Search the comprehensive database of mathematics resources, syllabus archives, journal documents, and academic publications of CME Nepal.", defaultKeywords: "search mathematics, find syllabus, lookup journals, math papers nepal" },
  { id: "blogs", name: "Blogs & Educational News", defaultTitle: "Blogs & Educational News | CME Nepal", defaultDesc: "Read the latest educational news, academic articles, mathematical research summaries, and pedagogical discussions from CME experts.", defaultKeywords: "math educational blog, teacher resources, math research news, pedagogical articles" }
];

const NEWSLETTER_TEMPLATES = [
  {
    id: "standard",
    name: "General Update / Monthly Digest",
    subject: "CME Nepal Monthly Academic Digest & Updates",
    content: `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; color: #334155;">
  <div style="background-color: #1e5894; color: white; padding: 24px; text-align: center; border-radius: 6px 6px 0 0;">
    <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">Nepal Mathematics Council</h1>
    <p style="margin: 4px 0 0 0; font-size: 13px; color: #93c5fd; text-transform: uppercase; font-weight: bold;">Monthly Digest & Academic Updates</p>
  </div>
  <div style="padding: 24px 16px; line-height: 1.6;">
    <p style="margin-top: 0;">Dear Respected Scholar / Member,</p>
    <p>We are delighted to bring you the latest monthly digest and institutional highlights from the <strong>Council for Mathematics Education (CME), Lalitpur</strong>. Our team has been actively coordinating national-level resources, curriculum guides, and teacher symposia.</p>
    
    <div style="background-color: #f8fafc; border-left: 4px solid #1e5894; padding: 12px 16px; margin: 20px 0;">
      <h3 style="margin: 0 0 8px 0; color: #1e5894; font-size: 15px;">Key Highlights This Month:</h3>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
        <li style="margin-bottom: 6px;">Finalized school syllabus reviews for secondary level mathematics.</li>
        <li style="margin-bottom: 6px;">Enlisted upcoming regional capacity-building teacher workshops.</li>
        <li style="margin-bottom: 0;">Updated digital archives with new academic journals and papers.</li>
      </ul>
    </div>

    <p>Please log in to your <strong>Member Central Portal</strong> on our website to verify your profile status, participate in research discussions, or download high-quality pedagogic files.</p>
    
    <div style="text-align: center; margin: 28px 0 10px 0;">
      <a href="https://cme.org.np" style="background-color: #f59e0b; color: #020617; padding: 12px 24px; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 4px; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Visit CME Portal Gateway</a>
    </div>
  </div>
  <div style="border-top: 1px solid #e2e8f0; padding: 20px 16px 0 16px; font-size: 11px; color: #94a3b8; text-align: center;">
    <p style="margin: 0 0 4px 0;"><strong>Council for Mathematics Education (CME) Nepal</strong></p>
    <p style="margin: 0 0 4px 0;">Lalitpur Secretariat, Kathmandu, Nepal | Regd No. 843/054-055</p>
    <p style="margin: 0;">You received this automated update because you are a registered member of CME Nepal.</p>
  </div>
</div>
    `
  },
  {
    id: "announcement",
    name: "Urgent Official Notice / Announcement",
    subject: "URGENT NOTICE: CME Official Executive Announcement",
    content: `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; color: #334155;">
  <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 6px 6px 0 0;">
    <h1 style="margin: 0; font-size: 20px; font-weight: bold;">OFFICIAL NOTICE</h1>
    <p style="margin: 4px 0 0 0; font-size: 12px; color: #fca5a5; text-transform: uppercase; font-weight: bold;">Council for Mathematics Education</p>
  </div>
  <div style="padding: 24px 16px; line-height: 1.6;">
    <p style="margin-top: 0;">Dear Colleagues and Registered Members,</p>
    <p>This is an official notice issued by the Executive Committee of the <strong>Council for Mathematics Education (CME)</strong> regarding an important national announcement.</p>
    
    <div style="background-color: #fef2f2; border: 1px solid #fca5a5; padding: 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #991b1b;"><strong>Subject: Scheduled Academic Assemblies and Symposium Postponement</strong></p>
      <p style="margin: 8px 0 0 0; font-size: 13.5px; color: #7f1d1d;">Please be advised that the national mathematics symposium scheduled for next week is being postponed due to administrative realignments. The new dates will be published on the portal shortly.</p>
    </div>

    <p>We apologize for any inconvenience caused. For immediate clarification or emergency inquiries, please contact the Secretariat directly at <strong>support@cme.org.np</strong> or call our official desk.</p>
    
    <div style="text-align: center; margin: 28px 0 10px 0;">
      <a href="https://cme.org.np" style="background-color: #1e5894; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 4px; display: inline-block;">Read Full Announcement Details</a>
    </div>
  </div>
  <div style="border-top: 1px solid #e2e8f0; padding: 20px 16px 0 16px; font-size: 11px; color: #94a3b8; text-align: center;">
    <p style="margin: 0 0 4px 0;"><strong>Council for Mathematics Education (CME) Nepal</strong></p>
    <p style="margin: 0 0 4px 0;">Lalitpur Secretariat, Kathmandu, Nepal</p>
  </div>
</div>
    `
  },
  {
    id: "workshop",
    name: "Teacher Training & Workshop Invitation",
    subject: "Invitation: Professional Teacher Training Workshop on Modern Mathematics Pedagogy",
    content: `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; color: #334155;">
  <div style="background-color: #047857; color: white; padding: 24px; text-align: center; border-radius: 6px 6px 0 0;">
    <h1 style="margin: 0; font-size: 22px; font-weight: bold;">Teacher Capacity Training Seminar</h1>
    <p style="margin: 4px 0 0 0; font-size: 13px; color: #a7f3d0; text-transform: uppercase; font-weight: bold;">CME Academic Capacity Programs</p>
  </div>
  <div style="padding: 24px 16px; line-height: 1.6;">
    <p style="margin-top: 0;">Dear Academic Partner & Mathematics Educator,</p>
    <p>CME Nepal cordially invites you to participate in our upcoming <strong>Professional Development and Practical Workshop</strong> designed specifically for secondary and higher secondary math teachers.</p>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
      <tr>
        <td style="padding: 8px 0; font-weight: bold; width: 30%; border-bottom: 1px solid #f1f5f9;">Event Theme:</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">Visualizing Complex Calculus and Children's Interactive Geometry Models</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Date & Time:</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">10:00 AM - 4:00 PM, July 15th, 2026</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Venue:</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">Central Secretariat Hall, Lalitpur, Nepal</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Registration:</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">Free for Registered Members (Pre-booking required)</td>
      </tr>
    </table>

    <p>This session will focus on practical lesson plans, indigenous mathematical artifacts, and integrating visual digital tools like GeoGebra in regular classrooms. Certificates of participation will be awarded.</p>
    
    <div style="text-align: center; margin: 28px 0 10px 0;">
      <a href="https://cme.org.np/programs" style="background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 4px; display: inline-block;">Reserve Your Seminar Seat Online</a>
    </div>
  </div>
  <div style="border-top: 1px solid #e2e8f0; padding: 20px 16px 0 16px; font-size: 11px; color: #94a3b8; text-align: center;">
    <p style="margin: 0 0 4px 0;"><strong>Council for Mathematics Education (CME) Nepal</strong></p>
    <p style="margin: 0;">If you have questions, please reach out to our program coordinator at support@cme.org.np</p>
  </div>
</div>
    `
  },
  {
    id: "membership_drive",
    name: "CME Membership Campaign & Renewals",
    subject: "CME Membership Drive: Elevate Your Academic Standing Today",
    content: `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; color: #334155;">
  <div style="background-color: #6366f1; color: white; padding: 24px; text-align: center; border-radius: 6px 6px 0 0;">
    <h1 style="margin: 0; font-size: 22px; font-weight: bold;">Unlock Lifelong Academic Access</h1>
    <p style="margin: 4px 0 0 0; font-size: 13px; color: #c7d2fe; text-transform: uppercase; font-weight: bold;">CME Membership Register Campaign</p>
  </div>
  <div style="padding: 24px 16px; line-height: 1.6;">
    <p style="margin-top: 0;">Dear Math Educator / Scholar,</p>
    <p>The <strong>Council for Mathematics Education (CME)</strong> invites all teachers, researchers, and academic institutions to apply for or renew their professional membership online. CME is the foremost national-level authorized platform for math educators in Nepal.</p>
    
    <div style="background-color: #f5f3ff; border: 1px dashed #c7d2fe; padding: 16px; margin: 20px 0; border-radius: 6px;">
      <h3 style="margin: 0 0 8px 0; color: #4f46e5; font-size: 14px; text-transform: uppercase;">Benefits of Life & General Membership:</h3>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #4338ca;">
        <li style="margin-bottom: 5px;">Recognized credentials and Serial No registration certificate.</li>
        <li style="margin-bottom: 5px;">Priority free access to all teacher training seminars and pedagogical materials.</li>
        <li style="margin-bottom: 5px;">Rights to publish in the CME Academic Journal of Research.</li>
        <li style="margin-bottom: 0;">Voter eligibility for Council Executive Committee elections.</li>
      </ul>
    </div>

    <p>If you have pending applications, please upload your banking voucher receipt or QR payment confirmation via our online form so our registrar can verify and approve your registration immediately.</p>
    
    <div style="text-align: center; margin: 28px 0 10px 0;">
      <a href="https://cme.org.np/membership" style="background-color: #f59e0b; color: #020617; padding: 12px 24px; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 4px; display: inline-block;">Apply / Renew Membership Online</a>
    </div>
  </div>
  <div style="border-top: 1px solid #e2e8f0; padding: 20px 16px 0 16px; font-size: 11px; color: #94a3b8; text-align: center;">
    <p style="margin: 0 0 4px 0;"><strong>Council for Mathematics Education (CME) Nepal</strong></p>
    <p style="margin: 0;">Lalitpur Secretariat | Email: support@cme.org.np | Phone: 01-4331234</p>
  </div>
</div>
    `
  }
];

interface AdminDashboardProps {
  isAdminLoggedIn: boolean;
  onLoginSuccess: () => void;
  onSettingsSaved?: () => void;
}

export default function AdminDashboard({ isAdminLoggedIn, onLoginSuccess, onSettingsSaved }: AdminDashboardProps) {
  // Credentials screen
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<
    "dashboard" | "memberships" | "team" | "inquiries" | "settings" | "blogs" | "testimonials" | "faqs" | "media" | "programs" | "publications" | "seo" | "newsletters" | "users"
  >("dashboard");

  // Databases
  const [memberships, setMemberships] = useState<MembershipApplication[]>([]);
  const [teamApplications, setTeamApplications] = useState<TeamMember[]>([]);
  const [inquiries, setInquiries] = useState<InquiryMessage[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  
  // Newly Managed Databases
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    homeTitle: "",
    homeSubtitle: "",
    homeNoticeBanner: "",
    aboutHomeTitle: "",
    aboutHomeText: "",
    ctaButtonText: "",
    supportEmail: "",
    supportPhone: ""
  });
  const [uploadingSlideIndex, setUploadingSlideIndex] = useState<number | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [seoSettings, setSeoSettings] = useState<Record<string, { title: string; description: string; keywords: string }>>({});
  const [selectedSeoRouteId, setSelectedSeoRouteId] = useState("home");
  const [seoForm, setSeoForm] = useState({
    title: "",
    description: "",
    keywords: ""
  });
  const [savingSeo, setSavingSeo] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [programsList, setProgramsList] = useState<Program[]>([]);
  const [publicationsList, setPublicationsList] = useState<Publication[]>([]);
  const [visitorPresences, setVisitorPresences] = useState<any[]>([]);
  
  // Newsletter States
  const [newslettersList, setNewslettersList] = useState<any[]>([]);
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterContent, setNewsletterContent] = useState("");
  const [newsletterTarget, setNewsletterTarget] = useState<"all" | "approved" | "pending" | "life" | "general" | "custom">("all");
  const [newsletterCustomEmails, setNewsletterCustomEmails] = useState("");
  const [newsletterTemplate, setNewsletterTemplate] = useState("standard");
  const [isSendingNewsletter, setIsSendingNewsletter] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");
  const [newsletterSuccessMessage, setNewsletterSuccessMessage] = useState("");
  const [editorMode, setEditorMode] = useState<"visual" | "html">("visual");
  const [selectedNewsletter, setSelectedNewsletter] = useState<any | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  // Active viewing targets
  const [selectedCard, setSelectedCard] = useState<MembershipApplication | null>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);

  // Form states for blogs
  const [uploadingBlogImage, setUploadingBlogImage] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Pedagogy",
    author: "",
    imageUrl: "",
    status: "Published" as "Published" | "Draft"
  });

  // Form states for Testimonials
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreatingTestimonial, setIsCreatingTestimonial] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    designation: "",
    affiliation: "",
    message: "",
    rating: 5,
    status: "Approved" as "Approved" | "Pending" | "Rejected"
  });

  // Form states for FAQs
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [isCreatingFaq, setIsCreatingFaq] = useState(false);
  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    category: "Membership",
    order: 1
  });

  // Form states for Programs
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isCreatingProgram, setIsCreatingProgram] = useState(false);
  const [programForm, setProgramForm] = useState({
    title: "",
    description: "",
    duration: "",
    target: "",
    order: 1
  });

  // Form states for Publications
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [isCreatingPublication, setIsCreatingPublication] = useState(false);
  const [publicationForm, setPublicationForm] = useState({
    title: "",
    description: "",
    type: "Academic Journal",
    published: "",
    size: "",
    fileUrl: "",
    order: 1
  });

  // Load all backend content
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const resMem = await fetch("/api/memberships");
      if (resMem.ok) {
        const dataMem = await resMem.json();
        setMemberships(dataMem);
      }

      const resTeam = await fetch("/api/admin/team");
      if (resTeam.ok) {
        const dataTeam = await resTeam.json();
        setTeamApplications(dataTeam);
      }

      const resInq = await fetch("/api/inquiries");
      if (resInq.ok) {
        const dataInq = await resInq.json();
        setInquiries(dataInq);
      }

      const resSettings = await fetch("/api/settings");
      if (resSettings.ok) {
        const dataSettings = await resSettings.json();
        if (!dataSettings.slides || !Array.isArray(dataSettings.slides) || dataSettings.slides.length === 0) {
          dataSettings.slides = [
            {
              id: "slide_1",
              title: dataSettings.homeTitle || "Empowering Mathematics Educators Across Nepal",
              description: dataSettings.homeSubtitle || "Celebrating 35 years of professional leadership, pedagogical research, and modern training curriculum designed for teachers across Nepal.",
              img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200",
              tag: "Academic Leadership",
              buttonColor: "#f59e0b",
              buttonTextColor: "#020617",
              buttonLink: "membership",
              buttonText: dataSettings.ctaButtonText || "Apply for Online Membership"
            },
            {
              id: "slide_2",
              title: "Interactive Teacher Training & Capacity Building",
              description: "Annual workshops supporting secondary and high school math teachers in implementing visual models, digital tools, and child-centric teaching methods.",
              img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200",
              tag: "Professional Training",
              buttonColor: "#f59e0b",
              buttonTextColor: "#020617",
              buttonLink: "programs",
              buttonText: "Explore Trainings"
            },
            {
              id: "slide_3",
              title: "National Mathematics Olympiad and Research Seminars",
              description: "Inspiring students with national level competitive events and conducting scientific investigations into indigenous mathematical methods.",
              img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
              tag: "Research & Talent",
              buttonColor: "#f59e0b",
              buttonTextColor: "#020617",
              buttonLink: "search",
              buttonText: "Search Syllabus Database"
            }
          ];
        }
        dataSettings.headerTitle = dataSettings.headerTitle || "Council for Mathematics Education";
        dataSettings.headerSubtitle = dataSettings.headerSubtitle || "Regd No. 843/054-055, Lalitpur, Nepal";
        dataSettings.footerDescription = dataSettings.footerDescription || "Established in 1991 (2048 B.S.), CME is Nepal's premier government-recognized academic society, promoting syllabus modernisation, student olympiads, and intensive teacher-capacity development.";
        dataSettings.footerRegd = dataSettings.footerRegd || "Regd No. 843/054-055, Lalitpur, Nepal";
        dataSettings.footerAddress = dataSettings.footerAddress || "Manbhawan, Ward 5, Lalitpur, Nepal";
        dataSettings.footerCopyright = dataSettings.footerCopyright || "© 1991 - 2026 Council for Mathematics Education. All Rights Reserved.";
        dataSettings.contactAddress = dataSettings.contactAddress || "Manbhawan, Ward 5, Lalitpur (Near Lalitpur High School), Lalitpur District, Nepal";
        dataSettings.contactPhone = dataSettings.contactPhone || "+977-1-5524320 / +977-1-5544212";
        dataSettings.contactEmails = dataSettings.contactEmails || "info@mathscouncil.edu.np, secretary@mathscouncil.edu.np";
        dataSettings.contactOfficeHours = dataSettings.contactOfficeHours || "Sunday to Friday (Academic Session):\n10:00 AM – 4:00 PM (NPT)\nClosed on National Gazetted Holidays and Saturdays.";
        dataSettings.contactMapEmbed = dataSettings.contactMapEmbed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.670067064108!2d85.32045889999999!3d27.665677799999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19d13d9ed2c3%3A0xbd62ef28c7ba5593!2sLalitpur%20Madhyamik%20Vidyalaya%20(LMV)!5e0!3m2!1sen!2snp!4v1782899459479!5m2!1sen!2snp";
        setSiteSettings(dataSettings);
      }

      const resBlogs = await fetch("/api/admin/blogs");
      if (resBlogs.ok) {
        const dataBlogs = await resBlogs.json();
        setBlogs(dataBlogs);
      }

      const resTestimonials = await fetch("/api/admin/testimonials");
      if (resTestimonials.ok) {
        const dataTestimonials = await resTestimonials.json();
        setTestimonials(dataTestimonials);
      }

      const resFaqs = await fetch("/api/faqs");
      if (resFaqs.ok) {
        const dataFaqs = await resFaqs.json();
        // Sort by display order
        const sorted = [...dataFaqs].sort((a, b) => (a.order || 99) - (b.order || 99));
        setFaqs(sorted);
      }

      const resMedia = await fetch("/api/media");
      if (resMedia.ok) {
        const dataMedia = await resMedia.json();
        setMediaList(dataMedia);
      }

      const resPrograms = await fetch("/api/programs");
      if (resPrograms.ok) {
        const dataPrograms = await resPrograms.json();
        setProgramsList(dataPrograms);
      }

      const resPublications = await fetch("/api/publications");
      if (resPublications.ok) {
        const dataPublications = await resPublications.json();
        setPublicationsList(dataPublications);
      }

      const resNewsletters = await fetch("/api/admin/newsletters");
      if (resNewsletters.ok) {
        const dataNewsletters = await resNewsletters.json();
        setNewslettersList(dataNewsletters);
      }

      const resUsers = await fetch("/api/users");
      if (resUsers.ok) {
        const dataUsers = await resUsers.json();
        setRegisteredUsers(dataUsers);
      }
    } catch (err) {
      console.error("Error loading admin records:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSeoData = async () => {
    try {
      const res = await fetch("/api/seo");
      if (!res.ok) throw new Error("Failed to load SEO meta settings");
      const data = await res.json();
      const records: Record<string, { title: string; description: string; keywords: string }> = {};
      data.forEach((item: any) => {
        records[item.id] = {
          title: item.title || "",
          description: item.description || "",
          keywords: item.keywords || ""
        };
      });
      setSeoSettings(records);
    } catch (err) {
      console.warn("Error loading SEO data:", err);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAdminData();
      loadSeoData();
    }
  }, [isAdminLoggedIn]);

  useEffect(() => {
    const routeData = SEO_ROUTES.find((r) => r.id === selectedSeoRouteId);
    const customData = seoSettings[selectedSeoRouteId];
    if (customData) {
      setSeoForm({
        title: customData.title || (routeData?.defaultTitle || ""),
        description: customData.description || (routeData?.defaultDesc || ""),
        keywords: customData.keywords || (routeData?.defaultKeywords || "")
      });
    } else {
      setSeoForm({
        title: routeData?.defaultTitle || "",
        description: routeData?.defaultDesc || "",
        keywords: routeData?.defaultKeywords || ""
      });
    }
  }, [selectedSeoRouteId, seoSettings]);

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSeo(true);
    setActionSuccess("");
    try {
      const payload = {
        id: selectedSeoRouteId,
        title: seoForm.title.trim(),
        description: seoForm.description.trim(),
        keywords: seoForm.keywords.trim()
      };
      
      const response = await fetch("/api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to save SEO meta settings");
      
      setSeoSettings((prev) => ({
        ...prev,
        [selectedSeoRouteId]: {
          title: payload.title,
          description: payload.description,
          keywords: payload.keywords
        }
      }));
      
      setActionSuccess(`Successfully saved SEO Meta tags for "${selectedSeoRouteId}" route!`);
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      console.error("Error saving SEO tags:", err);
    } finally {
      setSavingSeo(false);
    }
  };

  useEffect(() => {
    if (!isAdminLoggedIn) return;

    let unsubscribe: (() => void) | null = null;

    getFirebaseClient()
      .then(({ db }) => {
        const q = query(collection(db, "visitorPresence"));
        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const now = Date.now();
            const activeDocs = snapshot.docs
              .map((d) => ({ id: d.id, ...d.data() }))
              .filter((data: any) => data.lastActive && (now - data.lastActive < 30000)); // active in last 30 seconds
            setVisitorPresences(activeDocs);
          },
          (error) => {
            console.warn("Presence tracking error in Admin Dashboard:", error);
          }
        );
      })
      .catch((err) => {
        console.warn("Firebase not ready for Admin Presence tracking:", err);
      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isAdminLoggedIn]);

  // Synchronize the uncontrolled contentEditable div with newsletterContent state safely without cursor resetting
  useEffect(() => {
    if (editorMode === "visual" && editorRef.current) {
      if (document.activeElement !== editorRef.current && editorRef.current.innerHTML !== newsletterContent) {
        editorRef.current.innerHTML = newsletterContent;
      }
    }
  }, [newsletterContent, editorMode]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === "admin" && password.trim() === "admin@123") {
      setAuthError("");
      onLoginSuccess();
    } else {
      setAuthError("Incorrect Administrator Username or Password.");
    }
  };

  const showSuccessNotice = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(""), 4000);
  };

  // --- NEWSLETTER / BULK EMAIL LOGIC HANDLERS ---
  const handleApplyTemplate = (templateId: string) => {
    const t = NEWSLETTER_TEMPLATES.find(tpl => tpl.id === templateId);
    if (t) {
      if (newsletterSubject || newsletterContent) {
        const confirmOver = window.confirm("Applying this template will overwrite your current subject and content. Do you want to proceed?");
        if (!confirmOver) return;
      }
      setNewsletterTemplate(templateId);
      setNewsletterSubject(t.subject);
      setNewsletterContent(t.content.trim());
      if (editorRef.current && editorMode === "visual") {
        editorRef.current.innerHTML = t.content.trim();
      }
      showSuccessNotice(`Applied "${t.name}" template layout!`);
    }
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterSubject.trim()) {
      setNewsletterError("Email Subject is required.");
      return;
    }
    if (!newsletterContent.trim()) {
      setNewsletterError("Email HTML Content is required.");
      return;
    }

    setIsSendingNewsletter(true);
    setNewsletterError("");
    setNewsletterSuccessMessage("");

    try {
      const response = await fetch("/api/admin/newsletters/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: newsletterSubject,
          content: newsletterContent,
          targetAudience: newsletterTarget,
          templateName: NEWSLETTER_TEMPLATES.find(t => t.id === newsletterTemplate)?.name || "Custom Design",
          customEmails: newsletterCustomEmails
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setNewsletterSuccessMessage(`Newsletter campaign dispatched successfully! ${resData.deliveryMessage}`);
        // Clear forms
        setNewsletterSubject("");
        setNewsletterContent("");
        setNewsletterCustomEmails("");
        // Reload newsletter sending history list
        loadAdminData();
        showSuccessNotice("Campaign dispatched and recorded!");
      } else {
        setNewsletterError(resData.error || "Failed to dispatch newsletter.");
      }
    } catch (err) {
      console.error("Error dispatching newsletter:", err);
      setNewsletterError("Network error occurred during newsletter transmission.");
    } finally {
      setIsSendingNewsletter(false);
    }
  };

  // 1. Membership approval/rejection
  const handleUpdateMembershipStatus = async (id: string, status: "Approved" | "Rejected") => {
    try {
      const response = await fetch(`/api/memberships/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        loadAdminData();
        showSuccessNotice(`Membership application successfully ${status}!`);
        if (selectedCard && selectedCard.id === id) {
          setSelectedCard(data.data);
        }
      } else {
        alert(data.error || "Failed to update membership status.");
      }
    } catch (error) {
      console.error("Membership patch error:", error);
    }
  };

  // 2. Team Application approval / edit role & category
  const handleUpdateTeamStatus = async (id: string, status: "Approved" | "Rejected" | "Pending") => {
    try {
      const response = await fetch(`/api/team/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        loadAdminData();
        showSuccessNotice(`Team application status updated to ${status}!`);
      }
    } catch (error) {
      console.error("Team patch error:", error);
    }
  };

  const handleSaveTeamEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeamMember) return;
    try {
      const response = await fetch(`/api/team/${editingTeamMember.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: editingTeamMember.role,
          category: editingTeamMember.category
        })
      });
      if (response.ok) {
        setEditingTeamMember(null);
        loadAdminData();
        showSuccessNotice("Team member details updated successfully!");
      }
    } catch (error) {
      console.error("Team edit patch error:", error);
    }
  };

  const handleAddNewSlide = () => {
    const newSlide = {
      id: `slide_${Date.now()}`,
      title: "CME Specialized Training Initiatives",
      description: "Empowering next-generation primary school mathematics teachers with customized manipulative tools and visual geometry.",
      img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200",
      tag: "Specialty Workshop",
      buttonColor: "#1e5894",
      buttonTextColor: "#ffffff",
      buttonLink: "programs",
      buttonText: "Register for Workshops"
    };
    setSiteSettings(prev => ({
      ...prev,
      slides: [...(prev.slides || []), newSlide]
    }));
    showSuccessNotice("New slider template added to the collection!");
  };

  const handleDeleteSlide = (index: number) => {
    if (confirm("Are you sure you want to remove this slider?")) {
      const updatedSlides = siteSettings.slides ? siteSettings.slides.filter((_, i) => i !== index) : [];
      setSiteSettings(prev => ({
        ...prev,
        slides: updatedSlides
      }));
      showSuccessNotice("Slider deleted from the collection.");
    }
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const slides = siteSettings.slides ? [...siteSettings.slides] : [];
    if (direction === 'up' && index > 0) {
      const temp = slides[index];
      slides[index] = slides[index - 1];
      slides[index - 1] = temp;
    } else if (direction === 'down' && index < slides.length - 1) {
      const temp = slides[index];
      slides[index] = slides[index + 1];
      slides[index + 1] = temp;
    }
    setSiteSettings(prev => ({
      ...prev,
      slides
    }));
  };

  const handleSlideImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingSlideIndex(index);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file: reader.result as string, folder: "slides" })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            const updatedSlides = [...(siteSettings.slides || [])];
            updatedSlides[index] = {
              ...updatedSlides[index],
              img: data.url
            };
            setSiteSettings(prev => ({
              ...prev,
              slides: updatedSlides
            }));
            showSuccessNotice("Slide banner uploaded to Cloudinary successfully!");
          } else {
            alert("Upload failed: " + (data.error || "Please try again."));
          }
        } catch (error) {
          console.error("Slide image upload error:", error);
          alert("Failed to upload slide image to Cloudinary.");
        } finally {
          setUploadingSlideIndex(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. Site Settings Customizer
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteSettings)
      });
      if (response.ok) {
        showSuccessNotice("CME general site layout configurations updated successfully!");
        loadAdminData();
        if (onSettingsSaved) {
          onSettingsSaved();
        }
      } else {
        alert("Failed to save settings configurations.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Blogs CRUD
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = !!editingBlog;
      const url = isEditing ? `/api/blogs/${editingBlog.id}` : "/api/blogs";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogForm)
      });

      if (response.ok) {
        showSuccessNotice(`Blog article successfully ${isEditing ? "updated" : "published"}!`);
        setIsCreatingBlog(false);
        setEditingBlog(null);
        setBlogForm({
          title: "",
          excerpt: "",
          content: "",
          category: "Pedagogy",
          author: "",
          imageUrl: "",
          status: "Published"
        });
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditBlogBtnClick = (blog: BlogPost) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      author: blog.author,
      imageUrl: blog.imageUrl || "",
      status: blog.status
    });
    setIsCreatingBlog(true);
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) return;
    try {
      const response = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (response.ok) {
        showSuccessNotice("Blog post deleted from record.");
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlogImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingBlogImage(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file: reader.result as string, folder: "blogs" })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setBlogForm(prev => ({
              ...prev,
              imageUrl: data.url
            }));
            showSuccessNotice("Blog cover image uploaded to Cloudinary!");
          } else {
            alert("Upload failed: " + (data.error || "Please try again."));
          }
        } catch (error) {
          console.error("Blog image upload error:", error);
          alert("Failed to upload image to Cloudinary.");
        } finally {
          setUploadingBlogImage(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 5. Testimonials CRUD
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = !!editingTestimonial;
      const url = isEditing ? `/api/testimonials/${editingTestimonial.id}` : "/api/testimonials";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonialForm)
      });

      if (response.ok) {
        showSuccessNotice(`Testimonial feedback ${isEditing ? "updated" : "composed"} successfully!`);
        setIsCreatingTestimonial(false);
        setEditingTestimonial(null);
        setTestimonialForm({
          name: "",
          designation: "",
          affiliation: "",
          message: "",
          rating: 5,
          status: "Approved"
        });
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTestimonialBtn = (t: Testimonial) => {
    setEditingTestimonial(t);
    setTestimonialForm({
      name: t.name,
      designation: t.designation,
      affiliation: t.affiliation || "",
      message: t.message,
      rating: t.rating,
      status: t.status
    });
    setIsCreatingTestimonial(true);
  };

  const handleToggleTestimonialApproval = async (id: string, status: "Approved" | "Rejected" | "Pending") => {
    try {
      const response = await fetch(`/api/testimonials/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        showSuccessNotice(`Testimonial review marked as ${status}.`);
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const response = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (response.ok) {
        showSuccessNotice("Testimonial review deleted successfully.");
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 6. FAQs CRUD
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = !!editingFaq;
      const url = isEditing ? `/api/faqs/${editingFaq.id}` : "/api/faqs";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...faqForm,
          order: Number(faqForm.order)
        })
      });

      if (response.ok) {
        showSuccessNotice(`FAQ question successfully ${isEditing ? "updated" : "added"}!`);
        setIsCreatingFaq(false);
        setEditingFaq(null);
        setFaqForm({
          question: "",
          answer: "",
          category: "Membership",
          order: faqs.length + 1
        });
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditFaqBtn = (faq: FAQItem) => {
    setEditingFaq(faq);
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "Membership",
      order: faq.order || 1
    });
    setIsCreatingFaq(true);
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ question?")) return;
    try {
      const response = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      if (response.ok) {
        showSuccessNotice("FAQ question removed from listing.");
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 6.1 Programs CRUD
  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = !!editingProgram;
      const url = isEditing ? `/api/programs/${editingProgram.id}` : "/api/programs";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...programForm,
          order: Number(programForm.order)
        })
      });

      if (response.ok) {
        showSuccessNotice(`Program successfully ${isEditing ? "updated" : "added"}!`);
        setIsCreatingProgram(false);
        setEditingProgram(null);
        setProgramForm({
          title: "",
          description: "",
          duration: "",
          target: "",
          order: programsList.length + 1
        });
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProgramBtn = (prog: Program) => {
    setEditingProgram(prog);
    setProgramForm({
      title: prog.title,
      description: prog.description,
      duration: prog.duration,
      target: prog.target,
      order: prog.order || 1
    });
    setIsCreatingProgram(true);
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm("Are you sure you want to delete this training program?")) return;
    try {
      const response = await fetch(`/api/programs/${id}`, { method: "DELETE" });
      if (response.ok) {
        showSuccessNotice("Program deleted successfully.");
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 6.2 Publications CRUD
  const handleSavePublication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = !!editingPublication;
      const url = isEditing ? `/api/publications/${editingPublication.id}` : "/api/publications";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...publicationForm,
          order: Number(publicationForm.order)
        })
      });

      if (response.ok) {
        showSuccessNotice(`Publication successfully ${isEditing ? "updated" : "added"}!`);
        setIsCreatingPublication(false);
        setEditingPublication(null);
        setPublicationForm({
          title: "",
          description: "",
          type: "Academic Journal",
          published: "",
          size: "",
          fileUrl: "",
          order: publicationsList.length + 1
        });
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditPublicationBtn = (pub: Publication) => {
    setEditingPublication(pub);
    setPublicationForm({
      title: pub.title,
      description: pub.description,
      type: pub.type,
      published: pub.published,
      size: pub.size,
      fileUrl: pub.fileUrl || "",
      order: pub.order || 1
    });
    setIsCreatingPublication(true);
  };

  const handleDeletePublication = async (id: string) => {
    if (!confirm("Are you sure you want to delete this publication?")) return;
    try {
      const response = await fetch(`/api/publications/${id}`, { method: "DELETE" });
      if (response.ok) {
        showSuccessNotice("Publication removed from reference archives.");
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fallback headshot avatars
  const getAvatarUrl = (photo: string | undefined, name: string) => {
    if (photo) return photo;
    if (name.toLowerCase().includes("hari") || name.toLowerCase().includes("ram") || name.toLowerCase().includes("chandra")) {
      return "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256";
    }
    return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256";
  };

  // Print card helper
  const triggerPrintCard = () => {
    window.print();
  };

  // RENDER LOGIN SCREEN
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 px-4" id="admin-login-screen">
        <div className="bg-white rounded-lg border-2 border-slate-300 shadow-sm p-6">
          <div className="text-center border-b border-slate-200 pb-4 mb-4">
            <div className="w-12 h-12 bg-[#1e5894]/10 rounded-full flex items-center justify-center mx-auto mb-2 text-[#1e5894]">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 font-serif uppercase tracking-tight">
              Administrative Control Console
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">
              Authorized Council Officers Only • CME Est. 1991
            </p>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-2.5 rounded text-xs mb-4 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">
                Username ID
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#1e5894] font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1e5894] hover:bg-blue-800 text-white font-bold py-2 rounded shadow-sm transition-colors text-center tracking-wider font-mono uppercase"
            >
              AUTHENTICATE ACCESS
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 py-6" id="admin-main-dashboard">
      
      {/* SUCCESS POPUP BANNER */}
      {actionSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* CARD/CERTIFICATE MODAL VIEWER */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-2xl w-full p-6 shadow-xl relative no-print">
            <button 
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>

            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 mb-4 uppercase tracking-wider flex items-center gap-1.5">
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

      {/* EDIT TEAM ROLE/CATEGORY POPUP */}
      {editingTeamMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-sm w-full p-5 shadow-lg">
            <h4 className="text-xs font-bold text-[#1e5894] uppercase tracking-wider border-b pb-2 mb-4 font-serif">
              Configure Team Specialty
            </h4>
            <form onSubmit={handleSaveTeamEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Applicant Name</label>
                <input
                  type="text"
                  disabled
                  value={editingTeamMember.fullName}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 font-medium text-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Official Role / Title</label>
                <input
                  type="text"
                  required
                  value={editingTeamMember.role}
                  onChange={(e) => setEditingTeamMember({ ...editingTeamMember, role: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Classification Category</label>
                <select
                  value={editingTeamMember.category}
                  onChange={(e) => setEditingTeamMember({ ...editingTeamMember, category: e.target.value as any })}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-700"
                >
                  <option value="Executive Committee">Executive Committee</option>
                  <option value="Advisory Board">Advisory Board</option>
                  <option value="Staff">Administrative Staff</option>
                  <option value="General Members">General Members</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTeamMember(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 py-1.5 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1e5894] hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded"
                >
                  Save Specialty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Toggler bar */}
      <div className="lg:hidden flex justify-between items-center bg-white border border-slate-200 rounded-lg p-3.5 mb-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5 text-[#1e5894]" />
          <div>
            <h3 className="font-serif font-bold text-xs text-[#1e5894]">CME Admin Menu</h3>
            <span className="text-[9px] text-slate-400 font-bold uppercase">
              Current: <span className="text-slate-600">{activeSubTab}</span>
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="bg-[#1e5894] hover:bg-blue-800 text-white font-bold text-[10px] px-3 py-1.5 rounded uppercase tracking-wider shadow-sm"
        >
          Open Menu
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 lg:hidden flex justify-start">
          <div className="bg-white w-72 max-w-[85vw] h-full p-4 overflow-y-auto shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-serif font-bold text-[#1e5894] text-xs uppercase tracking-wider">CME Admin Console</span>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Mobile Rail selectors */}
              <div className="space-y-3.5">
                <div className="bg-[#1e5894] text-white p-3 rounded flex justify-between items-center">
                  <div>
                    <h3 className="font-serif font-bold text-xs">CME Council Records</h3>
                    <p className="text-[9px] text-blue-200 mt-0.5">Logged as Admin</p>
                  </div>
                  <button 
                    onClick={() => {
                      loadAdminData();
                      setIsMobileSidebarOpen(false);
                    }}
                    className="p-1 bg-white/10 hover:bg-white/20 rounded text-white"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setActiveSubTab("dashboard");
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeSubTab === "dashboard"
                        ? "bg-blue-600 text-white font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Executive Dashboard</span>
                    </span>
                    <span className="bg-blue-100 text-blue-700 text-[9px] px-1 rounded font-bold">
                      LIVE
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab("memberships");
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeSubTab === "memberships"
                        ? "bg-blue-50 text-[#1e5894] font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4" />
                      <span>Membership Registers</span>
                    </span>
                    <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 rounded font-bold">
                      {memberships.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab("team");
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeSubTab === "team"
                        ? "bg-blue-50 text-[#1e5894] font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>Team Applications</span>
                    </span>
                    <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 rounded font-bold">
                      {teamApplications.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab("inquiries");
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeSubTab === "inquiries"
                        ? "bg-blue-50 text-[#1e5894] font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      <span>Visitor Inquiries</span>
                    </span>
                    <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 rounded font-bold">
                      {inquiries.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab("settings");
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeSubTab === "settings"
                        ? "bg-blue-50 text-[#1e5894] font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Settings className="w-4 h-4 text-[#1e5894]" />
                      <span>General Site Customizer</span>
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab("seo");
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeSubTab === "seo"
                        ? "bg-blue-50 text-[#1e5894] font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-[#1e5894]" />
                      <span>SEO Metadata Manager</span>
                    </span>
                    <span className="bg-blue-100 text-[#1e5894] text-[9px] px-1.5 rounded font-bold uppercase">
                      SEO
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab("blogs");
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeSubTab === "blogs"
                        ? "bg-blue-50 text-[#1e5894] font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>Blogs & Research News</span>
                    </span>
                    <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 rounded font-bold">
                      {blogs.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab("testimonials");
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeSubTab === "testimonials"
                        ? "bg-blue-50 text-[#1e5894] font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-amber-500" />
                      <span>Testimonials & Reviews</span>
                    </span>
                    <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 rounded font-bold">
                      {testimonials.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab("faqs");
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeSubTab === "faqs"
                        ? "bg-blue-50 text-[#1e5894] font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-blue-500" />
                      <span>FAQ Schema Builder</span>
                    </span>
                    <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 rounded font-bold">
                      {faqs.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab("media");
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeSubTab === "media"
                        ? "bg-cyan-50 text-cyan-900 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-cyan-600" />
                      <span className="font-bold">Cloudinary Storage</span>
                    </span>
                    <span className="bg-cyan-100 text-cyan-800 text-[10px] px-1.5 rounded font-bold">
                      {mediaList.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab("programs");
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeSubTab === "programs"
                        ? "bg-blue-50 text-[#1e5894] font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-amber-500" />
                      <span>Programs & Schemes</span>
                    </span>
                    <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 rounded font-bold">
                      {programsList.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab("publications");
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeSubTab === "publications"
                        ? "bg-blue-50 text-[#1e5894] font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Book className="w-4 h-4 text-indigo-500" />
                      <span>Publications Archive</span>
                    </span>
                    <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 rounded font-bold">
                      {publicationsList.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab("newsletters");
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeSubTab === "newsletters"
                        ? "bg-blue-50 text-[#1e5894] font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Send className="w-4 h-4 text-emerald-500" />
                      <span>Bulk Email Updates</span>
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 rounded font-bold">
                      {newslettersList.length}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 text-center mt-auto">
              <span className="text-[10px] text-slate-400 block font-serif">Nepal Mathematics Council</span>
              <span className="text-[8px] text-slate-300 block font-mono">Regd No. 843/054-055</span>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD GRID CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column Navigation Rails */}
        <div className="hidden lg:block space-y-3.5">
          <div className="bg-[#1e5894] text-white p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-serif font-bold text-sm">CME Council Records</h3>
              <p className="text-[10px] text-blue-200 mt-1">Logged as Principal Administrator</p>
            </div>
            <button 
              onClick={loadAdminData}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-white transition-colors"
              title="Refresh Registry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Sub-tabs Rail selectors */}
          <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex flex-col gap-1">
            <button
              onClick={() => setActiveSubTab("dashboard")}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                activeSubTab === "dashboard"
                  ? "bg-blue-600 text-white font-bold shadow-sm"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <LayoutDashboard className={`w-4 h-4 ${activeSubTab === "dashboard" ? "text-white" : "text-blue-600"}`} />
                <span>Executive Dashboard</span>
              </span>
              <span className={`font-mono text-[10px] px-1.5 rounded font-bold ${activeSubTab === "dashboard" ? "bg-blue-800 text-white" : "bg-blue-100 text-blue-700"}`}>
                LIVE
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab("memberships")}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                activeSubTab === "memberships"
                  ? "bg-blue-50 text-[#1e5894] font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>Membership Registers</span>
              </span>
              <span className="bg-slate-200 text-slate-700 font-mono text-[10px] px-1.5 rounded font-bold">
                {memberships.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab("team")}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                activeSubTab === "team"
                  ? "bg-blue-50 text-[#1e5894] font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>Team Applications</span>
              </span>
              <span className="bg-slate-200 text-slate-700 font-mono text-[10px] px-1.5 rounded font-bold">
                {teamApplications.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab("inquiries")}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                activeSubTab === "inquiries"
                  ? "bg-blue-50 text-[#1e5894] font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                <span>Visitor Inquiries</span>
              </span>
              <span className="bg-slate-200 text-slate-700 font-mono text-[10px] px-1.5 rounded font-bold">
                {inquiries.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab("users");
                setIsCreatingBlog(false);
                setIsCreatingTestimonial(false);
                setIsCreatingFaq(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                activeSubTab === "users"
                  ? "bg-blue-50 text-[#1e5894] font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-purple-600" />
                <span>Registered Users</span>
              </span>
              <span className="bg-purple-100 text-purple-700 font-mono text-[10px] px-1.5 rounded font-bold">
                {registeredUsers.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab("settings");
                setIsCreatingBlog(false);
                setIsCreatingTestimonial(false);
                setIsCreatingFaq(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                activeSubTab === "settings"
                  ? "bg-blue-50 text-[#1e5894] font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-[#1e5894]" />
                <span>General Site Customizer</span>
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab("seo");
                setIsCreatingBlog(false);
                setIsCreatingTestimonial(false);
                setIsCreatingFaq(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                activeSubTab === "seo"
                  ? "bg-blue-50 text-[#1e5894] font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#1e5894]" />
                <span>SEO Metadata Manager</span>
              </span>
              <span className="bg-blue-100 text-[#1e5894] font-mono text-[9px] px-1.5 rounded font-bold uppercase">
                SEO
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab("blogs");
                setIsCreatingBlog(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                activeSubTab === "blogs"
                  ? "bg-blue-50 text-[#1e5894] font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Blogs & Research News</span>
              </span>
              <span className="bg-slate-200 text-slate-700 font-mono text-[10px] px-1.5 rounded font-bold">
                {blogs.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab("testimonials");
                setIsCreatingTestimonial(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                activeSubTab === "testimonials"
                  ? "bg-blue-50 text-[#1e5894] font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <span>Testimonials & Reviews</span>
              </span>
              <span className="bg-slate-200 text-slate-700 font-mono text-[10px] px-1.5 rounded font-bold">
                {testimonials.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab("faqs");
                setIsCreatingFaq(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                activeSubTab === "faqs"
                  ? "bg-blue-50 text-[#1e5894] font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-500" />
                <span>FAQ Schema Builder</span>
              </span>
              <span className="bg-slate-200 text-slate-700 font-mono text-[10px] px-1.5 rounded font-bold">
                {faqs.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab("media");
              }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                activeSubTab === "media"
                  ? "bg-cyan-50 text-cyan-900 font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-cyan-600 animate-pulse" />
                <span className="font-bold">Cloudinary Storage</span>
              </span>
              <span className="bg-cyan-100 text-cyan-800 font-mono text-[10px] px-1.5 rounded font-bold">
                {mediaList.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab("programs");
                setIsCreatingProgram(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                activeSubTab === "programs"
                  ? "bg-blue-50 text-[#1e5894] font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-500" />
                <span>Programs & Schemes</span>
              </span>
              <span className="bg-slate-200 text-slate-700 font-mono text-[10px] px-1.5 rounded font-bold">
                {programsList.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab("publications");
                setIsCreatingPublication(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                activeSubTab === "publications"
                  ? "bg-blue-50 text-[#1e5894] font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Book className="w-4 h-4 text-[#1e5894]" />
                <span>Publications Archive</span>
              </span>
              <span className="bg-slate-200 text-slate-700 font-mono text-[10px] px-1.5 rounded font-bold">
                {publicationsList.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab("newsletters");
              }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                activeSubTab === "newsletters"
                  ? "bg-blue-50 text-[#1e5894] font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Send className="w-4 h-4 text-emerald-500" />
                <span>Bulk Email Updates</span>
              </span>
              <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] px-1.5 rounded font-bold">
                {newslettersList.length}
              </span>
            </button>
          </div>


        </div>

        {/* Right 3 Columns: Table Lists depending on Tab */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* TAB 0: EXECUTIVE DASHBOARD */}
          {activeSubTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stat Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Memberships</p>
                    <h3 className="text-xl font-serif font-bold text-slate-800 mt-1">{memberships.length}</h3>
                    <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                      {memberships.filter(m => m.status === 'Approved').length} Approved • {memberships.filter(m => m.status === 'Pending').length} Pending
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Team Apps</p>
                    <h3 className="text-xl font-serif font-bold text-slate-800 mt-1">{teamApplications.length}</h3>
                    <p className="text-[10px] text-amber-500 font-semibold mt-1">
                      {teamApplications.filter(t => t.status === 'Pending').length} Pending Review
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Inquiries Received</p>
                    <h3 className="text-xl font-serif font-bold text-slate-800 mt-1">{inquiries.length}</h3>
                    <p className="text-[10px] text-blue-500 font-semibold mt-1">General public queries</p>
                  </div>
                  <div className="p-3 bg-red-50 text-red-500 rounded-lg">
                    <Mail className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Research & Blogs</p>
                    <h3 className="text-xl font-serif font-bold text-slate-800 mt-1">{blogs.length}</h3>
                    <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                      {blogs.filter(b => b.status === 'Published').length} Published
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Grid 2 Columns: Live Traffic vs Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Live Traffic Monitoring Panel */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-slate-800 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                        Live Visitor Activity & Traffic Monitor
                      </h4>
                      <p className="text-[10px] text-slate-400">Updates automatically when users navigate the portal sections</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold tracking-wider font-mono">
                      {Math.max(1, visitorPresences.length)} ONLINE
                    </span>
                  </div>

                  {/* Presence Section Breakdown */}
                  <div className="space-y-2.5">
                    {[
                      { key: "home", label: "CME Portal Gateway / Home Page", icon: Globe, color: "text-blue-500 bg-blue-50" },
                      { key: "memberships", label: "Online Membership Application Form", icon: GraduationCap, color: "text-purple-500 bg-purple-50" },
                      { key: "team", label: "Executive Committee & Advisory Board", icon: Users, color: "text-amber-500 bg-amber-50" },
                      { key: "publications", label: "Academic Publications & Books Archive", icon: Book, color: "text-indigo-500 bg-indigo-50" },
                      { key: "blogs", label: "Blogs, Press Releases & Mathematics News", icon: FileText, color: "text-emerald-500 bg-emerald-50" },
                      { key: "inquiries", label: "Interactive Helpdesk / Inquiries", icon: Mail, color: "text-red-500 bg-red-50" },
                      { key: "settings", label: "Administrator Control Panel", icon: Settings, color: "text-slate-600 bg-slate-100" }
                    ].map((section) => {
                      const count = visitorPresences.filter(vp => (vp.page || "home") === section.key).length;
                      const percentage = visitorPresences.length > 0 ? (count / visitorPresences.length) * 100 : 0;
                      
                      return (
                        <div key={section.key} className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`p-1.5 rounded-md ${section.color}`}>
                              <section.icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="truncate">
                              <p className="font-semibold text-slate-700">{section.label}</p>
                              <div className="w-32 bg-slate-100 h-1 rounded-full mt-1 overflow-hidden">
                                <div className="bg-[#1e5894] h-1 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            {count > 0 ? (
                              <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                            ) : null}
                            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              {count} {count === 1 ? "user" : "users"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Administrative Operations */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-sm text-slate-800 flex items-center gap-2 pb-2 border-b">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Quick Operations
                    </h4>
                    
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Instant bypass shortcuts for managing Council databases, approvals, and media files.
                    </p>

                    <div className="grid grid-cols-1 gap-2 pt-1">
                      <button 
                        onClick={() => setActiveSubTab("memberships")}
                        className="w-full text-left p-2 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 text-xs font-semibold text-slate-700 transition-all flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Pending Membership Registers
                      </button>

                      <button 
                        onClick={() => setActiveSubTab("settings")}
                        className="w-full text-left p-2 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 text-xs font-semibold text-slate-700 transition-all flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        Modify Live Notice Board Banner
                      </button>

                      <button 
                        onClick={() => setActiveSubTab("media")}
                        className="w-full text-left p-2 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 text-xs font-semibold text-slate-700 transition-all flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        Browse Cloudinary Storage
                      </button>

                      <button 
                        onClick={() => setActiveSubTab("inquiries")}
                        className="w-full text-left p-2 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 text-xs font-semibold text-slate-700 transition-all flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Open Support Inboxes
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg space-y-1.5 text-[10px]">
                    <span className="font-extrabold text-slate-600 block uppercase tracking-wider text-[8px]">Backup Security</span>
                    <p className="text-slate-500 leading-relaxed">
                      All memberships and media assets are permanently recorded in Google Firebase Cloud Firestore and Cloudinary Storage buckets.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Activity Log Lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Recent Member registrations */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                  <h4 className="font-serif font-bold text-xs text-slate-800 border-b pb-2 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#1e5894]" />
                    Recent Registrations & Submissions
                  </h4>
                  
                  {memberships.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">No recent registrants.</div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {memberships.slice(0, 3).map((m) => (
                        <div key={m.id} className="py-2.5 flex items-center justify-between text-xs gap-2">
                          <div className="min-w-0">
                            <p className="font-bold text-slate-700 truncate">{m.fullName}</p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{m.affiliation || "No affiliation listed"}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold shrink-0 ${
                            m.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            m.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Inquiries */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                  <h4 className="font-serif font-bold text-xs text-slate-800 border-b pb-2 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-rose-500" />
                    Recent Support Messages & Inquiries
                  </h4>
                  
                  {inquiries.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">No support messages.</div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {inquiries.slice(0, 3).map((i) => (
                        <div key={i.id} className="py-2.5 flex flex-col text-xs">
                          <div className="flex justify-between gap-2">
                            <span className="font-bold text-slate-700 truncate">{i.fullName}</span>
                            <span className="text-[9px] text-slate-400 shrink-0 font-mono">
                              {i.submittedAt ? new Date(i.submittedAt).toLocaleDateString() : "Recent"}
                            </span>
                          </div>
                          <p className="text-[10px] font-semibold text-blue-600 truncate mt-0.5">{i.subject}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 italic">"{i.message}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SEO METADATA MANAGER */}
          {activeSubTab === "seo" && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="font-serif font-bold text-base text-slate-800 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#1e5894]" />
                    Page-Specific SEO Meta Tags Customizer
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure optimized page titles, descriptions, and keywords for search engines and crawlers.
                  </p>
                </div>
                <button
                  onClick={loadSeoData}
                  className="mt-2 sm:mt-0 text-[10px] text-[#1e5894] hover:underline font-bold flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"
                >
                  <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                  Reload Configuration
                </button>
              </div>

              {actionSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Side: Route selectors */}
                <div className="lg:col-span-4 space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Select App Route
                  </span>
                  <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                    {SEO_ROUTES.map((route) => {
                      const isSelected = selectedSeoRouteId === route.id;
                      const hasCustomTags = !!seoSettings[route.id];
                      return (
                        <button
                          key={route.id}
                          onClick={() => {
                            setSelectedSeoRouteId(route.id);
                            setActionSuccess("");
                          }}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex flex-col justify-between gap-1.5 ${
                            isSelected
                              ? "bg-blue-50 border-blue-400 text-slate-800 shadow-sm ring-1 ring-blue-200"
                              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="font-bold truncate">{route.name}</span>
                            {hasCustomTags ? (
                              <span className="bg-emerald-100 text-emerald-800 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                Custom
                              </span>
                            ) : (
                              <span className="bg-slate-100 text-slate-500 text-[8px] font-semibold px-1.5 py-0.5 rounded uppercase">
                                Default
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[9px] text-slate-400 tracking-tight">/{route.id === "home" ? "" : route.id}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side: Form and Google Preview */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Google Search Snippet Live Preview */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 shadow-inner">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                      Google Search Snippet Preview
                    </span>
                    <div className="bg-white border border-slate-100 p-4 rounded-lg shadow-sm font-sans space-y-1 max-w-[580px]">
                      {/* URL */}
                      <div className="text-[11px] text-slate-600 flex items-center gap-1.5 truncate">
                        <span className="bg-slate-100 p-0.5 px-1.5 rounded-full text-[9px] font-semibold text-[#1e5894]">CME</span>
                        <span>https://mathscouncil.org.np/{selectedSeoRouteId === "home" ? "" : selectedSeoRouteId}</span>
                      </div>
                      {/* Title */}
                      <h3 className="text-lg text-[#1a0dab] hover:underline cursor-pointer font-medium leading-tight line-clamp-1">
                        {seoForm.title || "Council for Mathematics Education (CME) | Nepal"}
                      </h3>
                      {/* Description */}
                      <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                        {seoForm.description || "The Council for Mathematics Education (CME) is Nepal's premier academic organization dedicated to mathematics education research..."}
                      </p>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSaveSeo} className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          Meta Title <span className="text-red-500">*</span>
                        </label>
                        <span className={`text-[10px] font-mono ${
                          seoForm.title.length >= 50 && seoForm.title.length <= 60
                            ? "text-emerald-600 font-bold"
                            : "text-slate-400"
                        }`}>
                          {seoForm.title.length} chars (Recommended: 50-60)
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Page SEO Title"
                        value={seoForm.title}
                        onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })}
                        className="w-full text-xs p-2.5 rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-semibold text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          Meta Description <span className="text-red-500">*</span>
                        </label>
                        <span className={`text-[10px] font-mono ${
                          seoForm.description.length >= 150 && seoForm.description.length <= 160
                            ? "text-emerald-600 font-bold"
                            : "text-slate-400"
                        }`}>
                          {seoForm.description.length} chars (Recommended: 150-160)
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        required
                        placeholder="Search engine meta description snippet..."
                        value={seoForm.description}
                        onChange={(e) => setSeoForm({ ...seoForm, description: e.target.value })}
                        className="w-full text-xs p-2.5 rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium text-slate-700 leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-700">
                          Meta Keywords
                        </label>
                        <span className="text-[10px] text-slate-400">
                          Comma separated terms
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. mathematics, training, syllabus, nepal"
                        value={seoForm.keywords}
                        onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                        className="w-full text-xs p-2.5 rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-700 font-mono"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          const routeData = SEO_ROUTES.find((r) => r.id === selectedSeoRouteId);
                          if (routeData) {
                            setSeoForm({
                              title: routeData.defaultTitle,
                              description: routeData.defaultDesc,
                              keywords: routeData.defaultKeywords
                            });
                          }
                        }}
                        className="text-xs font-bold text-[#1e5894] hover:underline"
                      >
                        Reset to Default Templates
                      </button>

                      <button
                        type="submit"
                        disabled={savingSeo}
                        className={`px-4 py-2 bg-[#1e5894] text-white text-xs font-bold rounded-lg shadow hover:bg-opacity-90 transition-all flex items-center gap-1.5 ${
                          savingSeo ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      >
                        {savingSeo ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Saving tags...
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            Save SEO tags
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: MEMBERSHIPS */}
          {activeSubTab === "memberships" && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 overflow-hidden">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h4 className="font-serif font-bold text-sm text-slate-800">
                  Registered Membership Submissions
                </h4>
                <button 
                  onClick={loadAdminData}
                  className="text-[10px] text-[#1e5894] hover:underline font-bold"
                >
                  Force Sync Registry
                </button>
              </div>

              {memberships.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">No applications logged.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b">
                        <th className="py-2.5 px-3">Serial No</th>
                        <th className="py-2.5 px-3">Full Name</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Affiliation</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {memberships.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 font-mono font-bold text-[#1e5894]">{m.serialNo}</td>
                          <td className="py-3 px-3 font-semibold text-slate-800 uppercase">{m.fullName}</td>
                          <td className="py-3 px-3">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[10px]">
                              {m.membershipType}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 truncate max-w-[150px]" title={m.affiliation}>{m.affiliation}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                              m.status === "Approved" ? "bg-green-50 text-green-700 border border-green-200" :
                              m.status === "Rejected" ? "bg-red-50 text-red-700 border border-red-200" :
                              "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedCard(m)}
                                className="bg-blue-50 text-[#1e5894] hover:bg-blue-100 px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 border border-blue-100"
                                title="View/Print Card"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Card</span>
                              </button>

                              {m.status === "Pending" && (
                                <>
                                  <button
                                    onClick={() => handleUpdateMembershipStatus(m.id, "Approved")}
                                    className="bg-green-600 hover:bg-green-700 text-white p-1 rounded"
                                    title="Approve Application"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateMembershipStatus(m.id, "Rejected")}
                                    className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                                    title="Reject Application"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: REGISTERED USERS */}
          {activeSubTab === "users" && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 overflow-hidden">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <div>
                  <h4 className="font-serif font-bold text-sm text-slate-800">
                    Registered Scholar Users
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Viewing central authentication profiles including contact numbers and gmail addresses.
                  </p>
                </div>
                <button 
                  onClick={loadAdminData}
                  className="text-[10px] text-[#1e5894] hover:underline font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Sync Profiles</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search scholars by name, email, or phone number..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                  id="admin-search-users"
                  onChange={(e) => {
                    const q = e.target.value.toLowerCase();
                    const rows = document.querySelectorAll(".admin-user-row");
                    rows.forEach((row: any) => {
                      const text = row.textContent.toLowerCase();
                      if (text.includes(q)) {
                        row.style.display = "";
                      } else {
                        row.style.display = "none";
                      }
                    });
                  }}
                />
              </div>

              {registeredUsers.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed">
                  No scholar user accounts registered in central directory yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse" id="admin-registered-users-table">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-600 border-b border-slate-100">
                        <th className="p-2.5">Scholar Name</th>
                        <th className="p-2.5">Email address</th>
                        <th className="p-2.5">Phone Number</th>
                        <th className="p-2.5">Registered At</th>
                        <th className="p-2.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700">
                      {registeredUsers.map((usr: any) => (
                        <tr key={usr.id} className="admin-user-row hover:bg-slate-50/50 transition-colors">
                          <td className="p-2.5 font-bold text-slate-800">
                            <div className="flex items-center gap-1.5">
                              <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold font-mono text-[9px] uppercase">
                                {(usr.fullName || "S").slice(0, 2)}
                              </span>
                              <span>{usr.fullName || "Unspecified"}</span>
                            </div>
                          </td>
                          <td className="p-2.5 font-mono text-slate-600">{usr.email}</td>
                          <td className="p-2.5 font-semibold text-[#1e5894]">
                            {usr.phoneNumber ? (
                              <a href={`tel:${usr.phoneNumber}`} className="hover:underline flex items-center gap-1">
                                <UserCheck className="w-3 h-3 text-[#1e5894]" />
                                {usr.phoneNumber}
                              </a>
                            ) : (
                              <span className="text-slate-400 italic">Not Provided</span>
                            )}
                          </td>
                          <td className="p-2.5 text-slate-500">
                            {usr.registeredAt ? new Date(usr.registeredAt).toLocaleString() : "Pre-seeded"}
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={async () => {
                                if (!confirm(`Are you sure you want to delete scholar user profile "${usr.fullName}"?`)) return;
                                try {
                                  const response = await fetch(`/api/users/${usr.id}`, {
                                    method: "DELETE"
                                  });
                                  if (response.ok) {
                                    setActionSuccess("User profile successfully deleted.");
                                    loadAdminData();
                                  } else {
                                    alert("Failed to delete user profile.");
                                  }
                                } catch (error) {
                                  console.error("Delete user error:", error);
                                  alert("Error deleting user profile.");
                                }
                              }}
                              className="text-red-600 hover:text-red-800 font-bold hover:underline font-mono text-[10px]"
                              title="Delete Profile"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TEAM APPLICATIONS */}
          {activeSubTab === "team" && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
              <h4 className="font-serif font-bold text-sm text-slate-800 mb-4 pb-2 border-b">
                Team Association Registries
              </h4>

              {teamApplications.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">No team requests logged.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b">
                        <th className="py-2.5 px-3">Applicant</th>
                        <th className="py-2.5 px-3">Role Assigned</th>
                        <th className="py-2.5 px-3">Group Category</th>
                        <th className="py-2.5 px-3">Contact Email</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {teamApplications.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <img 
                                src={getAvatarUrl(t.photoUrl, t.fullName)} 
                                alt={t.fullName} 
                                className="w-8 h-8 rounded-full object-cover bg-slate-100 border"
                              />
                              <div>
                                <strong className="text-slate-800 block uppercase text-[11px]">{t.fullName}</strong>
                                <span className="text-slate-400 text-[10px] block">{t.affiliation}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-semibold text-[#1e5894]">{t.role}</td>
                          <td className="py-3 px-3 text-slate-600 font-medium">{t.category}</td>
                          <td className="py-3 px-3 text-slate-400 font-mono text-[10px]">{t.email}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                              t.status === "Approved" ? "bg-green-50 text-green-700 border border-green-200" :
                              t.status === "Rejected" ? "bg-red-50 text-red-700 border border-red-200" :
                              "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}>
                              {t.status}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => setEditingTeamMember(t)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded"
                                title="Edit Role or Group"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {t.status === "Pending" && (
                                <>
                                  <button
                                    onClick={() => handleUpdateTeamStatus(t.id, "Approved")}
                                    className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded"
                                    title="Approve to Directory"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateTeamStatus(t.id, "Rejected")}
                                    className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded"
                                    title="Reject Request"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}

                              {t.status === "Approved" && (
                                <button
                                  onClick={() => handleUpdateTeamStatus(t.id, "Pending")}
                                  className="bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded"
                                  title="Revoke Approval to Pending"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VISITOR INQUIRIES */}
          {activeSubTab === "inquiries" && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
              <h4 className="font-serif font-bold text-sm text-slate-800 mb-4 pb-2 border-b">
                Visitor Correspondence & Messages
              </h4>

              {inquiries.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">No inquiry logged.</div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="bg-slate-50 border p-4 rounded text-xs space-y-2">
                      <div className="flex justify-between items-start border-b pb-1.5">
                        <div>
                          <span className="font-bold text-slate-800 text-xs">{inq.fullName}</span>
                          <span className="text-slate-400 font-mono text-[10px] block mt-0.5">{inq.email}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(inq.submittedAt).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 block mb-1">Subject: {inq.subject}</span>
                        <p className="text-slate-600 leading-relaxed font-sans">
                          {inq.message}
                        </p>
                      </div>
                      <div className="pt-2 text-right">
                        <a 
                          href={`mailto:${inq.email}?subject=Response: ${inq.subject}`}
                          className="bg-blue-50 text-[#1e5894] hover:bg-blue-100 font-bold text-[10px] px-2.5 py-1 rounded border border-blue-100 transition-colors uppercase tracking-wider"
                        >
                          Send Email Response
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GENERAL SITE CUSTOMIZER */}
          {activeSubTab === "settings" && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
              <div className="flex justify-between items-center pb-2 border-b mb-4">
                <h4 className="font-serif font-bold text-sm text-[#1e5894]">
                  General Site Header & Label Customizer
                </h4>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Configure text throughout homepage</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 uppercase text-[10px]">Home Slide/Hero Main Title *</label>
                    <input 
                      type="text" 
                      value={siteSettings.homeTitle || ""}
                      onChange={(e) => setSiteSettings({...siteSettings, homeTitle: e.target.value})}
                      className="w-full p-2.5 border rounded outline-none focus:border-[#1e5894] font-medium text-slate-800"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 uppercase text-[10px]">Apply for Membership Button Label *</label>
                    <input 
                      type="text" 
                      value={siteSettings.ctaButtonText || ""}
                      onChange={(e) => setSiteSettings({...siteSettings, ctaButtonText: e.target.value})}
                      className="w-full p-2.5 border rounded outline-none focus:border-[#1e5894] font-semibold text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 uppercase text-[10px]">Home Slide Description Subtitle *</label>
                  <textarea 
                    rows={2}
                    value={siteSettings.homeSubtitle || ""}
                    onChange={(e) => setSiteSettings({...siteSettings, homeSubtitle: e.target.value})}
                    className="w-full p-2.5 border rounded outline-none focus:border-[#1e5894] resize-none text-slate-600"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 uppercase text-[10px]">Homepage Notice Banner Announcement Ticker *</label>
                  <input 
                    type="text" 
                    value={siteSettings.homeNoticeBanner || ""}
                    onChange={(e) => setSiteSettings({...siteSettings, homeNoticeBanner: e.target.value})}
                    className="w-full p-2.5 border rounded outline-none focus:border-[#1e5894] text-red-700 font-medium"
                    required
                  />
                </div>

                {/* HERO SLIDER CAROUSEL MANAGER */}
                <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <span className="font-serif font-bold text-[#1e5894] block text-sm">Interactive Hero Slideshow Carousel</span>
                      <p className="text-[10px] text-slate-400 font-medium">Add, delete, reorder, and completely configure slides on the landing page</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddNewSlide}
                      className="bg-[#1e5894] hover:bg-blue-800 text-white font-bold text-[10px] py-1 px-3 rounded flex items-center gap-1 uppercase tracking-wider"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Slider</span>
                    </button>
                  </div>

                  {(!siteSettings.slides || siteSettings.slides.length === 0) ? (
                    <p className="text-slate-400 py-4 text-center italic">No sliders customized yet. Standard defaults will render.</p>
                  ) : (
                    <div className="space-y-4">
                      {siteSettings.slides.map((slide, index) => (
                        <div key={slide.id || index} className="bg-white border rounded-lg p-3.5 shadow-sm space-y-3 relative">
                          {/* Slide Header with Controls */}
                          <div className="flex justify-between items-center border-b pb-1.5 bg-slate-50 -m-3.5 mb-2.5 p-2 rounded-t-lg">
                            <span className="font-bold text-slate-700 font-mono text-[11px] flex items-center gap-1">
                              <span className="bg-blue-600 text-white w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] font-bold">
                                {index + 1}
                              </span>
                              <span>Slider Profile: {slide.tag || "Untitled"}</span>
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMoveSlide(index, 'up')}
                                className="p-1 text-slate-500 hover:bg-slate-100 rounded disabled:opacity-30"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={index === siteSettings.slides!.length - 1}
                                onClick={() => handleMoveSlide(index, 'down')}
                                className="p-1 text-slate-500 hover:bg-slate-100 rounded disabled:opacity-30"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSlide(index)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Delete Slider"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Slide Fields */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            <div className="space-y-2">
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-600 uppercase">Slide Headline/Title *</label>
                                <input
                                  type="text"
                                  required
                                  value={slide.title}
                                  onChange={(e) => {
                                    const updated = [...siteSettings.slides!];
                                    updated[index] = { ...updated[index], title: e.target.value };
                                    setSiteSettings({ ...siteSettings, slides: updated });
                                  }}
                                  className="w-full p-2 border rounded font-semibold text-slate-800 text-[11px]"
                                  placeholder="Headline Title"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-600 uppercase">Description Subtitle *</label>
                                <textarea
                                  rows={2}
                                  required
                                  value={slide.description}
                                  onChange={(e) => {
                                    const updated = [...siteSettings.slides!];
                                    updated[index] = { ...updated[index], description: e.target.value };
                                    setSiteSettings({ ...siteSettings, slides: updated });
                                  }}
                                  className="w-full p-2 border rounded text-slate-600 text-[11px] leading-relaxed"
                                  placeholder="Sub-description"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-600 uppercase">Slider Tag Category *</label>
                                <input
                                  type="text"
                                  required
                                  value={slide.tag}
                                  onChange={(e) => {
                                    const updated = [...siteSettings.slides!];
                                    updated[index] = { ...updated[index], tag: e.target.value };
                                    setSiteSettings({ ...siteSettings, slides: updated });
                                  }}
                                  className="w-full p-2 border rounded font-mono text-slate-700 text-[11px]"
                                  placeholder="e.g. Academic Leadership"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-600 uppercase">Slide Background Image Banner (Cloudinary) *</label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    required
                                    value={slide.img}
                                    onChange={(e) => {
                                      const updated = [...siteSettings.slides!];
                                      updated[index] = { ...updated[index], img: e.target.value };
                                      setSiteSettings({ ...siteSettings, slides: updated });
                                    }}
                                    className="w-full p-2 border rounded text-xs text-slate-600"
                                    placeholder="Image URL"
                                  />
                                  <label className={`px-2.5 py-2 text-[10px] font-bold rounded border cursor-pointer whitespace-nowrap flex items-center justify-center min-w-[100px] ${uploadingSlideIndex === index ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'}`}>
                                    {uploadingSlideIndex === index ? (
                                      <div className="w-4 h-4 border-2 border-t-transparent border-amber-600 rounded-full animate-spin"></div>
                                    ) : (
                                      "Upload File"
                                    )}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleSlideImageUpload(index, e)}
                                      className="hidden"
                                      disabled={uploadingSlideIndex !== null}
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Button configurations requested: Button Color, Button Text Color, Button Link, Button Text */}
                          <div className="border-t pt-2.5 mt-2 bg-slate-50/50 p-2.5 rounded grid grid-cols-1 md:grid-cols-4 gap-2.5">
                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-slate-500 uppercase">Button Background Color</label>
                              <div className="flex gap-1.5 items-center">
                                <input
                                  type="color"
                                  value={slide.buttonColor || "#f59e0b"}
                                  onChange={(e) => {
                                    const updated = [...siteSettings.slides!];
                                    updated[index] = { ...updated[index], buttonColor: e.target.value };
                                    setSiteSettings({ ...siteSettings, slides: updated });
                                  }}
                                  className="w-7 h-7 border rounded cursor-pointer shrink-0"
                                />
                                <input
                                  type="text"
                                  value={slide.buttonColor || "#f59e0b"}
                                  onChange={(e) => {
                                    const updated = [...siteSettings.slides!];
                                    updated[index] = { ...updated[index], buttonColor: e.target.value };
                                    setSiteSettings({ ...siteSettings, slides: updated });
                                  }}
                                  className="w-full p-1 border rounded text-[10px] font-mono"
                                  placeholder="#f59e0b"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-slate-500 uppercase">Button Text Color</label>
                              <div className="flex gap-1.5 items-center">
                                <input
                                  type="color"
                                  value={slide.buttonTextColor || "#020617"}
                                  onChange={(e) => {
                                    const updated = [...siteSettings.slides!];
                                    updated[index] = { ...updated[index], buttonTextColor: e.target.value };
                                    setSiteSettings({ ...siteSettings, slides: updated });
                                  }}
                                  className="w-7 h-7 border rounded cursor-pointer shrink-0"
                                />
                                <input
                                  type="text"
                                  value={slide.buttonTextColor || "#020617"}
                                  onChange={(e) => {
                                    const updated = [...siteSettings.slides!];
                                    updated[index] = { ...updated[index], buttonTextColor: e.target.value };
                                    setSiteSettings({ ...siteSettings, slides: updated });
                                  }}
                                  className="w-full p-1 border rounded text-[10px] font-mono"
                                  placeholder="#020617"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-slate-500 uppercase">Button Label Text *</label>
                              <input
                                type="text"
                                required
                                value={slide.buttonText || "Apply for Online Membership"}
                                onChange={(e) => {
                                  const updated = [...siteSettings.slides!];
                                  updated[index] = { ...updated[index], buttonText: e.target.value };
                                  setSiteSettings({ ...siteSettings, slides: updated });
                                }}
                                className="w-full p-1.5 border rounded text-[11px] font-semibold text-slate-800"
                                placeholder="Apply for Online Membership"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[9px] font-bold text-slate-500 uppercase">Button Redirect Link *</label>
                              <select
                                value={slide.buttonLink || "membership"}
                                onChange={(e) => {
                                  const updated = [...siteSettings.slides!];
                                  updated[index] = { ...updated[index], buttonLink: e.target.value };
                                  setSiteSettings({ ...siteSettings, slides: updated });
                                }}
                                className="w-full p-1.5 border rounded text-[11px] font-medium text-slate-700 bg-white"
                              >
                                <option value="membership">Online Membership Application</option>
                                <option value="about">CME Legacy History & Details</option>
                                <option value="programs">Academic Programs & workshops</option>
                                <option value="publications">Publications & Books Archive</option>
                                <option value="blogs">Blogs & Educational News</option>
                                <option value="search">Search Syllabus Database</option>
                                <option value="inquiry">Interactive Helpdesk</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3.5">
                  <span className="font-serif font-bold text-[#1e5894] block">"About Us" Homepage Section</span>
                  
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 uppercase text-[9px]">About Us Title *</label>
                    <input 
                      type="text" 
                      value={siteSettings.aboutHomeTitle || ""}
                      onChange={(e) => setSiteSettings({...siteSettings, aboutHomeTitle: e.target.value})}
                      className="w-full p-2 border rounded outline-none bg-white font-serif font-bold text-slate-800"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-600 uppercase text-[9px]">About Us Description Paragraph *</label>
                    <textarea 
                      rows={4}
                      value={siteSettings.aboutHomeText || ""}
                      onChange={(e) => setSiteSettings({...siteSettings, aboutHomeText: e.target.value})}
                      className="w-full p-2 border rounded outline-none bg-white leading-relaxed text-slate-600"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 uppercase text-[10px]">Official Support Email *</label>
                    <input 
                      type="email" 
                      value={siteSettings.supportEmail || ""}
                      onChange={(e) => setSiteSettings({...siteSettings, supportEmail: e.target.value})}
                      className="w-full p-2.5 border rounded outline-none focus:border-[#1e5894]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 uppercase text-[10px]">Official Support Phone Contact *</label>
                    <input 
                      type="text" 
                      value={siteSettings.supportPhone || ""}
                      onChange={(e) => setSiteSettings({...siteSettings, supportPhone: e.target.value})}
                      className="w-full p-2.5 border rounded outline-none focus:border-[#1e5894]"
                      required
                    />
                  </div>
                </div>

                {/* HEADER & FOOTER IDENTITY CUSTOMIZATION */}
                <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-4">
                  <span className="font-serif font-bold text-[#1e5894] block text-sm">Header & Footer Global Identity Customizer</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Header Title / Main Name *</label>
                      <input 
                        type="text" 
                        value={siteSettings.headerTitle || ""}
                        onChange={(e) => setSiteSettings({...siteSettings, headerTitle: e.target.value})}
                        placeholder="Council for Mathematics Education"
                        className="w-full p-2.5 border rounded outline-none focus:border-[#1e5894] bg-white font-serif font-bold text-slate-800"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Header Subtitle / Registration Info *</label>
                      <input 
                        type="text" 
                        value={siteSettings.headerSubtitle || ""}
                        onChange={(e) => setSiteSettings({...siteSettings, headerSubtitle: e.target.value})}
                        placeholder="Regd No. 843/054-055, Lalitpur, Nepal"
                        className="w-full p-2.5 border rounded outline-none focus:border-[#1e5894] bg-white text-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="block font-bold text-slate-700 uppercase text-[10px]">Footer Brand Description Statement *</label>
                    <textarea 
                      rows={2}
                      value={siteSettings.footerDescription || ""}
                      onChange={(e) => setSiteSettings({...siteSettings, footerDescription: e.target.value})}
                      placeholder="Established in 1991 (2048 B.S.), CME is Nepal's premier government-recognized academic society, promoting syllabus modernisation, student olympiads, and intensive teacher-capacity development."
                      className="w-full p-2.5 border rounded outline-none focus:border-[#1e5894] resize-none bg-white text-slate-600"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Footer Regd / Legal Stamp *</label>
                      <input 
                        type="text" 
                        value={siteSettings.footerRegd || ""}
                        onChange={(e) => setSiteSettings({...siteSettings, footerRegd: e.target.value})}
                        placeholder="Regd No. 843/054-055, Lalitpur, Nepal"
                        className="w-full p-2.5 border rounded outline-none focus:border-[#1e5894] bg-white text-slate-800"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Footer Address / Seat Location *</label>
                      <input 
                        type="text" 
                        value={siteSettings.footerAddress || ""}
                        onChange={(e) => setSiteSettings({...siteSettings, footerAddress: e.target.value})}
                        placeholder="Manbhawan, Ward 5, Lalitpur, Nepal"
                        className="w-full p-2.5 border rounded outline-none focus:border-[#1e5894] bg-white text-slate-800"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Footer Copyright / legal Stripe *</label>
                      <input 
                        type="text" 
                        value={siteSettings.footerCopyright || ""}
                        onChange={(e) => setSiteSettings({...siteSettings, footerCopyright: e.target.value})}
                        placeholder="© 1991 - 2026 Council for Mathematics Education. All Rights Reserved."
                        className="w-full p-2.5 border rounded outline-none focus:border-[#1e5894] bg-white text-slate-800"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* CONTACT US HEADQUARTERS & MAPS CUSTOMIZATION */}
                <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-4">
                  <span className="font-serif font-bold text-[#1e5894] block text-sm">Contact Us Page Headquarters & Google Map Customizer</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">CME Office Location / Physical Address *</label>
                      <input 
                        type="text" 
                        value={siteSettings.contactAddress || ""}
                        onChange={(e) => setSiteSettings({...siteSettings, contactAddress: e.target.value})}
                        placeholder="Manbhawan, Ward 5, Lalitpur (Near Lalitpur High School), Lalitpur District, Nepal"
                        className="w-full p-2.5 border rounded outline-none focus:border-[#1e5894] bg-white text-slate-800"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Official Lines / Telephone Contacts *</label>
                      <input 
                        type="text" 
                        value={siteSettings.contactPhone || ""}
                        onChange={(e) => setSiteSettings({...siteSettings, contactPhone: e.target.value})}
                        placeholder="+977-1-5524320 / +977-1-5544212"
                        className="w-full p-2.5 border rounded outline-none focus:border-[#1e5894] bg-white text-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Official Emails (Comma Separated) *</label>
                      <input 
                        type="text" 
                        value={siteSettings.contactEmails || ""}
                        onChange={(e) => setSiteSettings({...siteSettings, contactEmails: e.target.value})}
                        placeholder="info@mathscouncil.edu.np, secretary@mathscouncil.edu.np"
                        className="w-full p-2.5 border rounded outline-none focus:border-[#1e5894] bg-white text-slate-800"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Office Hours Statement *</label>
                      <textarea 
                        rows={3}
                        value={siteSettings.contactOfficeHours || ""}
                        onChange={(e) => setSiteSettings({...siteSettings, contactOfficeHours: e.target.value})}
                        placeholder="Sunday to Friday (Academic Session):&#10;10:00 AM – 4:00 PM (NPT)&#10;Closed on National Gazetted Holidays and Saturdays."
                        className="w-full p-2.5 border rounded outline-none focus:border-[#1e5894] bg-white text-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="block font-bold text-slate-700 uppercase text-[10px]">Google Maps Iframe Embed Code / Source URL *</label>
                    <textarea 
                      rows={3}
                      value={siteSettings.contactMapEmbed || ""}
                      onChange={(e) => setSiteSettings({...siteSettings, contactMapEmbed: e.target.value})}
                      placeholder="Paste google maps embed <iframe src='...'> or raw URL link"
                      className="w-full p-2.5 border rounded outline-none focus:border-[#1e5894] bg-white text-slate-800"
                      required
                    />
                    <p className="text-[10px] text-slate-400">
                      Supports direct Google Maps share URLs or full Google Maps embed <code className="bg-slate-100 px-1 py-0.5 rounded">&lt;iframe src="..."&gt;</code> HTML codes.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-end">
                  <button 
                    type="submit"
                    className="bg-[#1e5894] hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded shadow flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Site Configurations</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: BLOGS & RESEARCH NEWS MANAGEMENT */}
          {activeSubTab === "blogs" && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
              
              {/* Blog Listing Header / Control Trigger */}
              <div className="flex justify-between items-center pb-2 border-b mb-4">
                <h4 className="font-serif font-bold text-sm text-[#1e5894]">
                  {isCreatingBlog ? (editingBlog ? "Edit Research Blog Post" : "Compose New Blog Article") : "CME Scholarly Blogs & News"}
                </h4>
                <button
                  onClick={() => {
                    if (isCreatingBlog) {
                      setIsCreatingBlog(false);
                      setEditingBlog(null);
                    } else {
                      setEditingBlog(null);
                      setBlogForm({
                        title: "",
                        excerpt: "",
                        content: "",
                        category: "Pedagogy",
                        author: "",
                        imageUrl: "",
                        status: "Published"
                      });
                      setIsCreatingBlog(true);
                    }
                  }}
                  className="bg-[#1e5894] text-white hover:bg-blue-800 text-[10px] font-bold py-1 px-2.5 rounded flex items-center gap-1 uppercase tracking-wider"
                >
                  {isCreatingBlog ? "Back to Articles" : "Compose Article"}
                </button>
              </div>

              {isCreatingBlog ? (
                /* Composition Form */
                <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Article Title *</label>
                      <input 
                        type="text" 
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                        placeholder="e.g. Modernized Abacus Training for Primary Schools"
                        className="w-full p-2.5 border rounded outline-none font-serif font-bold text-slate-800"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Category / Subject *</label>
                      <input 
                        type="text" 
                        value={blogForm.category}
                        onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                        placeholder="e.g. Pedagogy, Research, Math Olympiad"
                        className="w-full p-2.5 border rounded outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Author Name *</label>
                      <input 
                        type="text" 
                        value={blogForm.author}
                        onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
                        placeholder="e.g. Bishal Codes"
                        className="w-full p-2.5 border rounded outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Feature Banner Photo (Cloudinary)</label>
                      <div className="flex gap-2">
                        <input 
                          type="url" 
                          value={blogForm.imageUrl}
                          onChange={(e) => setBlogForm({...blogForm, imageUrl: e.target.value})}
                          placeholder="e.g. https://images.unsplash.com/..."
                          className="w-full p-2.5 border rounded outline-none text-xs"
                        />
                        <label className={`px-3 py-2 text-xs font-bold rounded border cursor-pointer whitespace-nowrap flex items-center justify-center min-w-[120px] ${uploadingBlogImage ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'}`}>
                          {uploadingBlogImage ? (
                            <div className="w-4 h-4 border-2 border-t-transparent border-amber-600 rounded-full animate-spin"></div>
                          ) : (
                            "Upload File"
                          )}
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleBlogImageFileChange} 
                            className="hidden" 
                            disabled={uploadingBlogImage}
                          />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Status *</label>
                      <select 
                        value={blogForm.status}
                        onChange={(e) => setBlogForm({...blogForm, status: e.target.value as any})}
                        className="w-full p-2.5 border rounded outline-none bg-white font-semibold"
                      >
                        <option value="Published">Published (Publicly Visible)</option>
                        <option value="Draft">Draft (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 uppercase text-[10px]">Short Summary Excerpt *</label>
                    <textarea 
                      rows={2}
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                      placeholder="Write a brief 1-2 sentence preview to draw mathematical scholars' attention..."
                      className="w-full p-2.5 border rounded outline-none resize-none text-slate-600"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 uppercase text-[10px]">Full Scholarly Content *</label>
                    <textarea 
                      rows={6}
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                      placeholder="Write the complete technical analysis, research results, or curriculum bulletin..."
                      className="w-full p-2.5 border rounded outline-none font-sans leading-relaxed text-slate-700"
                      required
                    />
                  </div>

                  <div className="pt-3 border-t flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingBlog(false);
                        setEditingBlog(null);
                      }}
                      className="px-4 py-2 border rounded hover:bg-slate-50 text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded flex items-center gap-1 shadow"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingBlog ? "Update Post" : "Publish Article"}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Listing Layout */
                blogs.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-400">No blog posts found. Feel free to publish.</div>
                ) : (
                  <div className="space-y-3">
                    {blogs.map((blog) => (
                      <div key={blog.id} className="bg-slate-50 border p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          {blog.imageUrl ? (
                            <img src={blog.imageUrl} alt={blog.title} className="w-12 h-12 rounded object-cover bg-slate-200 border" />
                          ) : (
                            <div className="w-12 h-12 rounded bg-slate-200 flex items-center justify-center text-slate-400 border">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <span className="bg-amber-100 text-amber-800 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded mr-1.5">
                              {blog.category}
                            </span>
                            <span className="text-slate-400 text-[10px]">{blog.date}</span>
                            <h5 className="font-bold text-slate-800 font-serif text-sm mt-0.5 hover:text-[#1e5894]">{blog.title}</h5>
                            <p className="text-slate-500 text-[11px] mt-0.5">Author: <strong className="text-slate-600">{blog.author}</strong> • Status: 
                              <span className={`ml-1 font-bold ${blog.status === "Published" ? "text-green-600" : "text-amber-500"}`}>{blog.status}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0 self-end md:self-auto">
                          <button
                            onClick={() => handleEditBlogBtnClick(blog)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded flex items-center gap-1 border"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-2.5 py-1.5 rounded flex items-center gap-1 border border-red-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}

          {/* TAB 6: TESTIMONIALS MANAGER */}
          {activeSubTab === "testimonials" && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center pb-2 border-b mb-4">
                <h4 className="font-serif font-bold text-sm text-[#1e5894]">
                  {isCreatingTestimonial ? (editingTestimonial ? "Edit Educator Testimonial" : "Add Traditional Educator Review") : "Verified Testimonials Queue"}
                </h4>
                <button
                  onClick={() => {
                    if (isCreatingTestimonial) {
                      setIsCreatingTestimonial(false);
                      setEditingTestimonial(null);
                    } else {
                      setEditingTestimonial(null);
                      setTestimonialForm({
                        name: "",
                        designation: "",
                        affiliation: "",
                        message: "",
                        rating: 5,
                        status: "Approved"
                      });
                      setIsCreatingTestimonial(true);
                    }
                  }}
                  className="bg-[#1e5894] text-white hover:bg-blue-800 text-[10px] font-bold py-1 px-2.5 rounded flex items-center gap-1 uppercase tracking-wider"
                >
                  {isCreatingTestimonial ? "Back to Feedback Queue" : "Create Review"}
                </button>
              </div>

              {isCreatingTestimonial ? (
                /* Creating form */
                <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Educator Full Name *</label>
                      <input 
                        type="text" 
                        value={testimonialForm.name}
                        onChange={(e) => setTestimonialForm({...testimonialForm, name: e.target.value})}
                        placeholder="e.g. Bishal Codes"
                        className="w-full p-2.5 border rounded outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Academic Designation *</label>
                      <input 
                        type="text" 
                        value={testimonialForm.designation}
                        onChange={(e) => setTestimonialForm({...testimonialForm, designation: e.target.value})}
                        placeholder="e.g. Associate Professor of Mathematics"
                        className="w-full p-2.5 border rounded outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Institution / Affiliation *</label>
                      <input 
                        type="text" 
                        value={testimonialForm.affiliation}
                        onChange={(e) => setTestimonialForm({...testimonialForm, affiliation: e.target.value})}
                        placeholder="e.g. Tribhuvan University, Nepal"
                        className="w-full p-2.5 border rounded outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Star Ratings *</label>
                      <select 
                        value={testimonialForm.rating}
                        onChange={(e) => setTestimonialForm({...testimonialForm, rating: Number(e.target.value)})}
                        className="w-full p-2.5 border rounded bg-white outline-none font-semibold text-slate-800"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                        <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                        <option value={3}>⭐⭐⭐ (3 Stars)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Status *</label>
                      <select 
                        value={testimonialForm.status}
                        onChange={(e) => setTestimonialForm({...testimonialForm, status: e.target.value as any})}
                        className="w-full p-2.5 border rounded bg-white outline-none font-semibold text-slate-800"
                      >
                        <option value="Approved">Approved (Visible on Home)</option>
                        <option value="Pending">Pending Audit</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 uppercase text-[10px]">Detailed Review Message *</label>
                    <textarea 
                      rows={4}
                      value={testimonialForm.message}
                      onChange={(e) => setTestimonialForm({...testimonialForm, message: e.target.value})}
                      placeholder="Write the full feedback content of the educator regarding CME syllabi modernist updates..."
                      className="w-full p-2.5 border rounded outline-none resize-none leading-relaxed text-slate-600"
                      required
                    />
                  </div>

                  <div className="pt-3 border-t flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingTestimonial(false);
                        setEditingTestimonial(null);
                      }}
                      className="px-4 py-2 border rounded text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2 rounded shadow"
                    >
                      {editingTestimonial ? "Update Review" : "Add Review"}
                    </button>
                  </div>
                </form>
              ) : (
                /* Listing reviews */
                testimonials.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-400">No testimonial records logged yet.</div>
                ) : (
                  <div className="space-y-3">
                    {testimonials.map((test) => (
                      <div key={test.id} className="bg-slate-50 border p-4 rounded-lg flex flex-col justify-between gap-3 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-slate-800 uppercase block text-[11px]">{test.name}</strong>
                            <span className="text-slate-400 text-[10px] block">{test.designation}, {test.affiliation}</span>
                            <div className="flex text-amber-400 mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < test.rating ? "fill-amber-400" : "text-slate-200"}`} />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase mr-2 ${
                              test.status === "Approved" ? "bg-green-50 text-green-700 border border-green-200" :
                              test.status === "Rejected" ? "bg-red-50 text-red-700 border border-red-200" :
                              "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}>
                              {test.status}
                            </span>
                            {test.status !== "Approved" && (
                              <button
                                onClick={() => handleToggleTestimonialApproval(test.id, "Approved")}
                                className="bg-green-600 hover:bg-green-700 text-white p-1 rounded"
                                title="Approve"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {test.status !== "Rejected" && (
                              <button
                                onClick={() => handleToggleTestimonialApproval(test.id, "Rejected")}
                                className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                                title="Reject"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-slate-600 italic bg-white p-2 rounded border border-slate-200 leading-relaxed font-sans">
                          "{test.message}"
                        </p>

                        <div className="pt-2 border-t flex justify-end gap-1.5">
                          <button
                            onClick={() => handleEditTestimonialBtn(test)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded border flex items-center gap-1 font-bold text-[10px]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Modify</span>
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(test.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 rounded border border-red-100 flex items-center gap-1 font-bold text-[10px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}

          {/* TAB 7: FAQ SCHEMA BUILDER */}
          {activeSubTab === "faqs" && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
              
              <div className="flex justify-between items-center pb-2 border-b mb-4">
                <h4 className="font-serif font-bold text-sm text-[#1e5894]">
                  {isCreatingFaq ? (editingFaq ? "Modify FAQ Entry" : "Create New FAQ Entry") : "FAQ Categorical Listings"}
                </h4>
                <button
                  onClick={() => {
                    if (isCreatingFaq) {
                      setIsCreatingFaq(false);
                      setEditingFaq(null);
                    } else {
                      setEditingFaq(null);
                      setFaqForm({
                        question: "",
                        answer: "",
                        category: "Membership",
                        order: faqs.length + 1
                      });
                      setIsCreatingFaq(true);
                    }
                  }}
                  className="bg-[#1e5894] text-white hover:bg-blue-800 text-[10px] font-bold py-1 px-2.5 rounded flex items-center gap-1 uppercase tracking-wider"
                >
                  {isCreatingFaq ? "Back to FAQ Listing" : "Compose FAQ"}
                </button>
              </div>

              {isCreatingFaq ? (
                /* composition faq form */
                <form onSubmit={handleSaveFaq} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">FAQ Question *</label>
                      <input 
                        type="text" 
                        value={faqForm.question}
                        onChange={(e) => setFaqForm({...faqForm, question: e.target.value})}
                        placeholder="e.g. How do I download my membership certificate?"
                        className="w-full p-2.5 border rounded outline-none font-bold text-slate-800"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Category / Group Name *</label>
                      <input 
                        type="text" 
                        value={faqForm.category}
                        onChange={(e) => setFaqForm({...faqForm, category: e.target.value})}
                        placeholder="e.g. Membership, Training, General"
                        className="w-full p-2.5 border rounded outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 uppercase text-[10px]">Display Priority Order *</label>
                      <input 
                        type="number" 
                        value={faqForm.order}
                        onChange={(e) => setFaqForm({...faqForm, order: Number(e.target.value)})}
                        placeholder="e.g. 1"
                        className="w-full p-2.5 border rounded outline-none font-mono font-bold"
                        required
                        min={1}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 uppercase text-[10px]">Detailed Answer Text *</label>
                    <textarea 
                      rows={5}
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm({...faqForm, answer: e.target.value})}
                      placeholder="Input the full descriptive answer which will be shown inside the FAQ catalog."
                      className="w-full p-2.5 border rounded outline-none leading-relaxed text-slate-600"
                      required
                    />
                  </div>

                  <div className="pt-3 border-t flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingFaq(false);
                        setEditingFaq(null);
                      }}
                      className="px-4 py-2 border rounded text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded shadow"
                    >
                      {editingFaq ? "Update FAQ" : "Save FAQ"}
                    </button>
                  </div>
                </form>
              ) : (
                /* Listing FAQs */
                faqs.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-400">No FAQ entries found.</div>
                ) : (
                  <div className="space-y-3">
                    {faqs.map((f, index) => (
                      <div key={f.id} className="bg-slate-50 border p-4 rounded-lg text-xs space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="bg-slate-200 text-slate-700 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded mr-1.5 font-mono">
                              Weight: {f.order || index + 1}
                            </span>
                            <span className="bg-blue-100 text-[#1e5894] text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">
                              {f.category}
                            </span>
                            <h5 className="font-bold text-slate-800 font-serif text-sm mt-1.5 flex gap-1">
                              <span className="text-amber-500 font-mono">Q:</span> {f.question}
                            </h5>
                          </div>

                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditFaqBtn(f)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1 rounded border"
                              title="Edit question"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteFaq(f.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 p-1 rounded border border-red-100"
                              title="Delete FAQ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-slate-600 leading-relaxed font-sans pl-4 border-l border-slate-300 bg-white p-2 rounded whitespace-pre-line">
                          {f.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}

          {/* TAB 8: CLOUDINARY MEDIA STORAGE */}
          {activeSubTab === "media" && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center pb-2 border-b mb-4">
                <div>
                  <h4 className="font-serif font-bold text-sm text-cyan-900 flex items-center gap-1.5">
                    <FolderOpen className="w-4 h-4 text-cyan-600" />
                    <span>Cloudinary Media Registry</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Secure Cloudinary bucket storage. Upload folders, PDF books, syllabus sheets, team graphics, or videos.
                  </p>
                </div>
                <label className="bg-cyan-600 text-white hover:bg-cyan-700 text-[10px] font-bold py-1.5 px-3 rounded flex items-center gap-1 uppercase tracking-wider cursor-pointer">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Document / Media</span>
                  <input
                    type="file"
                    accept="*/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      const reader = new FileReader();
                      reader.onloadend = async () => {
                        try {
                          showSuccessNotice("Initiating secure Cloudinary transfer...");
                          const res = await fetch("/api/upload", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              file: reader.result as string,
                              folder: "general_media"
                            })
                          });
                          const data = await res.json();
                          if (res.ok && data.success) {
                            // save media metadata log to Firestore
                            const logRes = await fetch("/api/media", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                name: file.name,
                                url: data.url,
                                type: file.type || "application/octet-stream",
                                size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
                              })
                            });
                            if (logRes.ok) {
                              showSuccessNotice("File successfully registered and stored on Cloudinary!");
                              loadAdminData();
                            }
                          } else {
                            alert("Upload failed: " + (data.error || "Please try again."));
                          }
                        } catch (err) {
                          console.error(err);
                          alert("Error during Cloudinary upload stream.");
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {mediaList.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg">
                  <UploadCloud className="w-10 h-10 text-slate-300 mx-auto mb-2 animate-bounce" />
                  <p className="text-xs font-bold text-slate-500 font-serif">Cloudinary Storage is Empty</p>
                  <p className="text-[10px] text-slate-400 mt-1">Upload any PDF, Syllabus, Lecture PDF, or Graphic Banner to copy its secure URL.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">File Name</th>
                        <th className="py-2.5 px-3">File Size</th>
                        <th className="py-2.5 px-3">Uploaded On</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mediaList.map((media) => {
                        const isPdf = media.type?.includes("pdf") || media.name?.endsWith(".pdf");
                        const isImage = media.type?.includes("image");
                        const isVideo = media.type?.includes("video");

                        return (
                          <tr key={media.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              {isPdf && <span className="bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase">PDF</span>}
                              {isImage && <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase">Image</span>}
                              {isVideo && <span className="bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase">Video</span>}
                              {!isPdf && !isImage && !isVideo && <span className="bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase">File</span>}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-700 truncate max-w-[200px]" title={media.name}>
                              {media.name || "Unnamed Cloud Binary"}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 font-mono text-[10px]">
                              {media.size || "Unknown Size"}
                            </td>
                            <td className="py-2.5 px-3 text-slate-400 text-[10px]">
                              {media.uploadedAt ? new Date(media.uploadedAt).toLocaleDateString() : "Just Now"}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(media.url);
                                    showSuccessNotice("Cloudinary secure CDN URL copied to clipboard!");
                                  }}
                                  className="p-1 text-slate-500 hover:text-cyan-600 bg-white border border-slate-200 rounded shadow-sm hover:border-cyan-200 transition-colors"
                                  title="Copy secure link"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <a
                                  href={media.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 text-slate-500 hover:text-blue-600 bg-white border border-slate-200 rounded shadow-sm hover:border-blue-200 transition-colors"
                                  title="View document"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (!confirm("Are you sure you want to remove this file link? This will not delete it from Cloudinary, but will unregister it from this index.")) return;
                                    try {
                                      const delRes = await fetch(`/api/media/${media.id}`, { method: "DELETE" });
                                      if (delRes.ok) {
                                        showSuccessNotice("File reference removed successfully.");
                                        loadAdminData();
                                      }
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }}
                                  className="p-1 text-red-400 hover:text-red-600 bg-white border border-slate-200 rounded shadow-sm hover:border-red-200 transition-colors"
                                  title="Delete Reference"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 9: PROGRAMS MANAGEMENT */}
          {activeSubTab === "programs" && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center pb-2 border-b mb-4">
                <div>
                  <h4 className="font-serif font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-amber-500" />
                    <span>Manage Programs & Training Schemes</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Configure curriculum workshops, regional teacher mentoring, mathematical olympiads, or research grants.
                  </p>
                </div>
                {!isCreatingProgram && (
                  <button
                    onClick={() => {
                      setEditingProgram(null);
                      setProgramForm({
                        title: "",
                        description: "",
                        duration: "",
                        target: "",
                        order: programsList.length + 1
                      });
                      setIsCreatingProgram(true);
                    }}
                    className="bg-[#1e5894] text-white hover:bg-blue-800 text-[10px] font-bold py-1.5 px-3 rounded flex items-center gap-1 uppercase tracking-wider"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Program</span>
                  </button>
                )}
              </div>

              {isCreatingProgram ? (
                <form onSubmit={handleSaveProgram} className="space-y-4 text-xs border bg-slate-50 p-4 rounded border-slate-200">
                  <h5 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] pb-1 border-b">
                    {editingProgram ? "Update Program Scheme" : "Register New Training Program"}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Program Title *</label>
                      <input
                        type="text"
                        required
                        value={programForm.title}
                        onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                        placeholder="e.g. Primary School Math-Lab Empowerment"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Target Audience *</label>
                      <input
                        type="text"
                        required
                        value={programForm.target}
                        onChange={(e) => setProgramForm({ ...programForm, target: e.target.value })}
                        placeholder="e.g. Primary & Lower-Secondary Teachers"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Program Duration / Date *</label>
                      <input
                        type="text"
                        required
                        value={programForm.duration}
                        onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })}
                        placeholder="e.g. Semi-annual (Winter & Summer) / Continuous"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Display Order Number *</label>
                      <input
                        type="number"
                        required
                        value={programForm.order}
                        onChange={(e) => setProgramForm({ ...programForm, order: Number(e.target.value) })}
                        placeholder="1, 2, 3..."
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Program Description *</label>
                    <textarea
                      rows={4}
                      required
                      value={programForm.description}
                      onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                      placeholder="Detailed overview of the scheme goals, Visual models provided, syllabus alignment, and teacher expectations."
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-sans leading-relaxed resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingProgram(false)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#1e5894] hover:bg-blue-800 text-white font-bold px-4 py-2 rounded shadow flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingProgram ? "Update Program" : "Save and Publish"}</span>
                    </button>
                  </div>
                </form>
              ) : programsList.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">No programs registered.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {programsList.map((prog) => (
                    <div key={prog.id} className="bg-slate-50 border border-slate-200 rounded p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="bg-blue-100 text-blue-800 text-[9px] uppercase tracking-wide font-bold px-1.5 py-0.5 rounded">
                            {prog.target}
                          </span>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => handleEditProgramBtn(prog)}
                              className="bg-white hover:bg-slate-100 p-1 rounded border text-slate-600"
                              title="Edit Program"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteProgram(prog.id)}
                              className="bg-white hover:bg-red-50 p-1 rounded border text-red-500 border-red-100"
                              title="Delete Program"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <h5 className="font-serif font-bold text-xs text-slate-800 leading-snug">{prog.title}</h5>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-3">{prog.description}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/50 flex justify-between text-[10px] text-slate-400">
                        <span className="font-medium font-mono">Order: #{prog.order}</span>
                        <span className="font-medium">Date: {prog.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 10: PUBLICATIONS MANAGEMENT */}
          {activeSubTab === "publications" && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center pb-2 border-b mb-4">
                <div>
                  <h4 className="font-serif font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <Book className="w-4 h-4 text-[#1e5894]" />
                    <span>Manage Publications & Reference Library</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Upload new Academic Journals, Teacher Practice Toolkits, National Olympiad compilations, and PDF Bulletins.
                  </p>
                </div>
                {!isCreatingPublication && (
                  <button
                    onClick={() => {
                      setEditingPublication(null);
                      setPublicationForm({
                        title: "",
                        description: "",
                        type: "Academic Journal",
                        published: "",
                        size: "",
                        fileUrl: "",
                        order: publicationsList.length + 1
                      });
                      setIsCreatingPublication(true);
                    }}
                    className="bg-[#1e5894] text-white hover:bg-blue-800 text-[10px] font-bold py-1.5 px-3 rounded flex items-center gap-1 uppercase tracking-wider"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Publication</span>
                  </button>
                )}
              </div>

              {isCreatingPublication ? (
                <form onSubmit={handleSavePublication} className="space-y-4 text-xs border bg-slate-50 p-4 rounded border-slate-200">
                  <h5 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] pb-1 border-b">
                    {editingPublication ? "Update Publication Metadata" : "Register New Publication Asset"}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Publication Title *</label>
                      <input
                        type="text"
                        required
                        value={publicationForm.title}
                        onChange={(e) => setPublicationForm({ ...publicationForm, title: e.target.value })}
                        placeholder="e.g. The Mathematics Education Journal (Volume 34)"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Publication Type *</label>
                      <select
                        value={publicationForm.type}
                        onChange={(e) => setPublicationForm({ ...publicationForm, type: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-700 font-semibold"
                      >
                        <option value="Academic Journal">Academic Journal</option>
                        <option value="Mentoring Guidebook">Mentoring Guidebook</option>
                        <option value="Competition Prep Kit">Competition Prep Kit</option>
                        <option value="Bulletin">Bulletin</option>
                        <option value="Syllabus Sheet">Syllabus Sheet</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Released Date / Month *</label>
                      <input
                        type="text"
                        required
                        value={publicationForm.published}
                        onChange={(e) => setPublicationForm({ ...publicationForm, published: e.target.value })}
                        placeholder="e.g. May 2026"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">File Size *</label>
                      <input
                        type="text"
                        required
                        value={publicationForm.size}
                        onChange={(e) => setPublicationForm({ ...publicationForm, size: e.target.value })}
                        placeholder="e.g. 4.2 MB"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Order *</label>
                      <input
                        type="number"
                        required
                        value={publicationForm.order}
                        onChange={(e) => setPublicationForm({ ...publicationForm, order: Number(e.target.value) })}
                        placeholder="1"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-mono"
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-3 rounded">
                    <label className="block text-amber-900 font-bold mb-1">Direct Download File URL (Optional)</label>
                    <input
                      type="url"
                      value={publicationForm.fileUrl}
                      onChange={(e) => setPublicationForm({ ...publicationForm, fileUrl: e.target.value })}
                      placeholder="e.g. https://res.cloudinary.com/..."
                      className="w-full bg-white border border-amber-300 rounded px-2.5 py-1.5 text-slate-800 font-mono"
                    />
                    <p className="text-[10px] text-amber-700 mt-1">
                      Tip: You can upload your PDF books/guides to the <strong>Cloudinary Storage</strong> tab first, copy the secure URL, and paste it here!
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Short Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={publicationForm.description}
                      onChange={(e) => setPublicationForm({ ...publicationForm, description: e.target.value })}
                      placeholder="Short editorial summary of the journal contents, specific target boards, or included math Olympiad materials."
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-sans leading-relaxed resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingPublication(false)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#1e5894] hover:bg-blue-800 text-white font-bold px-4 py-2 rounded shadow flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingPublication ? "Update Publication" : "Publish Reference Book"}</span>
                    </button>
                  </div>
                </form>
              ) : publicationsList.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">No publications archived.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {publicationsList.map((pub) => (
                    <div key={pub.id} className="bg-slate-50 border border-slate-200 rounded p-4 flex gap-3 items-start justify-between">
                      <div className="flex gap-2.5 items-start">
                        <div className="bg-white text-[#1e5894] p-1.5 rounded border shadow-xs shrink-0">
                          <Book className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wide font-bold text-slate-400 block">{pub.type}</span>
                          <h5 className="font-serif font-bold text-xs text-slate-800 leading-snug mt-0.5">{pub.title}</h5>
                          <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{pub.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-medium">
                            <span>📅 {pub.published}</span>
                            <span>•</span>
                            <span>📦 {pub.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleEditPublicationBtn(pub)}
                          className="bg-white hover:bg-slate-100 p-1 rounded border text-slate-600"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePublication(pub.id)}
                          className="bg-white hover:bg-red-50 p-1 rounded border text-red-500 border-red-100"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 11: AUTOMATED BULK NEWSLETTER AND EMAIL CAMPAIGNS */}
          {activeSubTab === "newsletters" && (
            <div className="space-y-6" id="admin-newsletter-manager-tab">
              
              {/* Header Title Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-serif font-bold text-base text-slate-800 flex items-center gap-2">
                      <Send className="w-5 h-5 text-emerald-600" />
                      <span>Administrative Bulk Email Updates & Newsletters</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Compose professional, rich-text announcements or monthly newsletters and distribute them in bulk to your registered membership registries.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono shrink-0">
                    <span className="text-slate-400">Total Contacts Reachable:</span>
                    <span className="bg-blue-100 text-[#1e5894] font-bold px-2 py-0.5 rounded">
                      {memberships.length} Registered Members
                    </span>
                  </div>
                </div>
              </div>

              {/* Error and Success Notifications */}
              {newsletterError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg p-3.5 flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                  <span>{newsletterError}</span>
                </div>
              )}
              {newsletterSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg p-4 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                    <span>Campaign Dispatched!</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{newsletterSuccessMessage}</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* COLUMN 1: COMPOSER & DESIGN STUDIO (7 Columns) */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
                  <h5 className="font-serif font-bold text-xs text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-3 bg-emerald-500 rounded"></span>
                    <span>Campaign Composer Studio</span>
                  </h5>

                  <form onSubmit={handleSendNewsletter} className="space-y-4">
                    
                    {/* Audience Selection & Preset Template side-by-side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Target Audience selection */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                          Target Recipient Audience:
                        </label>
                        <select
                          value={newsletterTarget}
                          onChange={(e: any) => setNewsletterTarget(e.target.value)}
                          className="w-full text-xs border border-slate-200 rounded p-2 focus:ring-1 focus:ring-emerald-500 font-medium"
                        >
                          <option value="all">All Members ({memberships.length} contacts)</option>
                          <option value="approved">Approved Members Only ({memberships.filter(m => m.status === "Approved").length} contacts)</option>
                          <option value="pending">Pending Applicants Only ({memberships.filter(m => m.status === "Pending").length} contacts)</option>
                          <option value="life">Life Members Only ({memberships.filter(m => m.membershipType === "Life").length} contacts)</option>
                          <option value="general">General Members Only ({memberships.filter(m => m.membershipType === "General").length} contacts)</option>
                          <option value="custom">✍️ Direct Custom Email Address(es)</option>
                        </select>
                      </div>

                      {/* Template Selection */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex justify-between items-center">
                          <span>Preset Email Layout:</span>
                          <span className="text-[9px] text-slate-400 normal-case font-normal">Saves responsive formatting</span>
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={newsletterTemplate}
                            onChange={(e: any) => setNewsletterTemplate(e.target.value)}
                            className="flex-1 text-xs border border-slate-200 rounded p-2 focus:ring-1 focus:ring-emerald-500 font-medium"
                          >
                            {NEWSLETTER_TEMPLATES.map(t => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleApplyTemplate(newsletterTemplate)}
                            className="bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-[10px] font-bold py-1 px-2.5 rounded uppercase tracking-wider shrink-0 transition-colors"
                          >
                            Apply Layout
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Custom Email Input Area (conditionally displayed) */}
                    {newsletterTarget === "custom" && (
                      <div className="bg-emerald-50/40 border border-emerald-100 rounded-lg p-3.5 space-y-2 animate-fade-in">
                        <div className="flex justify-between items-center">
                          <label className="block text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
                            Enter Target Email Address(es):
                          </label>
                          <span className="text-[10px] text-emerald-800 font-semibold font-mono bg-emerald-100 px-2 py-0.5 rounded">
                            Multiple Allowed
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          value={newsletterCustomEmails}
                          onChange={(e) => setNewsletterCustomEmails(e.target.value)}
                          placeholder="e.g. math.expert@gmail.com, dean@college.edu.np, boardmember@cme.org.np"
                          className="w-full text-xs border border-emerald-200 rounded p-2 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-normal"
                          required={newsletterTarget === "custom"}
                        />
                        <p className="text-[10px] text-emerald-700 leading-snug">
                          💡 You can type or copy-paste multiple addresses. Separate them using commas, semicolons, spaces, or new lines.
                        </p>
                      </div>
                    )}

                    {/* Email Subject Line */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Campaign Subject Line:
                      </label>
                      <input
                        type="text"
                        value={newsletterSubject}
                        onChange={(e) => setNewsletterSubject(e.target.value)}
                        placeholder="e.g., CME Monthly Academic Journal Review & Membership Notices"
                        className="w-full text-xs border border-slate-200 rounded p-2 focus:ring-1 focus:ring-emerald-500 font-serif font-bold text-slate-800"
                        required
                      />
                    </div>

                    {/* Editor Mode Selection & Custom Rich Text Format controls */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b pb-1">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          Email HTML Body:
                        </span>
                        
                        {/* WYSIWYG vs Raw HTML tabs */}
                        <div className="flex bg-slate-100 rounded p-0.5 border text-[10px] font-bold">
                          <button
                            type="button"
                            onClick={() => setEditorMode("visual")}
                            className={`px-2.5 py-1 rounded transition-colors ${editorMode === "visual" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                          >
                            ✨ Visual Editor
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditorMode("html")}
                            className={`px-2.5 py-1 rounded transition-colors ${editorMode === "html" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                          >
                            💻 HTML Source
                          </button>
                        </div>
                      </div>

                      {/* Format Controls (for Visual Mode) */}
                      {editorMode === "visual" && (
                        <div className="bg-slate-50 border border-slate-200 rounded p-1.5 flex flex-wrap gap-1 items-center shadow-inner">
                          <button
                            type="button"
                            onClick={() => document.execCommand("bold", false)}
                            className="hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs font-bold font-serif"
                            title="Bold"
                          >
                            B
                          </button>
                          <button
                            type="button"
                            onClick={() => document.execCommand("italic", false)}
                            className="hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs italic"
                            title="Italic"
                          >
                            I
                          </button>
                          <button
                            type="button"
                            onClick={() => document.execCommand("underline", false)}
                            className="hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs underline"
                            title="Underline"
                          >
                            U
                          </button>
                          <span className="text-slate-300 mx-1">|</span>
                          <button
                            type="button"
                            onClick={() => document.execCommand("formatBlock", false, "<h2>")}
                            className="hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold"
                            title="Heading 2"
                          >
                            H2
                          </button>
                          <button
                            type="button"
                            onClick={() => document.execCommand("formatBlock", false, "<p>")}
                            className="hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px]"
                            title="Paragraph"
                          >
                            Para
                          </button>
                          <span className="text-slate-300 mx-1">|</span>
                          <button
                            type="button"
                            onClick={() => document.execCommand("insertUnorderedList", false)}
                            className="hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-xs"
                            title="Unordered List"
                          >
                            • List
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const url = prompt("Enter complete hyperlink URL (e.g., https://cme.org.np):");
                              if (url) document.execCommand("createLink", false, url);
                            }}
                            className="hover:bg-slate-200 text-[#1e5894] px-1.5 py-0.5 rounded text-[10px] font-semibold"
                            title="Insert Link"
                          >
                            🔗 Link
                          </button>
                          <button
                            type="button"
                            onClick={() => document.execCommand("removeFormat", false)}
                            className="hover:bg-slate-200 text-rose-600 px-1.5 py-0.5 rounded text-[10px] font-semibold ml-auto"
                            title="Clear Formatting"
                          >
                            Clear Format
                          </button>
                        </div>
                      )}

                      {/* Visual ContentEditable Canvas Area */}
                      {editorMode === "visual" ? (
                        <div className="relative">
                          <div
                            ref={editorRef}
                            contentEditable
                            onBlur={(e) => setNewsletterContent(e.currentTarget.innerHTML)}
                            onInput={(e) => setNewsletterContent(e.currentTarget.innerHTML)}
                            className="w-full min-h-[300px] max-h-[500px] overflow-y-auto border border-slate-200 rounded p-4 text-xs font-sans text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                            style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
                          />
                          {!newsletterContent && (
                            <span className="absolute top-4 left-4 text-xs text-slate-400 pointer-events-none">
                              Write rich text message or load a pre-designed layout from preset templates above...
                            </span>
                          )}
                        </div>
                      ) : (
                        /* Direct HTML code Area */
                        <textarea
                          value={newsletterContent}
                          onChange={(e) => setNewsletterContent(e.target.value)}
                          placeholder="<div style='font-family: Arial;'>HTML Source Code...</div>"
                          className="w-full min-h-[300px] border border-slate-200 rounded p-3 text-xs font-mono text-slate-700 bg-slate-900 text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      )}
                    </div>

                    {/* Email Live Preview Panel */}
                    {newsletterContent && (
                      <div className="border border-slate-100 rounded-lg bg-slate-50/50 p-4 space-y-2">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                          Real-time Sandbox Preview:
                        </span>
                        <div className="bg-white border rounded p-4 max-h-[300px] overflow-y-auto shadow-inner">
                          <div dangerouslySetInnerHTML={{ __html: newsletterContent }} />
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-[10px] text-slate-400 max-w-[60%] leading-snug">
                        ⚠️ Pressing dispatch will compile list members and attempt delivery. Fallback simulated execution takes place if no SMTP is declared.
                      </span>
                      <button
                        type="submit"
                        disabled={isSendingNewsletter}
                        className={`bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-2 px-5 rounded uppercase tracking-wider flex items-center gap-1.5 shadow-sm shrink-0 transition-all ${isSendingNewsletter ? "opacity-70 cursor-not-allowed animate-pulse" : ""}`}
                      >
                        {isSendingNewsletter ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Broadcasting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Dispatch Campaign</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                </div>

                {/* COLUMN 2: ARCHIVE & DISPATCH HISTORY REPORTS (5 Columns) */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
                  <h5 className="font-serif font-bold text-xs text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-3 bg-blue-500 rounded"></span>
                    <span>Transmission Archive</span>
                  </h5>

                  {newslettersList.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 space-y-3">
                      <Mail className="w-10 h-10 mx-auto opacity-30 text-slate-400" />
                      <div className="text-xs font-medium">No previous email broadcasts found.</div>
                      <p className="text-[10px] max-w-[200px] mx-auto leading-relaxed">
                        Sent campaigns log here to show statistics, target audience parameters, and sent times.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
                      {newslettersList.map((news: any) => (
                        <div
                          key={news.id}
                          className="border border-slate-100 rounded-lg p-3 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all text-xs flex flex-col justify-between gap-2.5"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider">{news.templateName}</span>
                              <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase ${news.status === "Sent" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                                {news.status}
                              </span>
                            </div>
                            <h6 className="font-serif font-bold text-slate-800 leading-snug line-clamp-2">
                              {news.subject}
                            </h6>
                          </div>

                          <div className="bg-white/80 p-2 rounded border border-slate-100 text-[10px] text-slate-500 space-y-1">
                            <div className="flex justify-between">
                              <span className="font-medium">Target Group:</span>
                              <span className="font-bold text-slate-700 capitalize">{news.targetAudience} members</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Recipients reached:</span>
                              <span className="font-mono font-bold text-slate-700">{news.recipientsCount} addresses</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Sent on:</span>
                              <span className="font-mono text-slate-700">
                                {news.sentAt ? new Date(news.sentAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "N/A"}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedNewsletter(news)}
                            className="w-full bg-white hover:bg-slate-100 border text-slate-700 font-bold py-1.5 rounded text-[10px] uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-500" />
                            <span>Inspect Dispatch Copy</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
              
              {/* HISTORICAL EMAIL PREVIEW MODAL */}
              {selectedNewsletter && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                  <div className="bg-white rounded-xl shadow-xl border w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
                    
                    {/* Modal Head */}
                    <div className="bg-[#1e5894] text-white p-4 flex justify-between items-start">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest font-mono text-blue-200">Dispatched Campaign Log</span>
                        <h4 className="font-serif font-bold text-sm leading-snug mt-0.5">{selectedNewsletter.subject}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedNewsletter(null)}
                        className="text-white hover:bg-white/10 p-1.5 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Metadata strip */}
                    <div className="bg-slate-50 border-b p-3 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">
                      <div>Status: <span className="text-emerald-700">{selectedNewsletter.status}</span></div>
                      <div>•</div>
                      <div>Target: <span className="text-slate-700 capitalize">{selectedNewsletter.targetAudience}</span></div>
                      <div>•</div>
                      <div>Recipients: <span className="text-slate-700">{selectedNewsletter.recipientsCount}</span></div>
                      <div>•</div>
                      <div>Sent: <span className="text-slate-700">{selectedNewsletter.sentAt ? new Date(selectedNewsletter.sentAt).toLocaleString() : "N/A"}</span></div>
                    </div>

                    {/* Recipient Emails block */}
                    {selectedNewsletter.recipientEmails && (
                      <div className="bg-amber-50/50 p-2.5 border-b text-[9px] text-amber-900 font-mono max-h-[60px] overflow-y-auto">
                        <span className="font-bold">Addresses Reached:</span> {selectedNewsletter.recipientEmails}
                      </div>
                    )}

                    {/* Rendered HTML inside iframe to prevent layout breaking css leak */}
                    <div className="p-4 flex-1 bg-slate-100 flex flex-col justify-stretch">
                      <iframe
                        srcDoc={selectedNewsletter.content}
                        className="w-full flex-1 border rounded bg-white"
                        title="Campaign Rendered Content"
                        sandbox="allow-same-origin"
                      />
                    </div>

                    {/* Modal Footer */}
                    <div className="p-3 bg-slate-50 border-t flex justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedNewsletter(null)}
                        className="bg-slate-700 hover:bg-slate-800 text-white text-[10px] font-bold py-1.5 px-4 rounded uppercase tracking-wider"
                      >
                        Close Inspector
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

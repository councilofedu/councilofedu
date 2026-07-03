import React, { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Users, 
  BookOpen, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  ExternalLink,
  ShieldCheck,
  MessageSquare,
  Star,
  Plus,
  FileText,
  User,
  X,
  Search
} from "lucide-react";
import { SiteSettings, BlogPost, Testimonial } from "../types";

interface HomeProps {
  setView: (view: string) => void;
}

export default function Home({ setView }: HomeProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Dynamic API states
  const [settings, setSettings] = useState<SiteSettings>({
    homeTitle: "Empowering Mathematics Educators Across Nepal",
    homeSubtitle: "Celebrating 35 years of professional leadership, pedagogical research, and modern training curriculum designed for teachers across Nepal.",
    homeNoticeBanner: "Membership open for academic year 2026/2027. Apply online to get your CME Digital Card instantly verified.",
    aboutHomeTitle: "A Legacy of Excellence in Mathematics Education",
    aboutHomeText: "Established in 1991 (2048 B.S.), the Council for Mathematics Education (CME) is Nepal's pioneer government-recognized academic society. We connect primary teachers, secondary educators, university scholars, and researchers under one unified national framework to modernize the teaching and learning of mathematics.",
    ctaButtonText: "Apply for Online Membership",
    supportEmail: "info@mathscouncil.edu.np",
    supportPhone: "+977-1-5524320 / +977-1-5544212"
  });

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  // UI States
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    designation: "",
    affiliation: "",
    message: "",
    rating: 5
  });
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch all dynamic data
  useEffect(() => {
    // 1. Fetch site settings
    fetch("/api/settings")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => {
        if (data) {
          setSettings(data);
        }
      })
      .catch(() => {});

    // 2. Fetch blogs
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch(() => {});

    // 3. Fetch testimonials
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => setTestimonials(data))
      .catch(() => {});
  }, []);

  const slides = settings.slides && settings.slides.length > 0 
    ? settings.slides 
    : [
        {
          id: "slide_1",
          title: settings.homeTitle || "Empowering Mathematics Educators Across Nepal",
          description: settings.homeSubtitle || "Celebrating 35 years of professional leadership, pedagogical research, and modern training curriculum designed for teachers across Nepal.",
          img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200",
          tag: "Academic Leadership",
          buttonColor: "#f59e0b",
          buttonTextColor: "#020617",
          buttonLink: "membership",
          buttonText: settings.ctaButtonText || "Apply for Online Membership"
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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  // Testimonial submission
  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

    if (!newTestimonial.name || !newTestimonial.message || !newTestimonial.designation) {
      setSubmitError("Please fill in all required fields (Name, Designation, Message).");
      return;
    }

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTestimonial,
          status: "Pending" // Require admin approval
        })
      });

      if (!response.ok) {
        throw new Error("Failed to submit testimonial");
      }

      setSubmitSuccess(true);
      setNewTestimonial({
        name: "",
        designation: "",
        affiliation: "",
        message: "",
        rating: 5
      });
      setTimeout(() => {
        setShowTestimonialModal(false);
        setSubmitSuccess(false);
      }, 3000);
    } catch (err) {
      setSubmitError("Failed to submit. Please try again.");
    }
  };

  return (
    <div className="w-full">
      {/* Dynamic Academic Slide Show */}
      <div className="relative w-full h-[360px] md:h-[420px] overflow-hidden bg-slate-900" id="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Dark overlay for rich contrast and readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-transparent z-10" />
            <img
              src={slide.img}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            
             {/* Slide Text Content */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="w-full px-6 md:px-8">
                <div className="max-w-xl text-left">
                  <span className="inline-block bg-amber-500 text-slate-950 font-semibold text-[10px] tracking-widest uppercase px-2 py-0.5 rounded mb-3">
                    {slide.tag || "Academic Leadership"}
                  </span>
                  <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-serif font-bold leading-tight tracking-tight">
                    {slide.title}
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm mt-3 font-normal leading-relaxed">
                    {slide.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-6">
                    <button
                      onClick={() => {
                        const link = slide.buttonLink || "membership";
                        if (link.startsWith("http://") || link.startsWith("https://") || link.startsWith("www.")) {
                          window.open(link, "_blank", "noopener,noreferrer");
                        } else {
                          setView(link as any);
                        }
                      }}
                      style={{
                        backgroundColor: slide.buttonColor || "#f59e0b",
                        color: slide.buttonTextColor || "#020617"
                      }}
                      className="text-xs font-bold px-4 py-2 rounded shadow hover:brightness-110 hover:shadow-md transition-all flex items-center gap-1.5"
                      id="hero-cta-btn"
                    >
                      <span>{slide.buttonText || settings.ctaButtonText || "Apply for Membership"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setView("about")}
                      className="bg-transparent text-white border border-slate-400 hover:border-white hover:bg-white/10 text-xs font-semibold px-4 py-2 rounded transition-all"
                    >
                      Read History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Controls */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/60 text-white p-1.5 rounded-full transition-all"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/60 text-white p-1.5 rounded-full transition-all"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicator dots */}
        <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === activeSlide ? "bg-amber-500 w-6" : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>



      {/* Content Layout */}
      <div className="w-full px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Intro, History, Objectives */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Configurable About us section directly on home page */}
          <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm" id="about-intro-section">
            <div className="text-sm uppercase font-bold text-amber-600 tracking-wider mb-2">
              About Us
            </div>
            <div className="flex items-center gap-2.5 mb-4">
              <ShieldCheck className="w-5 h-5 text-[#1e5894] shrink-0" />
              <h3 className="text-xl font-bold text-[#1e5894] font-serif tracking-tight">
                {settings.aboutHomeTitle || "About Us - Council for Mathematics Education"}
              </h3>
            </div>
            
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 whitespace-pre-line">
              {settings.aboutHomeText}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
                <span className="font-bold text-slate-800 text-xs block mb-1">Our Mission</span>
                <span className="text-slate-600 text-xs leading-relaxed">
                  To eliminate the deep fear of mathematics from young learners by training educators in visual models, logic puzzles, and active teacher-student cooperation.
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
                <span className="font-bold text-slate-800 text-xs block mb-1">Our Vision</span>
                <span className="text-slate-600 text-xs leading-relaxed">
                  A nationwide community of passionate math professionals sharing innovative syllabus solutions, teaching journals, and international methodologies.
                </span>
              </div>
            </div>
          </section>

          {/* Dynamic Blogs & News Section */}
          <section className="space-y-4" id="blogs-news-section">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="text-lg font-bold text-[#1e5894] font-serif flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Blogs, Research & News Updates</span>
              </h3>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {blogs.length} Articles
              </span>
            </div>

            {blogs.length === 0 ? (
              <div className="bg-white p-6 rounded-lg border border-slate-100 text-center text-slate-500 text-xs">
                No articles published yet. Stay tuned for mathematical research updates.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blogs.map((blog) => (
                  <div 
                    key={blog.id} 
                    className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    {blog.imageUrl && (
                      <div className="h-40 overflow-hidden bg-slate-100">
                        <img 
                          src={blog.imageUrl} 
                          alt={blog.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-semibold text-amber-600 uppercase mb-1.5">
                          <span>{blog.category}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm font-serif line-clamp-2 hover:text-[#1e5894] transition-colors">
                          {blog.title}
                        </h4>
                        <p className="text-slate-500 text-xs mt-2 line-clamp-3 leading-relaxed">
                          {blog.excerpt}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-[11px] text-slate-400 font-medium truncate max-w-[120px]">
                          By {blog.author}
                        </span>
                        <button 
                          onClick={() => setSelectedBlog(blog)}
                          className="text-xs font-bold text-[#1e5894] hover:text-amber-500 transition-colors flex items-center gap-1 shrink-0"
                        >
                          Read Article <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Testimonial Section */}
          <section className="bg-slate-100/60 border border-slate-200 rounded-lg p-6 space-y-4" id="testimonials-section">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[#1e5894] font-serif">
                  Testimonials from Educators
                </h3>
                <p className="text-xs text-slate-500">Feedback from school principals and trained math teachers across Nepal.</p>
              </div>
              <button 
                onClick={() => setShowTestimonialModal(true)}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[11px] font-semibold py-1.5 px-3 rounded flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-amber-500" />
                <span>Add Yours</span>
              </button>
            </div>

            {testimonials.length === 0 ? (
              <p className="text-slate-500 text-xs italic text-center py-4">No approved testimonials listed yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((test) => (
                  <div key={test.id} className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < test.rating ? "fill-amber-400" : "text-slate-200"}`} 
                          />
                        ))}
                      </div>
                      <p className="text-slate-600 text-xs italic leading-relaxed">
                        "{test.message}"
                      </p>
                    </div>
                    <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs uppercase">
                        {test.name[0]}
                      </div>
                      <div className="truncate">
                        <h5 className="font-bold text-slate-800 text-[11px] leading-tight">{test.name}</h5>
                        <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
                          {test.designation}, {test.affiliation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Core Objectives (Human Craft) */}
          <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-[#1e5894] font-serif mb-4 pb-2 border-b border-slate-100">
              Key Objectives of the Council
            </h3>
            
            <ul className="space-y-3.5">
              <li className="flex gap-3 text-xs sm:text-sm text-slate-600">
                <span className="text-amber-500 font-bold text-sm leading-none">01.</span>
                <div>
                  <strong>Syllabus Support & Upgrades:</strong> To cooperate with the Curriculum Development Centre (CDC) of Nepal and educational boards to suggest and test updated practical curriculums.
                </div>
              </li>
              <li className="flex gap-3 text-xs sm:text-sm text-slate-600">
                <span className="text-amber-500 font-bold text-sm leading-none">02.</span>
                <div>
                  <strong>Teacher Empowerment:</strong> To design, manage, and deliver intensive teacher training courses, visual math lab setups, and interactive digital teaching tool seminars.
                </div>
              </li>
              <li className="flex gap-3 text-xs sm:text-sm text-slate-600">
                <span className="text-amber-500 font-bold text-sm leading-none">03.</span>
                <div>
                  <strong>Research and Academic Publication:</strong> To publish research journals like <em>"The Mathematics Education Journal"</em>, monthly bulletin newsletters, and practical mathematical reference books.
                </div>
              </li>
              <li className="flex gap-3 text-xs sm:text-sm text-slate-600">
                <span className="text-amber-500 font-bold text-sm leading-none">04.</span>
                <div>
                  <strong>Math Camps & Student Olympiads:</strong> To organize regional and national mathematics camps, Olympiads, and puzzle contests to trigger logical curiosity in school students.
                </div>
              </li>
            </ul>
          </section>
        </div>

        {/* Right 1 Column: Events, Information, Publications */}
        <div className="space-y-6">
          
          {/* Quick Stats Block */}
          <div className="bg-[#1e5894] text-white p-5 rounded-lg shadow-sm">
            <h4 className="font-serif font-bold text-base border-b border-blue-400 pb-2 mb-3">
              Council at a Glance
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-blue-400/30 pb-1.5">
                <span className="text-xs text-blue-100">Establishment Year</span>
                <span className="font-bold text-sm">1991 A.D. (2048 B.S.)</span>
              </div>
              <div className="flex justify-between items-center border-b border-blue-400/30 pb-1.5">
                <span className="text-xs text-blue-100">Registered Districts</span>
                <span className="font-bold text-sm">Lalitpur, Nepal</span>
              </div>
              <div className="flex justify-between items-center border-b border-blue-400/30 pb-1.5">
                <span className="text-xs text-blue-100">National Executive Committee</span>
                <span className="font-bold text-sm">15 Officers</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-100">Registered Educators</span>
                <span className="font-bold text-sm">Over 1,200+ Members</span>
              </div>
            </div>
            
            <button 
              onClick={() => setView("membership")}
              className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs py-2 rounded transition-colors text-center"
            >
              {settings.ctaButtonText || "Apply Online Registration"}
            </button>
          </div>

          {/* Upcoming Seminars/Trainings */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <h4 className="font-serif font-bold text-base text-slate-800 pb-2 mb-3 border-b border-slate-100 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Events & Trainings</span>
            </h4>
            
            <div className="space-y-4">
              <div className="border-l-3 border-[#1e5894] pl-3">
                <span className="text-[10px] uppercase font-bold text-amber-600 block">Oct 12-18, 2026</span>
                <h5 className="font-bold text-slate-800 text-xs mt-0.5">7-Day Primary Level Visual Mathematics Lab Setup Course</h5>
                <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> CME Hall, Lalitpur
                </span>
              </div>

              <div className="border-l-3 border-[#1e5894] pl-3">
                <span className="text-[10px] uppercase font-bold text-amber-600 block">Nov 04, 2026</span>
                <h5 className="font-bold text-slate-800 text-xs mt-0.5">Interactive Syllabus Workshop with TU Department of Education</h5>
                <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> Tribhuvan University, Kirtipur
                </span>
              </div>

              <div className="border-l-3 border-[#1e5894] pl-3">
                <span className="text-[10px] uppercase font-bold text-amber-600 block">Dec 15-20, 2026</span>
                <h5 className="font-bold text-slate-800 text-xs mt-0.5">35th Annual General Meeting & Research Journal Release</h5>
                <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> Staff College, Lalitpur
                </span>
              </div>
            </div>
          </div>

          {/* Contact Support details */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3.5">
            <h4 className="font-serif font-bold text-base text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#1e5894]" />
              <span>Direct Support Helpdesk</span>
            </h4>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                For dynamic inquiry regarding life membership certificates, syllabus modifications, or regional training camps:
              </p>
              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                <p><strong>Email:</strong> {settings.supportEmail || "info@mathscouncil.edu.np"}</p>
                <p><strong>Phone:</strong> {settings.supportPhone || "+977-1-5524320"}</p>
              </div>
            </div>
          </div>

          {/* Global Search Promo Card */}
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-lg shadow-sm space-y-3">
            <h4 className="font-serif font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <span className="p-1 bg-amber-500 rounded text-slate-950">
                <Search className="w-3.5 h-3.5" />
              </span>
              <span>Locate CME Documents</span>
            </h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Use our unified global search to find academic journals, visual curriculum training schemes, or verify your CME membership status.
            </p>
            <button
              onClick={() => setView("search")}
              className="w-full bg-[#1e5894] hover:bg-blue-800 text-white font-bold text-xs py-2 rounded transition-colors text-center uppercase tracking-wider"
            >
              Open Unified Search
            </button>
          </div>

          {/* Quick Downloads */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
            <h4 className="font-serif font-bold text-base text-slate-800 pb-2 mb-3 border-b border-slate-100 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#1e5894]" />
              <span>Resources & Downloads</span>
            </h4>
            <div className="space-y-2.5">
              <a href="#" onClick={(e) => { e.preventDefault(); setView("publications"); }} className="group flex items-center justify-between text-xs text-slate-600 hover:text-[#1e5894] transition-colors pb-1.5 border-b border-slate-100">
                <span>The Mathematics Education Journal v34</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1e5894]" />
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); setView("membership"); }} className="group flex items-center justify-between text-xs text-slate-600 hover:text-[#1e5894] transition-colors pb-1.5 border-b border-slate-100">
                <span>Printable Offline Membership Form (PDF)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1e5894]" />
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); setView("programs"); }} className="group flex items-center justify-between text-xs text-slate-600 hover:text-[#1e5894] transition-colors">
                <span>Teacher Mentoring Manual (CME Guide)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1e5894]" />
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL 1: Read full Blog Article */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-xs" id="blog-reader-modal">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-slate-200 flex flex-col justify-between">
            {/* Modal Header banner */}
            <div className="relative h-48 bg-slate-100">
              {selectedBlog.imageUrl ? (
                <img src={selectedBlog.imageUrl} alt={selectedBlog.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#1e5894]/10 flex items-center justify-center">
                  <FileText className="w-12 h-12 text-[#1e5894]/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-amber-500 text-slate-950 text-[9px] uppercase font-bold px-2 py-0.5 rounded">
                  {selectedBlog.category}
                </span>
                <h3 className="text-white text-lg md:text-xl font-serif font-bold mt-1.5 line-clamp-2">
                  {selectedBlog.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 bg-slate-950/40 text-white hover:bg-slate-950/80 p-1.5 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto text-xs sm:text-sm text-slate-700 space-y-4">
              <div className="flex justify-between items-center text-[11px] text-slate-400 border-b border-slate-100 pb-3">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" /> Writer: <strong>{selectedBlog.author}</strong>
                </span>
              </div>

              <p className="text-slate-800 font-medium border-l-4 border-amber-500 pl-3 py-1 bg-amber-50/50 leading-relaxed rounded-r italic">
                {selectedBlog.excerpt}
              </p>

              <div className="leading-relaxed whitespace-pre-wrap text-slate-600">
                {selectedBlog.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedBlog(null)}
                className="bg-[#1e5894] hover:bg-[#1a4e84] text-white text-xs font-semibold py-1.5 px-4 rounded transition-colors"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Create / Write a Testimonial */}
      {showTestimonialModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs" id="testimonial-form-modal">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200">
            <div className="bg-[#162e4c] text-white p-4 rounded-t-xl flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-sm tracking-wide">Write Educator Review</h3>
                <p className="text-[10px] text-slate-300">Submit your feedback regarding our training schemes.</p>
              </div>
              <button 
                onClick={() => setShowTestimonialModal(false)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTestimonialSubmit} className="p-5 space-y-3">
              {submitError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 rounded text-xs">
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="p-2.5 bg-green-50 border border-green-200 text-green-600 rounded text-xs font-semibold">
                  ✓ Submitted! It will appear on the homepage once verified by CME administrators.
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase block">Full Name *</label>
                  <input 
                    type="text" 
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                    placeholder="e.g. Shyam Prasad"
                    className="w-full text-xs p-2 border border-slate-300 rounded focus:border-[#1e5894] outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase block">Designation *</label>
                  <input 
                    type="text" 
                    value={newTestimonial.designation}
                    onChange={(e) => setNewTestimonial({...newTestimonial, designation: e.target.value})}
                    placeholder="e.g. Secondary Math Teacher"
                    className="w-full text-xs p-2 border border-slate-300 rounded focus:border-[#1e5894] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase block">School / Affiliation</label>
                <input 
                  type="text" 
                  value={newTestimonial.affiliation}
                  onChange={(e) => setNewTestimonial({...newTestimonial, affiliation: e.target.value})}
                  placeholder="e.g. Lalitpur Secondary School, Nepal"
                  className="w-full text-xs p-2 border border-slate-300 rounded focus:border-[#1e5894] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase block">Rating Star *</label>
                <select 
                  value={newTestimonial.rating}
                  onChange={(e) => setNewTestimonial({...newTestimonial, rating: Number(e.target.value)})}
                  className="w-full text-xs p-2 border border-slate-300 rounded focus:border-[#1e5894] outline-none bg-white"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (Excellent / Highly Recommended)</option>
                  <option value={4}>⭐⭐⭐⭐ (Very Good)</option>
                  <option value={3}>⭐⭐⭐ (Satisfactory)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase block">Your Feedback Message *</label>
                <textarea 
                  rows={3}
                  value={newTestimonial.message}
                  onChange={(e) => setNewTestimonial({...newTestimonial, message: e.target.value})}
                  placeholder="Share how CME has impacted your math pedagogy or how the life membership scheme was helpful."
                  className="w-full text-xs p-2 border border-slate-300 rounded focus:border-[#1e5894] outline-none resize-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTestimonialModal(false)}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-xs font-semibold rounded text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-1.5 px-4 rounded"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

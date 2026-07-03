import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  BookOpen, Search, Clock, Eye, Calendar, User, ArrowLeft, 
  Share2, Facebook, Twitter, Linkedin, Check, AlertCircle, Sparkles, TrendingUp
} from "lucide-react";
import { getFirebaseClient } from "../lib/firebaseClient";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  status: string;
  date: string;
  imageUrl: string;
  watchCount?: number;
}

interface BlogsProps {
  setView: (view: string) => void;
  selectedPostId: string | null;
  setSelectedPostId: (id: string | null) => void;
}

export default function Blogs({ setView, selectedPostId, setSelectedPostId }: BlogsProps) {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [sidebarSearch, setSidebarSearch] = useState<string>("");
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [submittingNewsletter, setSubmittingNewsletter] = useState<boolean>(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState<string>("");
  const [newsletterError, setNewsletterError] = useState<string>("");
  


  // Fetch all published blogs
  useEffect(() => {
    if (!selectedPostId) {
      fetchBlogs();
    }
  }, [selectedPostId]);

  // Fetch individual blog when selected
  useEffect(() => {
    if (selectedPostId) {
      fetchSinglePost(selectedPostId);
    } else {
      setActivePost(null);
    }
  }, [selectedPostId]);



  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/blogs");
      if (!res.ok) {
        throw new Error("Failed to fetch blog list");
      }
      const data = await res.json();
      setBlogs(data);
    } catch (err: any) {
      console.error("Error fetching blogs:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchSinglePost = async (id: string) => {
    setPostLoading(true);
    setError(null);
    try {
      // 1. Fetch single post details
      const res = await fetch(`/api/blogs/${id}`);
      if (!res.ok) {
        throw new Error("Failed to load blog post or it does not exist.");
      }
      const data = await res.json();
      setActivePost(data);

      // 2. Increment watch count in background (non-blocking) and update local count
      incrementPostView(id);
    } catch (err: any) {
      console.error("Error fetching single post:", err);
      setError(err.message || "Could not retrieve the specified article");
    } finally {
      setPostLoading(false);
    }
  };

  const incrementPostView = async (id: string) => {
    try {
      const res = await fetch(`/api/blogs/${id}/view`, { method: "POST" });
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.watchCount !== undefined) {
          setActivePost(prev => prev && prev.id === id ? { ...prev, watchCount: result.watchCount } : prev);
        }
      }
    } catch (err) {
      console.error("Failed to register view counter:", err);
    }
  };

  const handleShare = (platform: "facebook" | "twitter" | "linkedin" | "copy") => {
    if (!activePost) return;
    const shareUrl = `${window.location.origin}/blog/${activePost.id}`;
    const shareText = encodeURIComponent(`${activePost.title} - Council for Mathematics Education`);

    if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`, "_blank");
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
    } else if (platform === "copy") {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSidebarSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sidebarSearch.trim()) {
      setSearchQuery(sidebarSearch.trim());
      setSelectedPostId(null);
      window.history.pushState(null, "", "/blogs");
    }
  };

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError("");
    setNewsletterSuccess("");
    setSubmittingNewsletter(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe to newsletter.");
      }
      setNewsletterSuccess("Thank you! Successfully subscribed to our newsletter.");
      setNewsletterEmail("");
    } catch (err: any) {
      setNewsletterError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmittingNewsletter(false);
    }
  };

  // Filter logic
  const categories = ["All", "Pedagogy", "Research", "Announcements", "Events"];
  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          blog.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (selectedPostId && (postLoading || activePost)) {
    if (postLoading) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#1e5894] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-500 font-medium text-sm animate-pulse">Establishing secure data link to CME publications database...</p>
          </div>
        </div>
      );
    }

    if (activePost) {
      // Find recommended posts (up to 4 other posts, excluding the current one)
      const recommendedPosts = blogs.filter(b => b.id !== activePost.id).slice(0, 4);

      return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
          <div className="w-full max-w-none">
            {/* Back to blogs button */}
            <button
              onClick={() => {
                setSelectedPostId(null);
                window.history.pushState(null, "", "/blogs");
              }}
              className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#1e5894] transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Blogs & News</span>
            </button>

            {/* Grid layout side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - Article content */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Breadcrumbs */}
                <nav className="text-xs text-slate-500 font-medium">
                  <span className="hover:underline cursor-pointer" onClick={() => setView("home")}>Home</span>
                  <span className="mx-2">/</span>
                  <span className="hover:underline cursor-pointer" onClick={() => {
                    setSelectedPostId(null);
                    window.history.pushState(null, "", "/blogs");
                  }}>Blog</span>
                  <span className="mx-2">/</span>
                  <span className="text-slate-700 truncate max-w-xs inline-block align-bottom font-semibold">{activePost.title}</span>
                </nav>

                {/* Article Header */}
                <header className="space-y-4">
                  <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight text-slate-900 leading-tight">
                    {activePost.title}
                  </h1>
                  {/* No Meta Details row to prevent fake data displaying */}
                </header>

                {/* Social Share Controls */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Share this post:</span>
                    <span className="h-4 w-px bg-slate-200 hidden sm:inline-block"></span>
                    <span className="flex items-center gap-1.5 text-xs text-[#1e5894] font-bold uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-lg">
                      <Eye className="w-3.5 h-3.5 text-[#1e5894]" />
                      <span>{activePost.watchCount || 0} views</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleShare("facebook")}
                      className="p-2.5 bg-[#1877f2]/10 text-[#1877f2] hover:bg-[#1877f2] hover:text-white rounded-xl transition-colors cursor-pointer"
                      title="Share on Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare("twitter")}
                      className="p-2.5 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-xl text-slate-700 transition-colors cursor-pointer"
                      title="Share on X / Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="p-2.5 bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5] hover:text-white rounded-xl transition-colors cursor-pointer"
                      title="Share on LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare("copy")}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                      title="Copy direct share link"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                  <img 
                    src={activePost.imageUrl || "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1200"} 
                    alt={activePost.title} 
                    className="w-full h-auto max-h-[500px] object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>



                {/* Body Content */}
                <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed space-y-6 text-base whitespace-pre-wrap font-serif bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/60 shadow-sm">
                  {activePost.content}
                </div>


              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                
                {/* Search Card */}
                <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Search</h4>
                  <form onSubmit={handleSidebarSearchSubmit} className="relative flex items-center">
                    <input 
                      type="text" 
                      placeholder="Search blogs..." 
                      value={sidebarSearch}
                      onChange={(e) => setSidebarSearch(e.target.value)}
                      className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1e5894] focus:bg-white transition-all pr-10 font-medium text-slate-700"
                    />
                    <button type="submit" className="absolute right-3 text-slate-400 hover:text-[#1e5894] transition-colors cursor-pointer">
                      <Search className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                {/* Newsletter Card */}
                <div className="relative bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden p-5 pt-7 space-y-4">
                  {/* Top Gradient Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
                  
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-sans">Newsletter</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-2">
                      Get the latest academic findings, geometry tools, and training updates straight to your inbox.
                    </p>
                  </div>

                  <form onSubmit={handleNewsletterSubscribe} className="space-y-3">
                    <div>
                      <input 
                        type="email" 
                        placeholder="Your email address" 
                        required
                        value={newsletterEmail}
                        onChange={(e) => {
                          setNewsletterEmail(e.target.value);
                          setNewsletterError("");
                          setNewsletterSuccess("");
                        }}
                        className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1e5894] focus:bg-white transition-all font-medium text-slate-700"
                      />
                    </div>
                    
                    {newsletterError && (
                      <p className="text-[11px] text-red-600 font-semibold">{newsletterError}</p>
                    )}
                    {newsletterSuccess && (
                      <p className="text-[11px] text-emerald-600 font-semibold">{newsletterSuccess}</p>
                    )}

                    <button 
                      type="submit" 
                      disabled={submittingNewsletter}
                      className="w-full py-3 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {submittingNewsletter ? "Subscribing..." : "Subscribe"}
                    </button>
                  </form>
                </div>

                {/* Recent / Recommended Posts Card */}
                <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Posts</h4>
                  
                  {recommendedPosts.length === 0 ? (
                    <p className="text-xs text-slate-400">No other articles available.</p>
                  ) : (
                    <div className="space-y-4">
                      {recommendedPosts.map((post) => (
                        <div 
                          key={post.id} 
                          onClick={() => {
                            setSelectedPostId(post.id);
                            window.history.pushState(null, "", `/blog/${post.id}`);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="flex gap-3 group cursor-pointer border-b border-slate-50 pb-3 last:border-0 last:pb-0"
                        >
                          {/* Thumbnail */}
                          <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                            <img 
                              src={post.imageUrl || "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=120"} 
                              alt={post.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          
                          {/* Info */}
                          <div className="min-w-0 flex flex-col justify-center space-y-0.5">
                            <span className="text-[9px] font-extrabold text-blue-600 uppercase tracking-wider font-mono">
                              {post.category}
                            </span>
                            <h5 className="text-xs font-serif font-bold text-slate-800 leading-snug group-hover:text-[#1e5894] transition-colors line-clamp-2">
                              {post.title}
                            </h5>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-none px-4 md:px-8 space-y-8">
        
        {/* Header Title Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#1e5894] rounded-full text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Media Central</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-slate-900 tracking-tight">
            Blogs & Educational News
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stay updated with curriculum revisions, scientific math research papers, pedagogical insights, and national workshops hosted by Nepal's pioneer Council.
          </p>
        </div>

        {/* Filter and Search Bar controls */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? "bg-[#1e5894] text-white shadow-xs" 
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input Field */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles & guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/50 focus:bg-white text-xs font-medium border border-slate-200 focus:border-[#1e5894] rounded-xl outline-hidden transition-all text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Loading and Error states */}
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-[#1e5894] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">Loading Academic Directory...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto space-y-2">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <h3 className="text-sm font-bold text-red-950">Failed to Retrieve Blogs</h3>
            <p className="text-xs text-red-700 leading-relaxed">{error}</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center max-w-md mx-auto space-y-3 shadow-xs">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-full w-fit mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Articles Match Your Search</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't find any published blog posts or news items matching "{searchQuery}" under the category "{selectedCategory}".
            </p>
          </div>
        ) : (
          /* Grid list of blogs */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog, idx) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden flex flex-col hover:shadow-md hover:border-slate-300 transition-all group"
              >
                {/* Banner Thumbnail */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={blog.imageUrl || "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3.5 left-3.5 px-2.5 py-1 bg-[#1e5894]/90 backdrop-blur-xs text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                    {blog.category}
                  </span>
                </div>

                {/* Article body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                      <div className="flex items-center gap-1 text-[#1e5894]">
                        <Eye className="w-3.5 h-3.5 text-[#1e5894]" />
                        <span>{blog.watchCount || 0} views</span>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-[9px] font-bold uppercase tracking-wider">{blog.category}</span>
                    </div>

                    <h3 className="text-base font-serif font-extrabold text-slate-900 group-hover:text-[#1e5894] transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                  </div>

                  {/* Read controls */}
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center shrink-0">
                    <span className="text-[11px] text-slate-500 font-medium italic">By {blog.author}</span>
                    
                    <button
                      onClick={() => {
                        setSelectedPostId(blog.id);
                        window.history.pushState(null, "", `/blog/${blog.id}`);
                      }}
                      className="px-3.5 py-1.5 bg-blue-50 text-[#1e5894] hover:bg-[#1e5894] hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>Read Article</span>
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Copy, Download, Trash2, Moon, Sun, Share2, Github, Twitter, Linkedin } from "lucide-react";
import { Menu, X } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [briefSummary, setBriefSummary] = useState("");
  const [bulletSummary, setBulletSummary] = useState<string[]>([]);
  const [urdu, setUrdu] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  type i = "brief" | "detailed" | "urdu" | "all";
  const [summaryType, setSummaryType] = useState<i>("brief");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSummarise = async () => {
    setLoading(true);
    setSummary("");
    setUrdu("");
    setBriefSummary("");
    setBulletSummary([]);

    try {
      const res = await fetch("/api/summarise", {
        method: "POST",
        body: JSON.stringify({ url }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.summary && data.urdu) {
        setSummary(data.summary);
        setUrdu(data.urdu);
        setBriefSummary(data.brief || "");
        setBulletSummary(data.bullets || []);
      } else {
        alert("Something went wrong.");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Failed to summarise blog.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => alert("Copied to clipboard!"))
      .catch(() => alert("❌ Copy failed."));
  };

  const downloadAsText = () => {
    const blob = new Blob([`Summary:\n${summary}\n\nUrdu:\n${urdu}`], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "summary.txt";
    link.click();
  };

  const clearResults = () => {
    setSummary("");
    setUrdu("");
    setUrl("");
    setBriefSummary("");
    setBulletSummary([]);
  };

  const toggleTheme = () => setDark(!dark);

  const share = () => {
    const text = `Check out this blog summary!\n\nSummary:\n${summary}\n\nUrdu:\n${urdu}`;
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
  };



return (
    <main className={`${dark ? "dark" : ""} min-h-screen flex flex-col transition-colors duration-300`}>
      {/* Enhanced Gradient Background - Works for both modes */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className={`absolute inset-0 ${
          dark 
            ? "bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-800" 
            : "bg-gradient-to-br from-blue-50 via-purple-50 to-gray-100"
        }`}>
          {/* Subtle texture for both modes */}
          <div className={`absolute inset-0 ${
            dark 
              ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-gray-900/30 to-gray-900/50" 
              : "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-purple-50/30 to-blue-50/50"
          }`}></div>
        </div>
      </div>

      {/* Header - Fixed for mobile */}
      <header className={`sticky top-0 z-50 py-3 ${dark ? "bg-gray-900/80 border-b border-gray-800" : "bg-white/80 border-b border-gray-200"} backdrop-blur-lg`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1.5 sm:p-2 rounded-lg shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Summarizer</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className={`${dark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"} transition-colors`}>Home</a>
            <a href="#" className={`${dark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"} transition-colors`}>Features</a>
            <a href="#" className={`${dark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"} transition-colors`}>About</a>
            <button 
              onClick={toggleTheme} 
              className={`p-2 rounded-full ${dark ? "bg-purple-900/50 text-yellow-300" : "bg-gray-200 text-gray-700"} hover:opacity-80 transition-all`}
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={`h-6 w-6 ${dark ? "text-gray-300" : "text-gray-700"}`} />
            ) : (
              <Menu className={`h-6 w-6 ${dark ? "text-gray-300" : "text-gray-700"}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden ${dark ? "bg-gray-800/95" : "bg-white/95"} backdrop-blur-lg`}>
            <div className="px-4 py-3 space-y-4">
              <a href="#" className={`block py-2 ${dark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}>Home</a>
              <a href="#" className={`block py-2 ${dark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}>Features</a>
              <a href="#" className={`block py-2 ${dark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}>About</a>
              <button 
                onClick={toggleTheme} 
                className={`w-full flex items-center justify-between py-2 ${dark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}
              >
                <span>Toggle Theme</span>
                {dark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main content - Adjusted padding for mobile */}
      <div className="flex-grow max-w-4xl mx-auto p-4 sm:p-6 space-y-6 w-full">
        {/* Input section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              className={`flex-1 p-3 sm:p-4 rounded-xl border-0 shadow-lg ${
                dark 
                  ? "bg-gray-800/70 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500" 
                  : "bg-white/90 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
              } transition-all duration-300`}
              placeholder="Enter blog URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              onClick={handleSummarise}
              disabled={loading || !url}
              className={`px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-medium shadow-lg flex items-center justify-center ${
                loading || !url 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              } text-white transition-all duration-300`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : "Summarize"}
            </button>
          </div>

          {/* Summary type selector - Adjusted for mobile */}
          <div className="flex flex-wrap gap-2">
            {["brief", "detailed", "urdu", "all"].map((type) => (
              <button
                key={type}
                onClick={() => setSummaryType(type as i)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  summaryType === type
                    ? dark
                      ? "bg-purple-600 text-white"
                      : "bg-blue-600 text-white"
                    : dark
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </section>

       {/* Action buttons - Adjusted for mobile */}
{(summary || urdu) && (
  <div className="flex flex-wrap gap-2 sm:gap-3">
    {/* Download Button */}
    <button 
      onClick={downloadAsText} 
      className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg ${
        dark ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-white hover:bg-gray-100 text-gray-800"
      } shadow transition-all text-xs sm:text-sm`}
    >
      <Download size={14} /> Download
    </button>

    {/* Copy Summary Button */}
    <button 
      onClick={() => copyToClipboard(summary)} 
      className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg ${
        dark ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-white hover:bg-gray-100 text-gray-800"
      } shadow transition-all text-xs sm:text-sm`}
    >
      <Copy size={14} /> Copy Summary
    </button>

    {/* Copy Urdu Button */}
    <button 
      onClick={() => copyToClipboard(urdu)} 
      className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg ${
        dark ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-white hover:bg-gray-100 text-gray-800"
      } shadow transition-all text-xs sm:text-sm`}
    >
      <Copy size={14} /> Copy Urdu
    </button>

    {/* Share Button */}
    <button 
      onClick={share} 
      className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg ${
        dark ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-white hover:bg-gray-100 text-gray-800"
      } shadow transition-all text-xs sm:text-sm`}
    >
      <Share2 size={14} /> Share
    </button>

    {/* Clear Button */}
    <button 
      onClick={clearResults} 
      className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg ${
        dark ? "bg-red-900/50 hover:bg-red-900 text-white" : "bg-red-100 hover:bg-red-200 text-red-800"
      } shadow transition-all text-xs sm:text-sm`}
    >
      <Trash2 size={14} /> Clear
    </button>
  </div>
)}


        {/* Summary content - Mobile responsive */}
<div className="space-y-4 sm:space-y-6">
  {/* Brief Summary */}
  {(summaryType === "brief" || summaryType === "all") && briefSummary && (
    <div className={`p-4 sm:p-6 rounded-2xl shadow-xl backdrop-blur-sm ${
      dark ? "bg-gray-800/70 border-gray-700" : "bg-white/90 border-gray-200"
    } border transition-all duration-300`}>
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
        Brief Summary
      </h2>
      <p className={`text-sm sm:text-base ${dark ? "text-gray-300" : "text-gray-700"}`}>
        {briefSummary}
      </p>
    </div>
  )}

  {/* Detailed Summary (Bullets) */}
  {(summaryType === "detailed" || summaryType === "all") && bulletSummary.length > 0 && (
    <div className={`p-4 sm:p-6 rounded-2xl shadow-xl backdrop-blur-sm ${
      dark ? "bg-gray-800/70 border-gray-700" : "bg-white/90 border-gray-200"
    } border transition-all duration-300`}>
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
        Detailed Summary
      </h2>
      <ul className="space-y-3 text-sm sm:text-base">
        {bulletSummary.map((point, index) => (
          <li key={index} className="flex items-start">
            <span className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-1 ${
              dark ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-800"
            }`}>
              {index + 1}
            </span>
            <span className={`${dark ? "text-gray-300" : "text-gray-700"}`}>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  )}

  {/* Full Summary */}
  {(summaryType === "detailed" || summaryType === "all") && summary && (
    <div className={`p-4 sm:p-6 rounded-2xl shadow-xl backdrop-blur-sm ${
      dark ? "bg-gray-800/70 border-gray-700" : "bg-white/90 border-gray-200"
    } border transition-all duration-300`}>
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
        Full Summary
      </h2>
      <p className={`text-sm sm:text-base ${dark ? "text-gray-300" : "text-gray-700"}`}>
        {summary}
      </p>
    </div>
  )}

  {/* Urdu Translation */}
  {(summaryType === "urdu" || summaryType === "all") && urdu && (
    <div className={`p-4 sm:p-6 rounded-2xl shadow-xl backdrop-blur-sm ${
      dark ? "bg-gray-800/70 border-gray-700" : "bg-white/90 border-gray-200"
    } border transition-all duration-300`}>
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
        اردو ترجمہ
      </h2>
      <p className={`text-sm sm:text-base text-right ${dark ? "text-gray-300" : "text-gray-700"}`}>
        {urdu}
      </p>
    </div>
  )}
</div>

          {/* Other summary sections with similar mobile adjustments */}
        </div>
      

      {/* Footer - Fixed for mobile */}
      <footer className={`sticky bottom-0 z-50 py-3 ${dark ? "bg-gray-900/80 border-t border-gray-800" : "bg-white/80 border-t border-gray-200"} backdrop-blur-lg`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-2 md:mb-0">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <span className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>
                AI Summarizer
              </span>
            </div>
            <div className="flex space-x-3">
              <a href="#" className={`${dark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors`}>
                <Github size={16} />
              </a>
              <a href="#" className={`${dark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors`}>
                <Twitter size={16} />
              </a>
              <a href="#" className={`${dark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors`}>
                <Linkedin size={16} />
              </a>
            </div>
            <div className={`text-xs mt-2 md:mt-0 ${dark ? "text-gray-400" : "text-gray-600"}`}>
              © {new Date().getFullYear()} AI Blog Summarizer
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
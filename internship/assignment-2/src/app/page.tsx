"use client";

import { useState } from "react";
import { Copy, Download, Trash2, Moon, Sun, Share2, Github, Twitter, Linkedin } from "lucide-react";
// import { Menu, X } from "lucide-react";

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
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

  interface HistoryItem {
    id: string;
    url: string;
    summary: string;
    urdu: string;
    created_at?: string;
  }

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Show toast message
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({message, type});
    setTimeout(() => setToast(null), 3000);
  };

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
        showToast("Summary saved to database successfully!", 'success');
      } else {
        showToast("Something went wrong.", 'error');
      }
    } catch (err) {
      console.error("Error:", err);
      showToast("Failed to summarise blog.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => showToast("Copied to clipboard!", 'success'))
      .catch(() => showToast("Copy failed.", 'error'));
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      const data: { summaries?: HistoryItem[] } = await res.json();
      if (data.summaries) {
        setHistory(data.summaries);
        setShowHistory(true);
        showToast("History loaded successfully", 'info');
      } else {
        showToast("Could not load history.", 'error');
      }
    } catch (error) {
      console.error("Fetch error:", error);
      showToast("Failed to fetch history.", 'error');
    }
  };

  const downloadAsText = () => {
    const blob = new Blob([`Summary:\n${summary}\n\nUrdu:\n${urdu}`], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "summary.txt";
    link.click();
    showToast("Download started!", 'success');
  };

  const clearResults = () => {
    setSummary("");
    setUrdu("");
    setUrl("");
    setBriefSummary("");
    setBulletSummary([]);
    showToast("Cleared all results", 'info');
  };

  const toggleTheme = () => {
    setDark(!dark);
    showToast(`${dark ? 'Light' : 'Dark'} mode activated`, 'info');
  };

  const share = () => {
    const text = `Check out this blog summary!\n\nSummary:\n${summary}\n\nUrdu:\n${urdu}`;
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
    showToast("Share dialog opened", 'info');
  };

  // New aesthetic color scheme with vibrant gradients
  const colors = {
    light: {
      primary: 'from-teal-500 to-cyan-600',
      secondary: 'from-purple-500 to-indigo-600',
      header: 'bg-gradient-to-r from-cyan-500 to-blue-600',
      footer: 'bg-gradient-to-r from-indigo-500 to-purple-600',
      bg: 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50',
      card: 'bg-white/90',
      text: 'text-gray-800',
      button: 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700',
      icon: 'text-white'
    },
    dark: {
      primary: 'from-cyan-400 to-teal-500',
      secondary: 'from-indigo-400 to-purple-500',
      header: 'bg-gradient-to-r from-cyan-700 to-blue-800',
      footer: 'bg-gradient-to-r from-indigo-700 to-purple-800',
      bg: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
      card: 'bg-gray-800/80',
      text: 'text-gray-100',
      button: 'bg-gradient-to-r from-cyan-600 to-teal-700 hover:from-cyan-700 hover:to-teal-800',
      icon: 'text-white'
    }
  };

  const currentColors = dark ? colors.dark : colors.light;

  return (
    <main className={`${dark ? "dark" : ""} min-h-screen flex flex-col transition-colors duration-300`}>
      {/* Gradient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className={`absolute inset-0 ${currentColors.bg}`}>
          <div className={`absolute inset-0 ${
            dark 
              ? "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-gray-900/30 to-gray-900/50" 
              : "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-blue-50/30 to-purple-50/50"
          }`}></div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center animate-fade-in-out ${
          toast.type === 'success' ? 'bg-green-500 text-white' :
          toast.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header with Beautiful Gradient */}
      <header className={`sticky top-0 z-50 ${currentColors.header} shadow-lg`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center py-3">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-black/20 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                <path d="M8 10h.01M12 10h.01M16 10h.01" className="text-white/80"/>
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              AI Blog Summarizer
            </h1>
          </div>
          
          
          <button 
    onClick={toggleTheme} 
    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
  >
    {dark ? <Sun size={20} /> : <Moon size={20} />}
  </button>

          
        </div>

       
      </header>

      {/* Main content */}
      <div className="flex-grow max-w-4xl mx-auto p-4 sm:p-6 space-y-6 w-full">
        {/* Input section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              className={`flex-1 p-3 sm:p-4 rounded-xl border-0 shadow-lg ${
                dark 
                  ? "bg-gray-800/70 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500" 
                  : "bg-white/90 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-teal-500"
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
                  : `${currentColors.button} text-white`
              } transition-all duration-300`}
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

          {/* Summary type selector */}
          <div className="flex flex-wrap gap-2">
            {["brief", "detailed", "urdu", "all"].map((type) => (
              <button
                key={type}
                onClick={() => setSummaryType(type as i)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  summaryType === type
                    ? dark
                      ? "bg-cyan-600 text-white"
                      : "bg-teal-600 text-white"
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

        {/* Action buttons */}
        {(summary || urdu) && (
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button 
              onClick={fetchHistory} 
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg ${
                dark ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-white hover:bg-gray-100 text-gray-800"
              } shadow transition-all text-xs sm:text-sm`}
            >
              📜 View History
            </button>

            <button 
              onClick={downloadAsText} 
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg ${
                dark ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-white hover:bg-gray-100 text-gray-800"
              } shadow transition-all text-xs sm:text-sm`}
            >
              <Download size={14} /> Download
            </button>

            <button 
              onClick={() => copyToClipboard(summary)} 
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg ${
                dark ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-white hover:bg-gray-100 text-gray-800"
              } shadow transition-all text-xs sm:text-sm`}
            >
              <Copy size={14} /> Copy Summary
            </button>

            <button 
              onClick={() => copyToClipboard(urdu)} 
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg ${
                dark ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-white hover:bg-gray-100 text-gray-800"
              } shadow transition-all text-xs sm:text-sm`}
            >
              <Copy size={14} /> Copy Urdu
            </button>

            <button 
              onClick={share} 
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg ${
                dark ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-white hover:bg-gray-100 text-gray-800"
              } shadow transition-all text-xs sm:text-sm`}
            >
              <Share2 size={14} /> Share
            </button>

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

        {/* Summary content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Brief Summary */}
          {(summaryType === "brief" || summaryType === "all") && briefSummary && (
            <div className={`p-4 sm:p-6 rounded-2xl shadow-xl backdrop-blur-sm ${
              dark ? "bg-gray-800/70 border-gray-700" : "bg-white/90 border-gray-200"
            } border transition-all duration-300`}>
              <h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r ${currentColors.primary}`}>
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
              <h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r ${currentColors.primary}`}>
                Detailed Summary
              </h2>
              <ul className="space-y-3 text-sm sm:text-base">
                {bulletSummary.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-1 ${
                      dark ? "bg-cyan-900/50 text-cyan-300" : "bg-cyan-100 text-cyan-800"
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
              <h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r ${currentColors.primary}`}>
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
              <h2 className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r ${currentColors.secondary}`}>
                اردو ترجمہ
              </h2>
              <p className={`text-sm sm:text-base text-right ${dark ? "text-gray-300" : "text-gray-700"}`}>
                {urdu}
              </p>
            </div>
          )}
        </div>

        {/* History Section */}
        {showHistory && history.length > 0 && (
          <div className="space-y-4 mt-8">
            <h2 className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${currentColors.secondary}`}>
              🕘 Summary History
            </h2>
            {history.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl shadow-md ${
                  dark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                }`}
              >
                <p className="text-sm mb-1">
                  🔗 <a href={item.url} target="_blank" className="underline">{item.url}</a>
                </p>
                <p className="text-sm"><strong>Summary:</strong> {item.summary}</p>
                <p className="text-sm text-right font-noto mt-2"><strong>اردو:</strong> {item.urdu}</p>
                {item.created_at && (
                  <p className="text-xs mt-2 text-right italic opacity-70">
                    ⏱ {new Date(item.created_at).toLocaleString("en-PK", {
      timeZone: "Asia/Karachi",
      hour12: true,
      dateStyle: "medium",
      timeStyle: "short"
    })}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with Beautiful Gradient */}
      <footer className={`sticky bottom-0 z-50 ${currentColors.footer} shadow-lg text-white`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-2 md:mb-0">
              <div className="p-1 rounded-lg bg-white/10 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <span className="text-sm font-medium">
                AI Blog Summarizer
              </span>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Github size={16} />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Linkedin size={16} />
              </a>
            </div>
            <div className="text-xs mt-2 md:mt-0 text-white/80">
              © {new Date().getFullYear()} AI Blog Summarizer
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
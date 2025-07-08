"use client";
import { useState } from "react";
import QuoteForm from "../components/ui/QuoteForm";
import Sidebar from "../components/ui/Sidebar";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-purple-800 to-pink-600 text-white shadow-lg z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button className="btn btn-ghost text-xl font-bold tracking-wider">
            <span className="text-purple-200">Quote</span>
            <span className="text-pink-200">Generator</span>
          </button>
          
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-white text-xl font-bold"
          >
            ☰ Topics
          </button>
        </div>
      </nav>

      <div className="h-16" />

      <div className="flex flex-1 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
          style={{ backgroundImage: "url('/abc.jpg')" }}
        >
          <div className="absolute inset-0 bg-purple-900/50 backdrop-blur-sm"></div>
        </div>
 
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 relative z-10 p-6 md:p-10">
          <div className="max-w-3xl mx-auto mb-8 md:mb-12 bg-white/90 rounded-xl shadow-xl p-6 backdrop-blur-sm">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Quote Generator
            </h1>
            <p className="text-center text-purple-800 mt-2">Find inspiration for every moment</p>
          </div>

          <div className="max-w-2xl mx-auto bg-white/90 rounded-xl shadow-2xl p-6 md:p-8 backdrop-blur-sm border border-purple-200/50">
            <QuoteForm />
          </div>
        </main>
      </div>

      <footer className="bg-gradient-to-r from-purple-800 to-pink-600 text-center py-4 text-white">
        <p className="text-sm">
          © {new Date().getFullYear()} Hafsa Quote Generator. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
"use client";

import React, { useState, useRef } from "react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ur", label: "اردو" },
];

export default function LawPlanClient() {
  const [language, setLanguage] = useState("en");
  const [userInput, setUserInput] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAnalyze = async () => {
    if (!userInput.trim()) {
      setAnalysis(language === "en" ? "Please enter your legal issue in detail." : "براہ کرم اپنا قانونی مسئلہ تفصیل سے بیان کریں۔");
      return;
    }
    setLoading(true);
    setAnalysis("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: userInput, language }),
      });
      const data = await res.json();
      setAnalysis(data.analysis || (language === "en" ? "No response from AI." : "AI سے کوئی جواب نہیں آیا۔"));
    } catch {
      setAnalysis(language === "en" ? "❌ Error analyzing your case. Please try again." : "❌ آپ کے کیس کا تجزیہ کرتے وقت خرابی۔ براہ کرم دوبارہ کوشش کریں۔");
    }
    setLoading(false);
  };

  const handleClear = () => {
    setUserInput("");
    setAnalysis("");
    textareaRef.current?.focus();
  };

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      {/* Glassy overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#232745c9] to-[#232745a6] backdrop-blur-md z-0" />

      {/* Header */}
      <header className="relative z-10 flex flex-row justify-between items-center px-8 pt-6">
        <div className="flex items-center space-x-2">
          <span className="text-2xl text-[#FFD700] font-extrabold tracking-wide">⚖️</span>
          <span className="text-2xl font-bold text-white font-serif drop-shadow">JusticeAI Pakistan</span>
        </div>
        <select
          className="bg-[#d6c48a] text-white font-semibold py-2 px-4 rounded shadow focus:outline-none"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-8 pb-6">
        {/* Top Card: Describe Situation */}
        <section className="w-full max-w-3xl mx-auto bg-[rgba(32,32,32,0.55)] backdrop-blur-xl rounded-xl shadow-xl px-8 py-7 mb-8 border border-[#d6c48a]">
          <h2 className="text-3xl font-bold text-[#d6c48a] mb-2 flex items-center gap-2 font-serif">
            <span>⚖️</span>
            <span>
              {language === "en"
                ? "Describe Your Legal Situation"
                : "اپنی قانونی صورتحال بیان کریں"}
            </span>
          </h2>
          <p className="text-white mb-4 font-sans">
            {language === "en"
              ? "Enter your query below. JusticeAI will provide an analysis and a step-by-step action plan."
              : "نیچے اپنا سوال درج کریں۔ JusticeAI تجزیہ اور قدم بہ قدم عمل کا منصوبہ فراہم کرے گا۔"}
          </p>
          <textarea
            ref={textareaRef}
            className="w-full h-24 rounded-md bg-[rgba(32,32,32,0.35)] text-white p-4 mb-4 border border-[#d6c48a] focus:outline-none focus:ring-2 focus:ring-[#d6c48a] resize-none font-sans"
            placeholder={
              language === "en"
                ? "Explain your legal issue in detail..."
                : "اپنا قانونی مسئلہ تفصیل سے بیان کریں..."
            }
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <div className="flex gap-4">
            <button
              className="bg-[#d6c48a] hover:bg-[#e7d393] text-[#232745] font-bold py-2 px-6 rounded shadow transition duration-150"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading
                ? (language === "en" ? "Analyzing..." : "تجزیہ ہو رہا ہے...")
                : (language === "en"
                    ? "Analyze Case & Get Action Plan"
                    : "تجزیہ کریں اور عمل کا منصوبہ حاصل کریں")}
            </button>
            <button
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded shadow transition duration-150"
              onClick={handleClear}
              disabled={loading}
            >
              {language === "en" ? "Clear" : "صاف کریں"}
            </button>
          </div>
        </section>

        {/* Middle Card: Legal Analysis & Action Plan */}
        <section className="w-full max-w-3xl mx-auto bg-[rgba(32,32,32,0.55)] backdrop-blur-xl rounded-xl shadow-xl px-8 py-7 border border-[#d6c48a] mb-8">
          <h2 className="text-2xl font-bold text-[#d6c48a] mb-2 flex items-center gap-2 font-serif">
            <span>💡</span>
            <span>
              {language === "en"
                ? "Legal Analysis & Action Plan"
                : "قانونی تجزیہ اور عمل کا منصوبہ"}
            </span>
          </h2>
          <div className="min-h-[80px] text-white whitespace-pre-line font-sans">
            {analysis ||
              (language === "en"
                ? "Your analysis and action plan will appear here."
                : "آپ کا تجزیہ اور عمل کا منصوبہ یہاں ظاہر ہوگا۔")}
          </div>
        </section>

        {/* Example Cases Card */}
        <section className="w-full max-w-3xl mx-auto bg-[rgba(214,196,138,0.2)] backdrop-blur-md rounded-xl shadow px-8 py-4 border border-[#d6c48a] mb-8">
          <button className="flex items-center gap-2 text-[#d6c48a] font-bold text-lg w-full justify-between">
            <span>💡 {language === "en" ? "Example Cases" : "مثالی کیسز"} / کیسز</span>
            <span className="text-xl">&#9660;</span>
          </button>
        </section>

        {/* Disclaimer */}
        <footer className="w-full max-w-3xl mx-auto text-xs text-center text-[#d6c48a] px-2 pb-2 pt-4 font-sans">
          <strong>⚠️ {language === "en" ? "Important Disclaimer:" : "اہم نوٹس:"} </strong>
          {language === "en"
            ? "JusticeAI provides legal information based on Pakistani laws. This is not legal advice. Always consult with a qualified lawyer for your specific situation."
            : "JusticeAI پاکستانی قوانین کی بنیاد پر قانونی معلومات فراہم کرتا ہے۔ یہ قانونی مشورہ نہیں ہے۔ اپنے معاملے کے لیے ہمیشہ کسی مستند وکیل سے رجوع کریں۔"}
        </footer>
      </main>
    </div>
  );
}
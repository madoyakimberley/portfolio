"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import QRCode from "react-qr-code";

interface Repository {
  id: number;
  name: string;
  description: string;
  readmeDescription?: string;
  html_url: string;
  stargazers_count: number;
  forks_count?: number;
  language: string;
}

interface Article {
  id: number;
  title: string;
  description: string;
  published_at: string;
  url: string;
  cover_image: string;
  tag_list: string[];
}

export default function PortfolioPage() {
  // Navigation State
  const [activeSection, setActiveSection] = useState("");
  const certificateUrl =
    "https://moringa.my.salesforce-sites.com/certificateStatus?id=a0PQ200000Uyv9AMAR";
  // Form Stateful Control
  const [formData, setFormData] = useState({
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    type: "idle",
    message: "",
  });

  // GitHub Project Telemetry State
  const [repos, setRepos] = useState<Repository[]>([]);
  const [reposLoading, setReposLoading] = useState(true);

  // Dev.to Articles State
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  // Active Section Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }, // Adjusts when the section is considered "active"
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Toast Auto-Dismiss
  useEffect(() => {
    if (formStatus.type === "success" || formStatus.type === "error") {
      const timer = setTimeout(() => {
        setFormStatus({ type: "idle", message: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [formStatus.type]);

  // Fetch Live GitHub Repositories & Extract Readme Text
  useEffect(() => {
    async function fetchGithubRepos() {
      try {
        const res = await fetch(
          "https://api.github.com/users/madoyakimberley/repos?sort=updated&per_page=4",
        );
        if (!res.ok) throw new Error("Telemetry connection failed");
        const data = await res.json();

        // Dynamically extract real README data for each repo
        const reposWithReadmes = await Promise.all(
          data.map(async (repo: any) => {
            try {
              const readmeRes = await fetch(
                `https://api.github.com/repos/madoyakimberley/${repo.name}/readme`,
              );
              if (readmeRes.ok) {
                const readmeData = await readmeRes.json();
                // Safely decode base64 binary encoding string into readable text
                const decodedText = decodeURIComponent(
                  escape(atob(readmeData.content.replace(/\s/g, ""))),
                );
                // Strip common markdown elements, paths, titles to form clean readable description prose
                const cleanProse = decodedText
                  .replace(/#+\s+.*/g, "")
                  .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
                  .replace(/[*`_\-–|#]/g, "")
                  .replace(/\s+/g, " ")
                  .trim();

                return {
                  ...repo,
                  readmeDescription:
                    cleanProse.length > 140
                      ? cleanProse.substring(0, 140) + "..."
                      : cleanProse || "No documentation written yet.",
                };
              }
            } catch (readmeErr) {
              console.error(
                `Error mapping stream readmes for ${repo.name}:`,
                readmeErr,
              );
            }
            return {
              ...repo,
              readmeDescription: repo.description || "No description provided.",
            };
          }),
        );

        setRepos(reposWithReadmes);
      } catch (err) {
        console.error("GitHub API stream disruption:", err);
      } finally {
        setReposLoading(false);
      }
    }
    fetchGithubRepos();
  }, []);

  // Fetch Live Dev.to Articles
  useEffect(() => {
    async function fetchDevToArticles() {
      try {
        const res = await fetch(
          "https://dev.to/api/articles?username=madoyakimberley&per_page=4",
        );
        if (!res.ok) throw new Error("Journal connection failed");
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("Dev.to API stream disruption:", err);
      } finally {
        setArticlesLoading(false);
      }
    }
    fetchDevToArticles();
  }, []);

  // Form Submission Handler with Validation & Error Feedback
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = formData.email.trim();
    const cleanMessage = formData.message.trim();

    if (!cleanEmail || !cleanMessage) {
      setFormStatus({
        type: "error",
        message: "Please fill out all fields before sending.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setFormStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    const scriptInjectionPattern =
      /<script\b[^>]*>([\s\S]*?)<\/script>|javascript:/i;
    if (scriptInjectionPattern.test(cleanMessage)) {
      setFormStatus({
        type: "error",
        message: "Please enter a valid message without links or code lines.",
      });
      return;
    }

    const standardPayload = {
      email: cleanEmail,
      message: cleanMessage,
    };

    setFormStatus({ type: "loading", message: "Sending message..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(standardPayload),
      });

      const responseData = await response.json().catch(() => ({}));

      if (response.ok) {
        setFormStatus({
          type: "success",
          message: "Message sent successfully! I'll get back to you soon.",
        });
        setFormData({ email: "", message: "" });
      } else {
        throw new Error(
          responseData.message ||
            responseData.error ||
            `Error state: ${response.status}`,
        );
      }
    } catch (error: any) {
      setFormStatus({
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#11131c] text-[#e1e1ef] font-sans antialiased selection:bg-[#ff79c6]/30 selection:text-[#ff79c6]">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-[#11131c]/60 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-8 flex justify-between items-center h-20">
          <a
            href="#"
            className="font-serif text-[32px] font-semibold text-[#c5c0ff] tracking-tight hover:opacity-90 transition-opacity"
          >
            Madoya
          </a>

          <div className="hidden md:flex gap-8 items-center">
            <a
              href="#systems"
              className={`text-xs font-medium uppercase tracking-[0.15em] transition-all ${
                activeSection === "systems"
                  ? "text-[#ff79c6] border-b-2 border-[#ff79c6] pb-1"
                  : "text-[#c8c4d5] hover:text-[#ff79c6]"
              }`}
            >
              SYSTEMS
            </a>
            <a
              href="#the-why"
              className={`text-xs font-medium uppercase tracking-[0.15em] transition-all ${
                activeSection === "the-why" || activeSection === "about"
                  ? "text-[#ff79c6] border-b-2 border-[#ff79c6] pb-1"
                  : "text-[#c8c4d5] hover:text-[#ff79c6]"
              }`}
            >
              THE WHY
            </a>
            <a
              href="#work"
              className={`text-xs font-medium uppercase tracking-[0.15em] transition-all ${
                activeSection === "work"
                  ? "text-[#ff79c6] border-b-2 border-[#ff79c6] pb-1"
                  : "text-[#c8c4d5] hover:text-[#ff79c6]"
              }`}
            >
              SHIPPED WORK
            </a>
            <a
              href="#connect"
              className={`text-xs font-medium uppercase tracking-[0.15em] transition-all ${
                activeSection === "connect"
                  ? "text-[#ff79c6] border-b-2 border-[#ff79c6] pb-1"
                  : "text-[#c8c4d5] hover:text-[#ff79c6]"
              }`}
            >
              CONNECT
            </a>
            <a
              href="#journal"
              className={`text-xs font-medium uppercase tracking-[0.15em] transition-all ${
                activeSection === "journal"
                  ? "text-[#ff79c6] border-b-2 border-[#ff79c6] pb-1"
                  : "text-[#c8c4d5] hover:text-[#ff79c6]"
              }`}
            >
              JOURNAL
            </a>
          </div>

          {/* Social Icons Group (Replacing Resume & Computer Grid Elements) */}
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/madoyakimberley"
              target="_blank"
              rel="noreferrer"
              className="text-[#c5c0ff] hover:text-[#ff79c6] transition-colors"
              title="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/kimberley-madoya-018400397"
              target="_blank"
              rel="noreferrer"
              className="text-[#c5c0ff] hover:text-[#ff79c6] transition-colors"
              title="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="#connect"
              className="text-[#c5c0ff] hover:text-[#ff79c6] transition-colors"
              title="Email Me"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#11131c]/40 via-[#11131c]/60 to-[#11131c] z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-8 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 flex flex-col items-start gap-6">
            <span className="text-xs font-medium text-[#bd93f9] uppercase tracking-[0.2em] border border-[#bd93f9]/30 px-3 py-1 rounded-full bg-[#bd93f9]/10 backdrop-blur-xl">
              Full-Stack Engineer
            </span>
            <h1 className="font-serif text-4xl md:text-[64px] leading-[1.1] text-[#e1e1ef] tracking-tight">
              Engineering <br />
              <span className="bg-gradient-to-r from-[#bd93f9] to-[#ff79c6] bg-clip-text text-transparent italic font-light">
                Atmosphere
              </span>{" "}
              <span className="font-serif">&</span> Logic.
            </h1>
            <p className="text-lg text-[#c8c4d5] max-w-lg leading-relaxed">
              Crafting digital experiences at the intersection of cinematic
              serenity and robust, scalable architecture.
            </p>
            <div className="flex gap-4 mt-2">
              <a
                href="#work"
                className="text-xs font-medium text-[#11131c] bg-gradient-to-br from-[#ff79c6] to-[#bd93f9] px-6 py-3 rounded-sm hover:opacity-90 transition-opacity tracking-wider uppercase"
              >
                View Ledger
              </a>
              <a
                href="#connect"
                className="text-xs font-medium text-[#bd93f9] border border-white/10 px-6 py-3 rounded-sm hover:bg-[#bd93f9]/10 transition-colors tracking-wider uppercase"
              >
                Get In Touch
              </a>
            </div>
          </div>

          <div className="md:col-span-5 relative mt-12 md:mt-0">
            <div className="absolute -inset-4 bg-[#ff79c6]/15 blur-[100px] rounded-full z-0 pointer-events-none" />
            <div className="relative z-10 bg-[#11131c]/60 backdrop-blur-2xl border border-white/10 rounded-lg p-4 flex flex-col items-center shadow-2xl">
              <div className="w-full aspect-[3/4] relative rounded-md overflow-hidden border border-white/10 mb-4 bg-[#1a1c26]">
                <Image
                  alt="Kimberley Madoya Avatar"
                  className="w-full h-full object-cover grayscale-[20%] contrast-125 hover:grayscale-0 transition-all duration-700"
                  src="/images/image.WebP"
                  fill
                  sizes="(max-w-7xl) 400px"
                  priority
                />
              </div>
              <div className="flex flex-wrap justify-center gap-2 w-full">
                <span className="text-xs font-medium px-2 py-1 rounded-sm bg-[#11131c]/60 border border-white/10 text-[#ff79c6]">
                  TypeScript
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded-sm bg-[#11131c]/60 border border-white/10 text-[#bd93f9]">
                  Next.js
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded-sm bg-[#11131c]/60 border border-white/10 text-[#ff79c6]">
                  Python
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded-sm bg-[#11131c]/60 border border-white/10 text-[#bd93f9]">
                  MySQL
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: The Narrative */}
      <section
        className="py-32 px-8 w-full max-w-[1200px] mx-auto relative"
        id="about"
      >
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-12 flex flex-col items-center text-center">
            <span className="text-xs font-medium text-[#ff79c6] uppercase tracking-[0.2em] mb-4">
              01 // The Narrative
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#e1e1ef] max-w-3xl leading-relaxed">
              I build because it&apos;s fun, and because good tools should make
              someone&apos;s life a little easier. Every project starts as a
              real problem I want gone — and I don&apos;t stop until the
              solution feels obvious in hindsight.
            </h2>
          </div>
        </div>
      </section>

      {/* Section 2: The Why */}
      <section
        className="py-32 px-8 w-full max-w-[1200px] mx-auto relative"
        id="the-why"
      >
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4 flex flex-col">
            <span className="text-xs font-medium text-[#bd93f9] uppercase tracking-[0.2em] mb-4">
              02 // The Difference
            </span>
            <h2 className="font-serif text-3xl font-semibold text-[#e1e1ef] leading-tight">
              Built to earn <br /> real trust.
            </h2>
          </div>
          <div className="md:col-span-8 grid md:grid-cols-2 gap-12 pt-8 md:pt-0">
            <div className="flex flex-col gap-4">
              <svg
                className="w-8 h-8 text-[#ff79c6]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18v-5.25m0 0a3.5 3.5 0 11-3.5-3.5H12m0 3.5a3.5 3.5 0 103.5-3.5H12M8.25 5.25h7.5M8.25 21h7.5"
                />
              </svg>
              <h3 className="text-xl font-semibold text-[#e1e1ef]">
                Built From Curiosity
              </h3>
              <p className="text-[#c8c4d5] leading-relaxed text-sm">
                I build because I genuinely enjoy it, and that&apos;s why I move
                fast and keep getting better — project after project. I&apos;m
                not chasing easy. I&apos;m chasing the kind of work a company
                can hand to me and trust it&apos;ll get done right.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <svg
                className="w-8 h-8 text-[#bd93f9]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.53 16.122l9.37-9.37a2.25 2.25 0 113.182 3.182l-9.37 9.37a4.5 4.5 0 01-2.247 1.177l-3.516.703.703-3.516a4.5 4.5 0 011.177-2.247z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-[#e1e1ef]">
                Problem-First Thinking
              </h3>
              <p className="text-[#c8c4d5] leading-relaxed text-sm">
                I don&apos;t start with a framework, I start with what&apos;s
                actually broken. Every decision, down to a single component,
                comes back to one question: does this make someone&apos;s life
                easier? If it doesn&apos;t earn its place, it doesn&apos;t ship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Systems & Tech Stack */}
      <section className="py-32 px-8 w-full bg-[#0c0e17] relative" id="systems">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161923_1px,transparent_1px),linear-gradient(to_bottom,#161923_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none z-0" />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="mb-12 flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8">
            <div>
              <span className="text-xs font-medium text-[#ff79c6] uppercase tracking-[0.2em] mb-4 block">
                03 // Architecture Matrix
              </span>
              <h2 className="font-serif text-3xl font-semibold text-[#e1e1ef]">
                The Tech Stack, GitHub Repos & Certifications
              </h2>
            </div>
            <p className="text-sm text-[#c8c4d5] max-w-sm text-right hidden md:block">
              Tools selected for performance, type safety, and developer
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Frontend Card */}
            <div className="bg-[#11131c]/60 backdrop-blur-xl border border-white/10 p-8 rounded-md flex flex-col gap-6 hover:border-[#ff79c6]/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#e1e1ef]">
                  Frontend
                </h3>
                <svg
                  className="w-5 h-5 text-[#8be9fd]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z"
                  />
                </svg>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "JavaScript",
                  "React",
                  "Next.js",
                  "Tailwind CSS",
                  "Framer Motion",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-medium px-3 py-1.5 rounded-sm bg-[#11131c]/60 border border-white/10 text-[#c8c4d5]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend Card */}
            <div className="bg-[#11131c]/60 backdrop-blur-xl border border-white/10 p-8 rounded-md flex flex-col gap-6 hover:border-[#ff79c6]/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#e1e1ef]">
                  Backend
                </h3>
                <svg
                  className="w-5 h-5 text-[#bd93f9]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3V3.75a3 3 0 013-3h13.5a3 3 0 013 3v7.5a3 3 0 01-3 3m-13.5 0a3 3 0 00-3 3v3.75a3 3 0 003 3h13.5a3 3 0 003-3V17.25a3 3 0 00-3-3z"
                  />
                </svg>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Node.js",
                  "Python",
                  "Flask",
                  "SQL",
                  "Drizzle ORM",
                  "MySQL",
                  "PostgreSQL",
                  "Redis",
                  "Docker",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-medium px-3 py-1.5 rounded-sm bg-[#11131c]/60 border border-white/10 text-[#c8c4d5]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Infrastructure Card */}
            <div className="bg-[#11131c]/60 backdrop-blur-xl border border-white/10 p-8 rounded-md flex flex-col justify-between gap-6 hover:border-[#ff79c6]/40 transition-all duration-300">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#e1e1ef]">
                    Infrastructure
                  </h3>
                  <svg
                    className="w-5 h-5 text-[#ff79c6]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
                    />
                  </svg>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["AWS", "Docker", "CI/CD Pipelines", "Vercel", "Git"].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="text-xs font-medium px-3 py-1.5 rounded-sm bg-[#11131c]/60 border border-white/10 text-[#c8c4d5]"
                      >
                        {tech}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Certification Card */}
            <div className="bg-[#11131c]/60 backdrop-blur-xl border border-white/10 p-8 rounded-md flex flex-col justify-between gap-6 hover:border-[#ff79c6]/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#e1e1ef]">
                  Certification
                </h3>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#bd93f9] block mb-1">
                    Moringa School
                  </span>
                  <h3 className="text-lg font-semibold text-[#e1e1ef]">
                    Software Engineering
                  </h3>
                </div>
                <svg
                  className="w-5 h-5 text-[#ff79c6]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div className="flex items-center gap-5 pt-2">
                {/* Scannable QR Code linking directly to Salesforce verification */}
                <div className="p-2.5 rounded bg-[#f8f8f2] flex-shrink-0 shadow-sm">
                  <QRCode
                    value={certificateUrl}
                    size={68}
                    bgColor="#f8f8f2"
                    fgColor="#11131c"
                    level="M"
                  />
                </div>

                {/* Certificate Metadata & Click/Scan Actions */}
                <div className="flex flex-col gap-1.5 text-xs text-[#c8c4d5]">
                  <p className="font-medium text-[#e1e1ef]">
                    Certificate of Completion
                  </p>
                  <p className="text-[11px] leading-relaxed text-[#a5a1b8]">
                    Awarded to{" "}
                    <strong className="text-[#8be9fd] font-normal">
                      Kimberley Madoya
                    </strong>{" "}
                    on 29th July, 2026.
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={certificateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-medium text-[#8be9fd] hover:text-[#ff79c6] tracking-wide flex items-center gap-1 transition-colors underline underline-offset-4"
                    >
                      Click to view certificate ➔
                    </a>
                    <span className="text-[#6272a4]">•</span>
                    <span className="text-[10px] text-[#bd93f9] tracking-wide uppercase font-mono">
                      Scan to verify
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Repositories Live Stream */}
          <div className="mt-12">
            {reposLoading ? (
              <div className="py-16 text-center font-mono text-xs text-[#928f9e] tracking-widest animate-pulse bg-[#11131c]/30 rounded-md border border-white/5">
                &gt; CONNECTING TO GITHUB... FETCHING REPOSITORIES...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {repos.map((repo) => (
                  <div
                    key={repo.id}
                    className="bg-[#11131c]/60 backdrop-blur-xl border border-white/10 p-6 rounded-md flex flex-col justify-between hover:border-[#ff79c6]/40 transition-all duration-300"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#e1e1ef] tracking-wide">
                          {repo.name}
                        </h3>
                        <div className="flex items-center gap-3 text-[#c8c4d5]">
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-[#ff79c6]">★</span>
                            <span>{repo.stargazers_count}</span>
                          </div>
                          {repo.forks_count !== undefined &&
                            repo.forks_count > 0 && (
                              <div className="flex items-center gap-1 text-xs">
                                <span className="text-[#bd93f9]">⑂</span>
                                <span>{repo.forks_count}</span>
                              </div>
                            )}
                        </div>
                      </div>
                      <p className="text-sm text-[#c8c4d5] line-clamp-3 leading-relaxed font-sans font-light">
                        {repo.readmeDescription}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex gap-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-[#11131c]/60 border border-white/10 text-[#ff79c6]">
                          {repo.language || "TypeScript"}
                        </span>
                      </div>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-[#8be9fd] hover:text-[#ff79c6] uppercase tracking-wider font-medium transition-colors"
                      >
                        View Source ➔
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 4: Experience Ledger */}
      <section className="py-32 px-8 w-full max-w-[1200px] mx-auto" id="work">
        <span className="text-xs font-medium text-[#bd93f9] uppercase tracking-[0.2em] mb-4 block">
          04 // Experience Ledger
        </span>
        <h2 className="font-serif text-3xl font-semibold text-[#e1e1ef] mb-12">
          Shipped Work
        </h2>

        <div className="flex flex-col gap-16">
          {/* Project 1: Lynvista Safaris */}
          <div className="grid md:grid-cols-12 gap-8 items-center group">
            <div className="md:col-span-5 w-full aspect-video rounded-md overflow-hidden border border-white/10 relative p-2 bg-[#11131c]/60">
              <div className="w-full h-full relative rounded overflow-hidden bg-[#1a1c26]">
                <Image
                  alt="Lynvista Safaris Core Engine"
                  src="/images/lynvista.WebP"
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  sizes="(max-w-md) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="md:col-span-7 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#e1e1ef] group-hover:text-[#ff79c6] transition-colors">
                  Lynvista Safaris
                </h3>
                <a
                  href="https://lynvistasafaris.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-[#8be9fd] hover:text-[#ff79c6] tracking-wider uppercase flex items-center gap-1 transition-colors"
                >
                  View Site ➔
                </a>
              </div>
              <p className="text-sm md:text-base text-[#c8c4d5] leading-relaxed">
                A premium booking engine designed for high-end travel
                experiences. Implemented a complex pricing algorithm and a
                serene, visually immersive frontend that prioritizes large-scale
                imagery and smooth, glassmorphic UI interactions.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-[#bd93f9] font-medium pt-2">
                <span>Next.js</span>
                <span>•</span>
                <span>Daraja API</span>
                <span>•</span>
                <span>MySQL</span>
                <span>•</span>
                <span>Drizzle ORM</span>
                <span>•</span>
                <span>Instasend</span>
              </div>
            </div>
          </div>

          {/* Project 2: Salio */}
          <div className="grid md:grid-cols-12 gap-8 items-center group">
            <div className="md:col-span-5 w-full aspect-video rounded-md overflow-hidden border border-white/10 relative p-2 bg-[#11131c]/60">
              <div className="w-full h-full relative rounded overflow-hidden bg-[#1a1c26]">
                <Image
                  alt="Salio Server Platform"
                  src="/images/salio.WebP"
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  sizes="(max-w-md) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="md:col-span-7 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#e1e1ef] group-hover:text-[#ff79c6] transition-colors">
                  Salio Platform
                </h3>
                <a
                  href="https://salio-server-omega.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-[#8be9fd] hover:text-[#ff79c6] tracking-wider uppercase flex items-center gap-1 transition-colors"
                >
                  View Site ➔
                </a>
              </div>
              <p className="text-sm md:text-base text-[#c8c4d5] leading-relaxed">
                A robust web application and server architecture built for
                real-time data processing and streamlined service orchestration.
                Focused on high availability, clean API design, and responsive
                client-server state synchronization.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-[#bd93f9] font-medium pt-2">
                <span>TypeScript</span>
                <span>•</span>
                <span>Next.js</span>
                <span>•</span>
                <span>Node.js</span>
                <span>•</span>
                <span>REST APIs</span>
                <span>•</span>
                <span>Vercel</span>
              </div>
            </div>
          </div>

          {/* Project 3: StudioFlow Dashboard */}
          <div className="grid md:grid-cols-12 gap-8 items-center group">
            <div className="md:col-span-5 w-full aspect-video rounded-md overflow-hidden border border-white/10 relative p-2 bg-[#11131c]/60">
              <div className="w-full h-full relative rounded overflow-hidden bg-[#1a1c26]">
                <Image
                  alt="StudioFlow Workspace Dashboard"
                  src="/images/studioflow.WebP"
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  sizes="(max-w-md) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="md:col-span-7 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#e1e1ef] group-hover:text-[#ff79c6] transition-colors">
                  StudioFlow Dashboard
                </h3>
                <a
                  href="https://studioflow-dashboard.onrender.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-[#8be9fd] hover:text-[#ff79c6] tracking-wider uppercase flex items-center gap-1 transition-colors"
                >
                  View Site ➔
                </a>
              </div>
              <p className="text-sm md:text-base text-[#c8c4d5] leading-relaxed">
                An intuitive production and workflow management dashboard
                designed to streamline agency operations. Features interactive
                data metrics, task tracking pipelines, and a minimal,
                distraction-free command center interface.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-[#bd93f9] font-medium pt-2">
                <span>Next.js</span>
                <span>•</span>
                <span>Tailwind CSS</span>
                <span>•</span>
                <span>Node.js</span>
                <span>•</span>
                <span>MySQL</span>
                <span>•</span>
                <span>Render</span>
                <span>•</span>
                <span>Redis</span>
                <span>•</span>
                <span>Docker</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: The Journal */}
      <section
        className="py-32 px-8 w-full max-w-[1200px] mx-auto"
        id="journal"
      >
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-medium text-[#ff79c6] uppercase tracking-[0.2em] mb-4 block">
            04 // THE JOURNAL
          </span>
          <h2 className="font-serif text-3xl font-semibold text-[#e1e1ef] mb-4">
            Latest Transmissions
          </h2>
          <p className="text-sm text-[#c8c4d5] leading-relaxed font-sans font-light">
            Welcome to my digital logbook. This is where I write about the
            chaotic reality of full-stack engineering—unfiltering the deep
            dives, the late-night architectural breakthroughs, and the crazy
            bugs encountered while shipping live code. Pull up a chair and see
            what I'm breaking this week.
          </p>
        </div>

        {articlesLoading ? (
          <div className="py-16 text-center font-mono text-xs text-[#928f9e] tracking-widest animate-pulse bg-[#11131c]/30 rounded-md border border-white/5">
            &gt; CONNECTING TO DEV.TO... FETCHING TRANSMISSIONS...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((article) => {
              const dateObj = new Date(article.published_at);
              const shortMonths = [
                "JAN",
                "FEB",
                "MAR",
                "APR",
                "MAY",
                "JUN",
                "JUL",
                "AUG",
                "SEP",
                "OCT",
                "NOV",
                "DEC",
              ];
              const formattedDate = `${shortMonths[dateObj.getMonth()]} ${String(dateObj.getDate()).padStart(2, "0")}, ${dateObj.getFullYear()}`;

              const primaryTag =
                article.tag_list && article.tag_list.length > 0
                  ? article.tag_list[0].toUpperCase()
                  : "TRANSMISSION";

              return (
                <div
                  key={article.id}
                  className="relative group/card bg-[#11131c]/40 backdrop-blur-xl border border-white/10 rounded-md p-5 flex flex-col justify-between hover:border-[#ff79c6]/50 hover:shadow-[0_0_30px_rgba(255,121,198,0.15)] transition-all duration-500 overflow-hidden"
                >
                  {/* Ambient glow background effect inside card */}
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-[#bd93f9]/10 to-[#ff79c6]/10 blur-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="space-y-4">
                    <div className="w-full aspect-[16/10] relative rounded-md overflow-hidden border border-white/10 bg-[#1a1c26]">
                      {article.cover_image ? (
                        <Image
                          alt={article.title}
                          src={article.cover_image}
                          fill
                          unoptimized
                          priority
                          loading="eager"
                          className="object-cover opacity-75 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-700 ease-out"
                          sizes="(max-w-md) 100vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1a1c26] to-[#24273a] flex items-center justify-center text-xs text-[#928f9e]">
                          No Preview Available
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] font-mono text-[#bd93f9] tracking-wider uppercase flex items-center gap-1.5">
                      <span>{formattedDate}</span>
                      <span className="text-white/20">//</span>
                      <span className="text-[#ff79c6]">{primaryTag}</span>
                    </div>

                    <h3 className="text-base font-semibold text-[#e1e1ef] tracking-wide line-clamp-2 leading-snug group-hover/card:text-[#ff79c6] transition-colors duration-300">
                      {article.title}
                    </h3>

                    <p className="text-xs text-[#c8c4d5] line-clamp-3 leading-relaxed font-sans font-light">
                      {article.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-2 border-t border-white/5">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#8be9fd] hover:text-[#ff79c6] uppercase tracking-wider font-semibold transition-all duration-300 group/link"
                    >
                      <span>Read Story</span>
                      <span className="transform group-hover/link:translate-x-1 transition-transform duration-300">
                        ➔
                      </span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Section 5: Connect */}
      <section
        className="py-32 px-8 w-full max-w-[1200px] mx-auto relative flex flex-col items-center justify-center min-h-[60vh]"
        id="connect"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#ff79c6]/5 blur-[120px] rounded-full z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg mx-auto text-center">
          <span className="text-xs font-medium text-[#ff79c6] uppercase tracking-[0.2em] mb-4 block">
            05 // Contact
          </span>
          <h2 className="font-serif text-3xl font-semibold text-[#e1e1ef] mb-6">
            Get In Touch.
          </h2>
          <p className="text-sm text-[#c8c4d5] mb-12 max-w-sm mx-auto leading-relaxed">
            I'm always open to new opportunities, project ideas, or any
            questions you might have. Feel free to reach out!
          </p>

          <form
            className="flex flex-col gap-8 w-full text-left"
            onSubmit={handleContactSubmit}
          >
            <div className="relative group border-b border-white/20 focus-within:border-[#ff79c6] transition-colors duration-300">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="block w-full py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-[#e1e1ef] text-sm placeholder-transparent peer"
                placeholder="Email Address"
                autoComplete="off"
              />
              <label
                htmlFor="email"
                className="absolute left-0 top-3 text-xs uppercase tracking-wider text-[#928f9e] transition-all duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-[#ff79c6]"
              >
                Email Address
              </label>
            </div>

            <div className="relative group border-b border-white/20 focus-within:border-[#ff79c6] transition-colors duration-300 mt-4">
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="block w-full py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-[#e1e1ef] text-sm placeholder-transparent resize-none peer"
                placeholder="Your Message"
              />
              <label
                htmlFor="message"
                className="absolute left-0 top-3 text-xs uppercase tracking-wider text-[#928f9e] transition-all duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-[#ff79c6]"
              >
                Your Message
              </label>
            </div>

            <button
              type="submit"
              disabled={formStatus.type === "loading"}
              className="mt-4 text-xs font-semibold text-[#11131c] bg-gradient-to-r from-[#ff79c6] to-[#bd93f9] px-8 py-4 rounded-sm hover:opacity-90 transition-opacity tracking-widest uppercase w-full flex items-center justify-center gap-2 disabled:opacity-40"
            >
              Send Message ➔
            </button>
          </form>
        </div>

        {/* Floating Toast Notification */}
        {formStatus.type !== "idle" && (
          <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            <div
              className={`p-4 rounded-sm border backdrop-blur-md shadow-2xl flex items-center gap-3 min-w-[280px] max-w-sm ${
                formStatus.type === "loading"
                  ? "bg-[#11131c]/95 border-[#8be9fd] text-[#8be9fd]"
                  : formStatus.type === "success"
                    ? "bg-[#11131c]/95 border-emerald-500 text-emerald-400"
                    : "bg-[#11131c]/95 border-[#ff79c6] text-[#ff79c6]"
              }`}
            >
              {formStatus.type === "loading" && (
                <svg
                  className="animate-spin h-4 w-4 text-[#8be9fd]"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              <span className="text-xs tracking-wide">
                {formStatus.message}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-white/5 bg-[#11131c] relative z-10">
        <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#c8c4d5] tracking-widest uppercase">
          <p>
            © {new Date().getFullYear()} DIGITAL ARTISAN. BUILT WITH PRECISION.
            ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-6">
            <a
              href="https://github.com/madoyakimberley"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#8be9fd] transition-colors"
            >
              Github
            </a>
            <a
              href="https://linkedin.com/in/kimberley-madoya-018400397"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#8be9fd] transition-colors"
            >
              LinkedIn
            </a>
            <a href="#" className="hover:text-[#8be9fd] transition-colors">
              Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

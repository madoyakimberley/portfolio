"use client";

import React from "react";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-canvas font-sans relative overflow-hidden selection:bg-stitchPurple/40">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111625_1px,transparent_1px),linear-gradient(to_bottom,#111625_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />

      <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-stitchPurple/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-electricBlue/5 blur-[120px] rounded-full pointer-events-none" />

      <header className="sticky top-0 z-50 w-full border-b border-surfaceBorder/40 bg-canvas/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <span className="text-white font-bold tracking-wider text-lg">
            KIMBERLEY MADOYA
          </span>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-slate-400">
            <a
              href="#systems"
              className="hover:text-electricBlue transition-colors"
            >
              // SYSTEMS
            </a>
            <a
              href="#philosophy"
              className="hover:text-electricBlue transition-colors"
            >
              // THE WHY
            </a>
            <a
              href="#ledger"
              className="hover:text-electricBlue transition-colors"
            >
              // SHIPPED WORK
            </a>
            <a
              href="#connect"
              className="hover:text-electricBlue transition-colors"
            >
              // CONNECT
            </a>
          </nav>
          <a
            href="#connect"
            className="px-5 py-2 text-xs uppercase font-mono tracking-superWide border border-stitchPurple text-white rounded-sm bg-stitchPurple/10 hover:bg-stitchPurple/20 transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.2)]"
          >
            [ CONNECT ]
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 relative z-10">
        <section className="pt-12 pb-24 border-b border-surfaceBorder/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-electricBlue/30 bg-electricBlue/5 rounded-full text-xs font-medium text-electricBlue">
                <span className="w-2 h-2 rounded-full bg-electricBlue animate-pulse" />
                Available for Core Engineering Roles
              </div>
            </div>
            <div className="lg:col-span-8 lg:text-right font-mono text-xs text-slate-400 space-y-1">
              <p>DEPLOYMENT ENVIRONMENTS & ARCHITECTURE</p>
              <p className="text-electricBlue">
                Python // Flask // Next.js // React // Drizzle ORM // Supabase
                // Tailwind
              </p>
            </div>
          </div>

          <div className="mt-12 relative flex flex-col items-center justify-center min-h-[450px]">
            <div className="w-72 h-96 relative bg-gradient-to-b from-surface to-canvas border border-surfaceBorder rounded-md overflow-hidden z-10 shadow-2xl group">
              <div className="absolute inset-0 bg-canvas/40 mix-blend-overlay group-hover:bg-transparent transition-all duration-500" />
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-48 h-48 border border-dashed border-stitchPurple rounded-full animate-spin [animation-duration:20s]" />
                <div className="w-32 h-32 border border-dashed border-electricBlue rounded-full absolute animate-ping [animation-duration:4s]" />
              </div>
              <div className="absolute bottom-4 left-4 font-mono text-[10px] text-slate-500">
                SYSTEM_AVATAR // KM_01
              </div>
            </div>

            <div className="absolute left-0 bottom-0 lg:bottom-12 z-20 pointer-events-none max-w-2xl">
              <p className="font-serif italic text-2xl text-slate-400 pl-2 mb-2">
                Hey, there
              </p>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight uppercase">
                I AM <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-stitchPurple-light to-electricBlue">
                  KIMBERLEY MADOYA
                </span>
              </h1>
            </div>

            <div className="absolute right-0 bottom-0 lg:bottom-12 z-20 text-right max-w-xs hidden md:block pointer-events-none">
              <h2 className="font-mono text-xs uppercase tracking-superWide text-slate-400 mb-2">
                // SPECIALIZATION
              </h2>
              <p className="text-xl font-bold text-white uppercase leading-tight tracking-wide">
                Full-Stack Engineer / <br />
                Backend Architect
              </p>
            </div>
          </div>
        </section>

        <section
          id="philosophy"
          className="py-20 border-b border-surfaceBorder/30"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <h2 className="text-xs font-mono uppercase tracking-superWide text-stitchPurple-light">
                // THE DIFFERENCE
              </h2>
              <p className="text-3xl font-black text-white uppercase tracking-tight mt-3">
                Why pick me over a thousand other devs?
              </p>
            </div>
            <div className="lg:col-span-8 text-lg text-slate-300 space-y-6 leading-relaxed">
              <p>
                Whether you are a fast-moving startup aiming for an MVP or an
                enterprise engineering team protecting strict data structures,
                you run into the same problem:{" "}
                <strong className="text-white font-medium">
                  developers who build things that only work on their local
                  machine.
                </strong>
              </p>
              <p>
                I build software with systemic longevity in mind. When I design
                backends in{" "}
                <span className="text-white underline decoration-stitchPurple">
                  Python and Flask
                </span>
                , I focus on transactional consistency—like translating dynamic
                frontend states into bulletproof database-friendly values to
                entirely eliminate runtime truncation bugs. When I write
                frontend systems with{" "}
                <span className="text-white underline decoration-electricBlue">
                  Next.js and Tailwind CSS
                </span>
                , I treat user experience as a science, building high-end,
                highly scannable workspaces that require zero explanation.
              </p>
              <p className="text-base text-slate-400 font-mono">
                → No black boxes. No cutting corners. Just clean schemas,
                predictable API behaviors, and clean code that scales
                seamlessly.
              </p>
            </div>
          </div>
        </section>

        <section
          id="systems"
          className="py-20 border-b border-surfaceBorder/30"
        >
          <p className="text-xs font-mono tracking-superWide uppercase text-slate-500 mb-8">
            ARCHITECTURE MATRIX
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-surfaceBorder/60 bg-surface/20 divide-y md:divide-y-0 md:divide-x divide-surfaceBorder/60">
            <div className="p-8 space-y-4 hover:bg-surface/40 transition-colors duration-300 group">
              <div className="font-mono text-xs text-stitchPurple-light font-bold">
                01 // SYSTEM ARCHITECTURE
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                Resilient Engines
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Building reliable, highly performant backends using Python and
                Flask. Focused on writing intuitive API contracts, processing
                heavy business logic securely, and maintaining crystal-clear
                database integrity.
              </p>
            </div>
            <div className="p-8 space-y-4 hover:bg-surface/40 transition-colors duration-300 group">
              <div className="font-mono text-xs text-electricBlue font-bold">
                02 // DATA LAYERS & ORMS
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                Type-Safe Structures
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Designing explicit relational database schemas. Leveraging
                modern, type-safe data access layers like Drizzle ORM paired
                with Supabase to perform zero-overhead query pooling and precise
                data migrations.
              </p>
            </div>
            <div className="p-8 space-y-4 hover:bg-surface/40 transition-colors duration-300 group">
              <div className="font-mono text-xs text-stitchPurple-light font-bold">
                03 // INTERACTIVE LAYERS
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                Premium Workspaces
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Crafting clean, production-ready frontend layers inside Next.js
                and React. Engineered around structured theme mechanics,
                flexible custom CSS properties, and optimized scannable
                component hierarchies.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 border-b border-surfaceBorder/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-8">
              <div>
                <div className="text-4xl font-black text-white font-mono tracking-tight">
                  99.9%
                </div>
                <div className="text-xs uppercase font-mono tracking-wider text-slate-500 mt-1">
                  Automated System Uptime
                </div>
              </div>
              <div>
                <div className="text-4xl font-black text-stitchPurple-light font-mono tracking-tight">
                  12ms
                </div>
                <div className="text-xs uppercase font-mono tracking-wider text-slate-500 mt-1">
                  Average API Response Latency
                </div>
              </div>
              <div>
                <div className="text-4xl font-black text-electricBlue font-mono tracking-tight">
                  100%
                </div>
                <div className="text-xs uppercase font-mono tracking-wider text-slate-500 mt-1">
                  Type-Safe Operations via Drizzle ORM
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-surface p-6 rounded-md border border-surfaceBorder shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-surfaceBorder/60 pb-4 mb-4 font-mono text-xs">
                <span className="text-slate-400">
                  SYS_MONITOR // ACTIVE_STREAM
                </span>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
              </div>
              <div className="space-y-3 font-mono text-[11px] text-slate-400">
                <p className="text-emerald-400 animate-pulse">
                  &gt; INITIALIZING DATABASE STREAM... OK
                </p>
                <p className="text-electricBlue">
                  &gt; CONNECTING TO SUPABASE ENGINE POOL... STABLE
                </p>
                <p>&gt; RUNNING MIGRATION LOOPS: 0 ERRORS TRACED</p>
                <div className="pt-4 h-32 flex items-end gap-3 text-center">
                  <div className="w-full bg-stitchPurple/40 h-20 rounded-sm" />
                  <div className="w-full bg-electricBlue/50 h-28 rounded-sm" />
                  <div className="w-full bg-stitchPurple/30 h-14 rounded-sm" />
                  <div className="w-full bg-stitchPurple/60 h-24 rounded-sm" />
                  <div className="w-full bg-electricBlue/70 h-32 rounded-sm" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-2">
                  <span>SYSTEM_LOAD</span>
                  <span className="text-electricBlue">STATUS: OPTIMAL</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="ledger" className="py-20 border-b border-surfaceBorder/30">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-superWide text-electricBlue">
                // SHIPPED INFRASTRUCTURE
              </h2>
              <p className="text-3xl font-black text-white uppercase tracking-tight mt-2">
                THE EXPERIENCE LEDGER
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              A CHRONOLOGICAL RECORD OF WORKING PRODUCTION SYSTEMS
            </span>
          </div>

          <div className="border-t border-surfaceBorder/60 divide-y divide-surfaceBorder/60">
            <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-surface/10 px-2 transition-colors duration-200">
              <div className="lg:col-span-2 font-mono text-sm text-slate-500">
                2026 // STARTUP
              </div>
              <div className="lg:col-span-4">
                <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                  Yana Africa
                </h3>
                <p className="text-xs text-stitchPurple-light font-mono mt-1">
                  Capital Readiness Diagnostic Suite
                </p>
              </div>
              <div className="lg:col-span-4 text-sm text-slate-400">
                Engineered an enterprise financial evaluation instrument with
                complex multi-stage state management. Built analytical scoring
                algorithms that generate real-time metrics dashboards, mapping
                exact client capital readiness scores instantly.
              </div>
              <div className="lg:col-span-2 lg:text-right">
                <span className="inline-block px-2.5 py-1 text-[11px] font-mono border border-surfaceBorder bg-surface text-slate-400 rounded-sm">
                  Next.js // React
                </span>
              </div>
            </div>

            <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-surface/10 px-2 transition-colors duration-200">
              <div className="lg:col-span-2 font-mono text-sm text-slate-500">
                2026 // PRODUCTION
              </div>
              <div className="lg:col-span-4">
                <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                  Lynvista Safaris
                </h3>
                <p className="text-xs text-electricBlue font-mono mt-1">
                  Full-Stack Automation Engine
                </p>
              </div>
              <div className="lg:col-span-4 text-sm text-slate-400">
                Designed and built a full safari itinerary execution framework.
                Built automated quotation mechanics, stateful client booking
                management workflows, and a strict Paystack payment integration
                that preserves transactional data consistency.
              </div>
              <div className="lg:col-span-2 lg:text-right">
                <span className="inline-block px-2.5 py-1 text-[11px] font-mono border border-surfaceBorder bg-surface text-slate-400 rounded-sm">
                  Python // Flask
                </span>
              </div>
            </div>

            <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-surface/10 px-2 transition-colors duration-200">
              <div className="lg:col-span-2 font-mono text-sm text-slate-500">
                2026 // SIMULATION
              </div>
              <div className="lg:col-span-4">
                <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                  Midnight Gambit
                </h3>
                <p className="text-xs text-stitchPurple-light font-mono mt-1">
                  Stateful Object-Oriented Engine
                </p>
              </div>
              <div className="lg:col-span-4 text-sm text-slate-400">
                An advanced CLI and web backend poker gaming engine modeled via
                rigid object-oriented logic architecture. Handles stateful deck
                shuffles, real-time bet validation, and robust hand comparison
                loops securely.
              </div>
              <div className="lg:col-span-2 lg:text-right">
                <span className="inline-block px-2.5 py-1 text-[11px] font-mono border border-surfaceBorder bg-surface text-slate-400 rounded-sm">
                  OOP Python // Flask
                </span>
              </div>
            </div>

            <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-surface/10 px-2 transition-colors duration-200">
              <div className="lg:col-span-2 font-mono text-sm text-slate-500">
                2026 // ANALYTICS
              </div>
              <div className="lg:col-span-4">
                <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                  Jicho Lens
                </h3>
                <p className="text-xs text-electricBlue font-mono mt-1">
                  Live Ingestion Stream
                </p>
              </div>
              <div className="lg:col-span-4 text-sm text-slate-400">
                A highly optimized stream parsing architecture engineered to
                ingest dynamic system logs, capture operational pipeline delays,
                and filter signal telemetry into explicit metrics feeds.
              </div>
              <div className="lg:col-span-2 lg:text-right">
                <span className="inline-block px-2.5 py-1 text-[11px] font-mono border border-surfaceBorder bg-surface text-slate-400 rounded-sm">
                  Next.js // Stream
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="connect" className="py-24 max-w-4xl mx-auto">
          <div className="space-y-2 mb-12">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-emerald-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Secure Channel Open
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
              INITIATE CONNECTION
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <form
              className="md:col-span-7 space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] uppercase text-slate-500 tracking-wider">
                  SYSTEM NAME / ORGANIZATION
                </label>
                <input
                  type="text"
                  placeholder="Enter designation..."
                  className="w-full bg-surface/40 border border-surfaceBorder rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-electricBlue transition-colors font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] uppercase text-slate-500 tracking-wider">
                  RETURN ENDPOINT ADDRESS
                </label>
                <input
                  type="email"
                  placeholder="Return address..."
                  className="w-full bg-surface/40 border border-surfaceBorder rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-electricBlue transition-colors font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] uppercase text-slate-500 tracking-wider">
                  MESSAGE PAYLOAD
                </label>
                <textarea
                  rows={4}
                  placeholder="Transmitting data..."
                  className="w-full bg-surface/40 border border-surfaceBorder rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-electricBlue transition-colors font-mono resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-stitchPurple to-stitchPurple-light rounded-sm text-white font-mono text-xs uppercase tracking-superWide font-bold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(79,70,229,0.3)]"
              >
                SEND INQUIRY ➔
              </button>
            </form>

            <div className="md:col-span-5 space-y-8 font-mono text-xs">
              <div className="space-y-4">
                <h4 className="text-slate-500 uppercase tracking-wider">
                  // TRANSMISSION PROTOCOLS
                </h4>
                <div className="space-y-2 border-l-2 border-surfaceBorder pl-4">
                  <p className="flex justify-between">
                    <span className="text-slate-400">GITHUB</span>{" "}
                    <a
                      href="https://github.com/madoyakimberley"
                      target="_blank"
                      rel="noreferrer"
                      className="text-electricBlue hover:underline"
                    >
                      /madoyakimberley
                    </a>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">LINKEDIN</span>{" "}
                    <span className="text-slate-300">/in/kimberley-madoya</span>
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-slate-500 uppercase tracking-wider">
                  // DIRECT TERMINAL
                </h4>
                <p className="text-white font-bold text-sm select-all">
                  kimberleymadoya@gmail.com
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-surfaceBorder/40 bg-surface/10 py-12 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>
            © {new Date().getFullYear()} KIMBERLEY MADOYA. ALL RIGHTS RESERVED.
          </span>
          <div className="flex gap-6">
            <a
              href="https://github.com/madoyakimberley"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              SOURCE CODE
            </a>
            <span className="text-surfaceBorder">|</span>
            <span className="text-slate-400">BUILT WITH NEXT.JS 14</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

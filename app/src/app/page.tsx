"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Sparkles, Play, Download, Zap, Shield, Code } from "lucide-react";
import Link from "next/link";
import FloatingCode from "@/components/FloatingCode";
import InteractiveSphere from "@/components/InteractiveSphere";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    icon: Sparkles,
    title: "AI Code Generation",
    desc: "Describe your animation in plain English. AI writes the Manim code.",
    tag: "Gemini + Ollama",
  },
  {
    icon: Code,
    title: "Pro Code Editor",
    desc: "Monaco editor with syntax highlighting, autocomplete, and intellisense.",
    tag: "Monaco",
  },
  {
    icon: Play,
    title: "Instant Preview",
    desc: "See animations come to life in real-time. Iterate fast, ship faster.",
    tag: "Live",
  },
  {
    icon: Download,
    title: "Export Anything",
    desc: "Render 480p to 4K. MP4 or GIF. No watermarks. Completely free.",
    tag: "Free",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Cloud rendering on dedicated servers. Your laptop stays cool.",
    tag: "Cloud",
  },
  {
    icon: Shield,
    title: "Save & Sync",
    desc: "Save projects locally or to the cloud. Your code, your way.",
    tag: "Supabase",
  },
];

const heroCode = `from manim import *

class ManimEditor(Scene):
    def construct(self):
        title = Text("ManimEditor", font_size=72)
        title.set_color_by_gradient(BLUE, GOLD)

        circle = Circle(radius=2, color=BLUE)
        square = Square(side_length=3, color=GOLD)

        self.play(Write(title))
        self.play(title.animate.to_edge(UP))
        self.play(Create(circle))
        self.play(Transform(circle, square))
        self.play(FadeOut(square))`;

export default function HomePage() {
  return (
    <div className="relative">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <InteractiveSphere />
        <FloatingCode />

        <div className="max-w-5xl mx-auto px-6 py-24 relative" style={{ zIndex: 2 }}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} custom={0} className="flex justify-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border border-accent/20 bg-accent-glow text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Open Source &amp; Free Forever
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] leading-none mb-6"
            >
              <span className="gradient-text">Manim Code</span>
              <br />
              <span className="gradient-text-accent">Editor</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              custom={2}
              className="max-w-lg mx-auto text-base sm:text-lg text-text-secondary leading-relaxed mb-10"
            >
              Write beautiful math animations with AI assistance. Powered by{" "}
              <span className="font-semibold text-text">Manim</span>, the engine
              behind <span className="font-semibold text-text">3Blue1Brown</span>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/creator"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Start Creating
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/editor"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-surface text-text font-semibold text-sm border border-border hover:border-border-strong hover:bg-surface-hover transition-all duration-300"
              >
                <Code className="w-4 h-4" />
                Open Editor
              </Link>
            </motion.div>

            {/* Terminal */}
            <motion.div variants={fadeUp} custom={4} className="mt-8 flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-code-bg text-code-text font-mono text-xs">
                <span className="text-accent font-bold">$</span>
                <span>manim render scene.py -qh</span>
                <span className="cursor-blink" />
              </div>
            </motion.div>
          </motion.div>

          {/* Code Block */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 max-w-2xl mx-auto"
          >
            <div className="code-block">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#28ca41]" />
                </div>
                <span className="text-xs text-white/30 ml-2 font-mono">scene.py</span>
              </div>
              <pre className="text-sm leading-relaxed overflow-x-auto">
                <code>
                  {heroCode.split("\n").map((line, i) => (
                    <div key={i} className="flex">
                      <span className="w-8 text-right mr-4 text-white/20 select-none text-xs leading-relaxed">
                        {i + 1}
                      </span>
                      <span className="text-code-text">{line}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 relative" style={{ zIndex: 2 }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 gradient-text">
              Everything You Need
            </h2>
            <p className="text-text-muted max-w-md mx-auto">
              A complete toolkit for creating stunning mathematical animations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="p-5 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-accent-glow flex items-center justify-center shrink-0">
                    <f.icon className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-[10px] font-mono font-medium text-text-muted uppercase tracking-wider px-2 py-0.5 rounded bg-bg-alt">
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-semibold text-text text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 relative" style={{ zIndex: 2 }}>
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 gradient-text">
              How It Works
            </h2>
            <p className="text-text-muted max-w-md mx-auto">
              From idea to animation in three simple steps.
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Describe or Code",
                desc: "Tell the AI what you want to animate, or write Manim Python code directly.",
                code: '>>> "Visualize the Fourier transform of a square wave"',
              },
              {
                step: "02",
                title: "Preview & Tweak",
                desc: "See a live preview. Use the AI assistant to refine, or edit manually.",
                code: "self.play(Create(axes), Write(label))",
              },
              {
                step: "03",
                title: "Render & Export",
                desc: "Choose quality (480p → 4K), hit render, download. No watermarks, ever.",
                code: "$ manim render scene.py -qh --format mp4",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="flex gap-5 items-start p-5 rounded-2xl bg-surface border border-border"
              >
                <span className="text-3xl font-bold text-accent/20 font-mono shrink-0 leading-none mt-1">
                  {item.step}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text mb-1.5">{item.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed mb-3">{item.desc}</p>
                  <code className="inline-block px-3 py-1.5 rounded-lg bg-code-bg text-code-text font-mono text-xs">
                    {item.code}
                  </code>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 relative" style={{ zIndex: 2 }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 gradient-text">
              Ready to Create?
            </h2>
            <p className="text-text-muted max-w-md mx-auto mb-8">
              Start building beautiful mathematical animations today. Free,
              open-source, powered by the same engine as 3Blue1Brown.
            </p>
            <Link
              href="/creator"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Open the Creator
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border py-8 relative" style={{ zIndex: 2 }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center bg-accent/10 border border-accent/20">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 12C3 12 7 5 12 5C17 5 21 12 21 12C21 12 17 19 12 19C7 19 3 12 3 12Z"
                    className="stroke-accent"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="3" className="fill-accent-brown" />
                </svg>
              </div>
              <span className="font-bold text-sm text-text">
                Manim<span className="text-accent">Editor</span>
              </span>
            </div>
            <p className="text-xs text-text-muted text-center">
              Built by Mansoju Vivekananda @ 2026 · Thanks to{" "}
              <a
                href="https://www.youtube.com/@3blue1brown"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                3Blue1Brown
              </a>
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text transition-colors text-xs">
                GitHub
              </a>
              <a href="https://docs.manim.community/" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text transition-colors text-xs">
                Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

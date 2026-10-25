"use client";

import { motion } from "framer-motion";
import { GitBranch, ExternalLink, BookOpen, Code, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-text mb-2">About</h1>
          <p className="text-text-muted">The story behind ManimEditor, and the people who made it possible.</p>
        </div>

        {/* What is ManimEditor */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-accent" />
            What is ManimEditor?
          </h2>
          <div className="p-5 rounded-2xl bg-surface border border-border space-y-3">
            <p className="text-sm text-text-secondary leading-relaxed">
              ManimEditor is a free, open-source, AI-powered code editor for creating mathematical
              animations using <strong>Manim</strong> — the Python library originally created by
              Grant Sanderson (3Blue1Brown) for his iconic math videos.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Whether you&apos;re a math teacher, a student, a content creator, or just someone who
              loves beautiful visualizations, ManimEditor gives you the tools to bring equations
              and concepts to life — with no watermarks, no limits, completely free.
            </p>
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            Quick Start Guide
          </h2>
          <div className="space-y-3">
            {[
              {
                step: "1",
                title: "Open the Creator",
                desc: "Go to the Creator page and describe what animation you want. The AI will generate Manim Python code for you.",
              },
              {
                step: "2",
                title: "Edit in the Editor",
                desc: "Fine-tune the generated code in the built-in Monaco editor. Syntax highlighting and autocomplete are included.",
              },
              {
                step: "3",
                title: "Render & Export",
                desc: "Head to the Render page, pick your quality (480p to 4K), choose a format (MP4, GIF, WebM), and download.",
              },
              {
                step: "4",
                title: "Learn Manim",
                desc: 'Check out the official Manim documentation at docs.manim.community. Start with the "Quickstart" tutorial.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 p-4 rounded-xl bg-surface border border-border">
                <span className="text-2xl font-bold text-accent/20 font-mono shrink-0">{item.step}</span>
                <div>
                  <h3 className="font-semibold text-text text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Credits */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            Credits &amp; Acknowledgments
          </h2>
          <div className="space-y-3">
            {[
              {
                name: "3Blue1Brown (Grant Sanderson)",
                desc: "For creating Manim and inspiring millions to see the beauty in mathematics. This project exists because of your work.",
                link: "https://www.3blue1brown.com/",
              },
              {
                name: "Manim Community",
                desc: "For maintaining and evolving Manim into the incredible open-source tool it is today.",
                link: "https://www.manim.community/",
              },
              {
                name: "Next.js & Vercel",
                desc: "The framework and platform powering the frontend.",
                link: "https://nextjs.org/",
              },
              {
                name: "Supabase",
                desc: "Open-source Firebase alternative providing auth, database, and storage.",
                link: "https://supabase.com/",
              },
            ].map((credit) => (
              <a
                key={credit.name}
                href={credit.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border hover:border-accent/30 transition-all group"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-text text-sm group-hover:text-accent transition-colors flex items-center gap-1.5">
                    {credit.name}
                    <ExternalLink className="w-3 h-3 text-text-muted" />
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mt-1">{credit.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Footer Note */}
        <div className="text-center py-8 border-t border-border">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-accent transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5" />
            View on GitHub
          </a>
        </div>
      </motion.div>
    </div>
  );
}

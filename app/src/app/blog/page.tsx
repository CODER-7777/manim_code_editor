"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

const posts = [
  {
    slug: "getting-started-with-manim",
    title: "Getting Started with Manim",
    excerpt: "A beginner's guide to creating your first mathematical animation with Manim and Python.",
    date: "Aug 7, 2026",
    readTime: "5 min read",
    tag: "Tutorial",
  },
  {
    slug: "building-manim-editor",
    title: "Building ManimEditor: The Journey",
    excerpt: "How I built a full-stack AI-powered Manim code editor from scratch — the tech, the challenges, and lessons learned.",
    date: "Aug 5, 2026",
    readTime: "8 min read",
    tag: "Dev Log",
  },
  {
    slug: "fourier-series-visualization",
    title: "Visualizing Fourier Series",
    excerpt: "Using Manim to create beautiful visualizations of Fourier series decomposition and convergence.",
    date: "Aug 3, 2026",
    readTime: "6 min read",
    tag: "Math",
  },
  {
    slug: "3b1b-inspiration",
    title: "Why 3Blue1Brown Inspires Me",
    excerpt: "How Grant Sanderson's approach to mathematical storytelling shaped my love for visual math.",
    date: "Aug 1, 2026",
    readTime: "4 min read",
    tag: "Personal",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-text mb-2">Blog</h1>
          <p className="text-text-muted">Thoughts on math, code, and building things.</p>
        </div>

        <div className="space-y-4">
          {posts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group block p-5 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono font-medium text-accent uppercase tracking-wider px-2 py-0.5 rounded bg-accent-glow">
                    {post.tag}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-text mb-1 group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-text-muted leading-relaxed">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-accent group-hover:gap-2 transition-all">
                  Read more <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

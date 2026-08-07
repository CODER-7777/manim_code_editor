"use client";

import { motion } from "framer-motion";

const codeSnippets = [
  { text: "class Scene(Scene):", x: "8%", y: "25%", delay: 0 },
  { text: "self.play(Create(circle))", x: "72%", y: "18%", delay: 1.5 },
  { text: "axes = Axes()", x: "82%", y: "55%", delay: 0.8 },
  { text: "$ manim render scene.py", x: "6%", y: "65%", delay: 2.0 },
  { text: "Transform(square, circle)", x: "68%", y: "75%", delay: 1.2 },
  { text: 'MathTex(r"\\int_0^1")', x: "12%", y: "45%", delay: 0.5 },
];

export default function FloatingCode() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {codeSnippets.map((snippet, i) => (
        <motion.div
          key={i}
          className="absolute font-mono text-[11px] whitespace-nowrap select-none"
          style={{
            left: snippet.x,
            top: snippet.y,
            color: "var(--text-muted)",
            opacity: 0.12,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.12, y: 0 }}
          transition={{
            delay: snippet.delay + 1,
            duration: 1,
            ease: "easeOut",
          }}
        >
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 5 + i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block"
          >
            {snippet.text}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const symbols = [
  "∫", "∑", "π", "∞", "√", "θ", "Δ", "λ", "Ω", "μ", // Math
  "{ }", "< >", "</>", "()", "[]", ";", "=>", "==", // Code
];

export default function FloatingMath() {
  const [mounted, setMounted] = useState(false);
  const [elements, setElements] = useState<{ symbol: string; left: number; top: number; duration: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate random positions only on the client to avoid hydration mismatch
    const generated = Array.from({ length: 25 }).map(() => ({
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      left: Math.random() * 100,
      top: 10 + Math.random() * 90,
      duration: 20 + Math.random() * 30,
      delay: Math.random() * -20, // Negative delay so they start already moving
      size: 16 + Math.random() * 24,
    }));
    setElements(generated);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {elements.map((el, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: "10vh" }}
          animate={{
            opacity: [0, 0.2, 0.2, 0],
            y: ["10vh", "-20vh"],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: "linear",
          }}
          className="absolute text-accent/30 font-mono select-none"
          style={{ 
            left: `${el.left}%`,
            top: `${el.top}%`,
            fontSize: el.size 
          }}
        >
          {el.symbol}
        </motion.div>
      ))}
    </div>
  );
}

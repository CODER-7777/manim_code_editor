"use client";

import React, { useEffect, useRef } from "react";

interface MathPoint3D {
  baseX: number;
  baseY: number;
  baseZ: number;
  symbol: string;
  color: string;
  baseSize: number;
}

export default function InteractiveSphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // 3Blue1Brown Tribute Colors: 3 parts Blue, 1 part Brown
    const colors = [
      "rgba(37, 99, 235, 0.95)",    // 1. 3B1B Royal Blue
      "rgba(56, 189, 248, 0.95)",   // 2. 3B1B Electric Cyan
      "rgba(99, 102, 241, 0.90)",   // 3. 3B1B Deep Indigo Blue
      "rgba(196, 137, 82, 0.95)",   // 4. 3B1B Signature Warm Brown (1 part brown!)
    ];

    // Rich selection of mathematical symbols for the 3D sphere
    const mathSymbols = [
      "π", "∫", "∑", "∞", "√", "θ", "∇", "∂", "λ", "Δ",
      "e", "i", "dx", "ϕ", "Ω", "μ", "σ", "α", "β", "f(x)",
      "lim", "dt", "dy", "ζ", "∈", "∀", "≈", "≠", "≤", "≥"
    ];

    // Generate points distributed evenly over sphere surface using Fibonacci spiral
    const numPoints = 280;
    const radius = Math.min(width, height) * 0.35;
    const points: MathPoint3D[] = [];

    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y: 1 to -1
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push({
        baseX: x * radius,
        baseY: y * radius,
        baseZ: z * radius,
        symbol: mathSymbols[i % mathSymbols.length],
        // Exact 3:1 ratio (index % 4 === 3 is warm brown, others are blues)
        color: colors[i % colors.length],
        baseSize: 12 + (i % 5) * 2,
      });
    }

    // Mouse tracking state
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;
    let autoRot = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      mouseX = x;
      mouseY = y;
      targetRotY = (x / width) * 1.8;
      targetRotX = -(y / height) * 1.8;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth cursor tracking with physics damping
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;
      autoRot += 0.0025; // Gentle continuous idle rotation

      const cosY = Math.cos(rotY + autoRot);
      const sinY = Math.sin(rotY + autoRot);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Dynamic center that shifts fluidly toward the cursor
      const centerX = width / 2 + mouseX * 0.05;
      const centerY = height / 2 + mouseY * 0.05;

      // Soft glowing ball sphere backdrop (3Blue : 1Brown tribute)
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        15,
        centerX,
        centerY,
        radius * 1.25
      );
      glowGrad.addColorStop(0, "rgba(56, 189, 248, 0.20)");    // 3B1B Electric Cyan core
      glowGrad.addColorStop(0.45, "rgba(37, 99, 235, 0.12)");  // 3B1B Royal Blue body
      glowGrad.addColorStop(0.85, "rgba(196, 137, 82, 0.12)"); // 3B1B Warm Brown outer rim
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Project 3D points to 2D screen coordinates
      const fov = 500;
      const projected = points.map((p) => {
        // Rotate around Y
        const x1 = p.baseX * cosY - p.baseZ * sinY;
        const z1 = p.baseZ * cosY + p.baseX * sinY;

        // Rotate around X
        const y2 = p.baseY * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.baseY * sinX;

        // Perspective projection
        const scale = fov / (fov + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;

        // Alpha based on depth: closer symbols are bright, far ones fade
        const depthNorm = (z2 + radius) / (2 * radius);
        const alpha = Math.max(0.15, Math.min(1, depthNorm * 0.85 + 0.15));

        return {
          projX,
          projY,
          z: z2,
          scale,
          alpha,
          color: p.color,
          symbol: p.symbol,
          fontSize: Math.max(9, Math.round(p.baseSize * scale)),
        };
      });

      // Sort points so back symbols render before front symbols
      projected.sort((a, b) => a.z - b.z);

      // Render math symbols forming the 3D sphere
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (const p of projected) {
        ctx.font = `600 ${p.fontSize}px 'JetBrains Mono', 'Fira Code', monospace`;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillText(p.symbol, p.projX, p.projY);
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

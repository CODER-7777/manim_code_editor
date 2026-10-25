"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// Math symbols that trail behind the paper rocket
const trailSymbols = ["π", "∫", "∑", "∞", "√", "θ", "∇", "Δ", "λ", "e", "ϕ", "∂", "Ω", "α", "ζ"];

interface TrailParticle {
  id: number;
  symbol: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
  opacity: number;
  color: string;
}

// Paper Rocket SVG
function PaperRocket({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 16.5L2 22l5.5-2.5L4.5 16.5z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M12 2L4.5 16.5l7.5 3.5 7.5-3.5L12 2z"
        fill="currentColor"
      />
      <path
        d="M12 2v18"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.5"
      />
      <path
        d="M19.5 16.5L22 22l-5.5-2.5L19.5 16.5z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}

// Canvas-based trail particle system
function TrailCanvas({
  particles,
}: {
  particles: TrailParticle[];
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const renderParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.scale(p.scale, p.scale);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.font = "bold 18px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.symbol, 0, 0);
      ctx.restore();
    }
  }, [particles]);

  if (canvasRef.current) {
    renderParticles();
  }

  return (
    <canvas
      ref={(el) => {
        canvasRef.current = el;
        if (el) renderParticles();
      }}
      className="fixed inset-0 pointer-events-none z-[100]"
    />
  );
}

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [particles, setParticles] = useState<TrailParticle[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const particleIdRef = useRef(0);

  const supabase = createClient();

  // 3B1B tribute colors (3 blue : 1 brown)
  const trailColors = [
    "rgba(37, 99, 235, 0.9)",
    "rgba(56, 189, 248, 0.9)",
    "rgba(99, 102, 241, 0.85)",
    "rgba(196, 137, 82, 0.95)",
  ];

  const spawnTrailParticles = useCallback(
    (originX: number, originY: number) => {
      const newParticles: TrailParticle[] = [];

      for (let i = 0; i < 28; i++) {
        const angle = (Math.PI * 2 * i) / 28 + (Math.random() - 0.5) * 0.5;
        const speed = 3 + Math.random() * 7;
        newParticles.push({
          id: particleIdRef.current++,
          symbol: trailSymbols[Math.floor(Math.random() * trailSymbols.length)],
          x: originX + (Math.random() - 0.5) * 30,
          y: originY + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          rotation: Math.random() * 360,
          scale: 0.6 + Math.random() * 0.9,
          opacity: 0.9,
          color: trailColors[Math.floor(Math.random() * trailColors.length)],
        });
      }

      setParticles((prev) => [...prev, ...newParticles]);

      let frame = 0;
      const maxFrames = 90;

      const animate = () => {
        frame++;
        if (frame > maxFrames) {
          setParticles([]);
          return;
        }

        setParticles((prev) =>
          prev
            .map((p) => ({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              vy: p.vy + 0.12,
              vx: p.vx * 0.985,
              rotation: p.rotation + p.vx * 2,
              opacity: p.opacity * 0.97,
              scale: p.scale * 0.995,
            }))
            .filter((p) => p.opacity > 0.05)
        );

        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const btn = buttonRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      setLaunched(true);
      spawnTrailParticles(originX, originY);
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      setLaunched(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google") => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) setError(error.message);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 relative">
      {particles.length > 0 && <TrailCanvas particles={particles} />}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-text">Create account</h1>
          <p className="text-sm text-text-muted mt-1">
            Start writing Manim animations in seconds
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-500">{error}</p>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              className="overflow-hidden"
            >
              <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed">
                  Verification email sent. Please check your inbox to confirm your account.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google OAuth */}
        <button
          onClick={() => handleOAuthSignIn("google")}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-surface border border-border hover:border-accent/30 hover:bg-surface-hover transition-all text-sm font-medium text-text group"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center my-6">
          <div className="flex-1 border-t border-border" />
          <span className="px-3 text-[11px] text-text-muted uppercase tracking-widest">
            or
          </span>
          <div className="flex-1 border-t border-border" />
        </div>

        {/* Email form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-2.5 bg-bg-alt border border-border rounded-lg outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all text-sm placeholder:text-text-muted"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-2.5 bg-bg-alt border border-border rounded-lg outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all text-sm placeholder:text-text-muted"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 bg-bg-alt border border-border rounded-lg outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all text-sm placeholder:text-text-muted"
              />
            </div>
          </div>

          <motion.button
            ref={buttonRef}
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-accent text-white font-medium text-sm rounded-lg hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence mode="wait">
              {launched ? (
                <motion.span
                  key="rocket"
                  className="flex items-center gap-2"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1, y: -60 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.span
                    animate={{ rotate: -45 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PaperRocket className="w-5 h-5" />
                  </motion.span>
                  Creating account...
                </motion.span>
              ) : loading ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Creating account...
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Create account
                  <motion.svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="w-4 h-4"
                    whileHover={{ x: 3 }}
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>

        <p className="mt-6 text-center text-xs text-text-muted">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-medium text-accent hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

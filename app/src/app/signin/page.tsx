"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail, Lock, GitBranch } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-3xl bg-surface border border-border shadow-2xl relative z-10 overflow-hidden"
      >
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-accent/10 blur-[50px] rounded-full pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-text-muted">Sign in to continue creating animations.</p>
        </div>

        <form className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-bg-alt border border-border rounded-xl outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-bg-alt border border-border rounded-xl outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input type="checkbox" className="rounded border-border bg-bg-alt text-accent focus:ring-accent/50" />
              Remember me
            </label>
            <a href="#" className="text-sm font-medium text-accent hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="button"
            className="w-full py-3 px-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-all flex items-center justify-center gap-2 group shadow-lg shadow-accent/20"
          >
            Sign In
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 relative z-10">
          <div className="relative flex items-center justify-center text-sm">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative px-4 bg-surface text-text-muted">Or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button className="flex items-center justify-center gap-2 py-2.5 bg-bg-alt border border-border rounded-xl hover:bg-surface-hover transition-all text-sm font-medium text-text-secondary">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 bg-bg-alt border border-border rounded-xl hover:bg-surface-hover transition-all text-sm font-medium text-text-secondary">
              <GitBranch className="w-5 h-5 text-text" />
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-text-muted relative z-10">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

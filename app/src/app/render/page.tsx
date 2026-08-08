"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Download, Film, Monitor, Smartphone, CheckCircle2, AlertCircle } from "lucide-react";

const qualities = [
  { id: "480p", label: "480p", desc: "Low — fast render", fps: 15, flag: "-ql" },
  { id: "720p", label: "720p", desc: "Medium quality", fps: 30, flag: "-qm" },
  { id: "1080p", label: "1080p", desc: "Full HD", fps: 60, flag: "-qh" },
  { id: "4k", label: "4K", desc: "Ultra HD — slow", fps: 60, flag: "-qp" },
];

const formats = [
  { id: "mp4", label: "MP4", icon: Film },
  { id: "gif", label: "GIF", icon: Monitor },
  { id: "webm", label: "WebM", icon: Smartphone },
];

export default function RenderPage() {
  const [quality, setQuality] = useState("1080p");
  const [format, setFormat] = useState("mp4");
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    const savedCode = localStorage.getItem("manim-editor-code");
    setCode(savedCode);
  }, []);

  const startRender = async () => {
    if (!code) {
      setError("No code found! Go to the Editor page, write your code, and save it first.");
      return;
    }

    setIsRendering(true);
    setProgress(0);
    setIsDone(false);
    setError(null);
    setVideoUrl(null);

    // Animate the progress bar while we wait for the real render
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return 90; // Cap at 90% until real completion
        return p + Math.random() * 3 + 1;
      });
    }, 500);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, project_id: `render_${Date.now()}` }),
      });

      if (!response.ok) throw new Error("Failed to start render");

      const { task_id } = await response.json();

      const poll = setInterval(async () => {
        try {
          const statusRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/status/${task_id}`);
          const statusData = await statusRes.json();

          if (statusData.status === "SUCCESS") {
            clearInterval(poll);
            clearInterval(progressInterval);
            setProgress(100);

            setTimeout(() => {
              setIsRendering(false);
              setIsDone(true);

              if (statusData.result && statusData.result.video_url) {
                setVideoUrl(statusData.result.video_url);
              } else if (statusData.result && statusData.result.error) {
                setError(statusData.result.error);
              }
            }, 400);
          } else if (statusData.status === "FAILURE") {
            clearInterval(poll);
            clearInterval(progressInterval);
            setIsRendering(false);
            setError("Render failed on the server. Check your Manim code for errors.");
          }
        } catch {
          clearInterval(poll);
          clearInterval(progressInterval);
          setIsRendering(false);
          setError("Lost connection to the render server.");
        }
      }, 2000);
    } catch {
      clearInterval(progressInterval);
      setIsRendering(false);
      setError("Could not connect to the render server. Is it running?");
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `manim-render.${format}`;
    a.target = "_blank";
    a.click();
  };

  const selectedQ = qualities.find((q) => q.id === quality)!;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight gradient-text mb-2">Render</h1>
          <p className="text-text-muted">Choose quality and format, then export your animation.</p>
          {!code && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
              <p className="text-xs text-yellow-200">No code loaded. Go to the <a href="/editor" className="underline font-semibold">Editor</a> and save your code first.</p>
            </div>
          )}
        </div>

        {/* Quality Selection */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-text mb-3">Quality</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {qualities.map((q) => (
              <button
                key={q.id}
                onClick={() => setQuality(q.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  quality === q.id
                    ? "border-accent bg-accent-glow"
                    : "border-border bg-surface hover:border-border-strong"
                }`}
              >
                <span className="text-lg font-bold text-text block">{q.label}</span>
                <span className="text-xs text-text-muted">{q.desc}</span>
                <span className="text-[10px] text-text-muted block mt-1 font-mono">{q.fps} FPS</span>
              </button>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-text mb-3">Format</h2>
          <div className="flex gap-3">
            {formats.map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
                  format === f.id
                    ? "border-accent bg-accent-glow"
                    : "border-border bg-surface hover:border-border-strong"
                }`}
              >
                <f.icon className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-text">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Command Preview */}
        <div className="mb-8 p-4 rounded-xl bg-code-bg border border-border">
          <p className="text-xs text-white/40 mb-1 font-mono">Command:</p>
          <code className="text-sm text-code-text font-mono">
            $ manim render scene.py {selectedQ.flag} --format {format}
          </code>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Render Button / Progress */}
        {!isRendering && !isDone && (
          <button
            onClick={startRender}
            disabled={!code}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" />
            Start Render — {selectedQ.label} {format.toUpperCase()}
          </button>
        )}

        {isRendering && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Rendering on cloud...</span>
              <span className="font-mono text-accent">{Math.min(Math.round(progress), 100)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-bg-alt overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-accent"
                style={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <p className="text-xs text-text-muted font-mono">
              Rendering at {selectedQ.label} · {selectedQ.fps}fps · {format.toUpperCase()}
            </p>
          </div>
        )}

        {isDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text mb-2">Render Complete!</h3>
            <p className="text-sm text-text-muted mb-6">
              Your {selectedQ.label} {format.toUpperCase()} is ready.
            </p>

            {videoUrl && (
              <div className="mb-6">
                <video src={videoUrl} controls autoPlay className="w-full max-w-md mx-auto rounded-lg shadow-lg border border-border" />
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleDownload}
                disabled={!videoUrl}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover transition-all disabled:opacity-40"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={() => {
                  setIsDone(false);
                  setProgress(0);
                  setVideoUrl(null);
                  setError(null);
                }}
                className="px-6 py-3 rounded-xl bg-surface border border-border text-text text-sm font-medium hover:bg-surface-hover transition-all"
              >
                Render Again
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

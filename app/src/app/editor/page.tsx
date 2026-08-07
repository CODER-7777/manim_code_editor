"use client";

import { useState } from "react";
import {
  Play,
  Save,
  Download,
  RotateCcw,
  Settings,
  Terminal,
  Maximize2,
  ChevronDown,
} from "lucide-react";

const defaultCode = `from manim import *

class MyScene(Scene):
    def construct(self):
        # Create objects
        circle = Circle(radius=2, color=BLUE)
        square = Square(side_length=3, color=GOLD)
        
        # Animate
        self.play(Create(circle))
        self.play(Transform(circle, square))
        self.play(square.animate.scale(0.5))
        self.play(FadeOut(square))
`;

export default function EditorPage() {
  const [code, setCode] = useState(defaultCode);
  const [consoleOutput, setConsoleOutput] = useState("Ready. Write your Manim code and click Run.\n");
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [fileName, setFileName] = useState("scene.py");

  const handleRun = () => {
    setIsRunning(true);
    setConsoleOutput((prev) => prev + `\n$ manim render ${fileName} -ql\n`);

    setTimeout(() => {
      setConsoleOutput((prev) => prev + "Manim Community v0.18.0\n");
    }, 400);
    setTimeout(() => {
      setConsoleOutput((prev) => prev + "[08/07/26 13:50:00] INFO  Rendering scene...\n");
    }, 800);
    setTimeout(() => {
      setConsoleOutput(
        (prev) =>
          prev +
          "[08/07/26 13:50:03] INFO  File ready at media/videos/scene/480p15/MyScene.mp4\n\n✓ Render complete!\n"
      );
      setIsRunning(false);
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface shrink-0">
        <div className="flex items-center gap-2">
          {/* File name */}
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-bg-alt text-xs font-mono text-text-secondary">
            <span>📄</span>
            <input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="bg-transparent border-none outline-none w-24 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-all disabled:opacity-50"
          >
            <Play className="w-3 h-3" />
            {isRunning ? "Running..." : "Run"}
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover transition-all" title="Save">
            <Save className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover transition-all" title="Download">
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCode(defaultCode)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover transition-all"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover transition-all" title="Settings">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Editor Pane */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-border">
          {/* Editor Header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-surface border-b border-border">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <span className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            <span className="text-xs text-text-muted font-mono ml-2">{fileName}</span>
          </div>

          {/* Code Editor (textarea for now, Monaco integration later) */}
          <div className="flex-1 relative bg-bg">
            <div className="absolute inset-0 flex">
              {/* Line numbers */}
              <div className="w-10 bg-surface border-r border-border py-3 select-none overflow-hidden">
                {code.split("\n").map((_, i) => (
                  <div key={i} className="text-right pr-2.5 text-[11px] text-text-muted/50 leading-relaxed font-mono">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Text area */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-transparent text-text p-3 font-mono text-[13px] leading-relaxed resize-none outline-none"
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Preview Pane */}
        <div className="w-full lg:w-[40%] flex flex-col shrink-0 bg-bg">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Preview</span>
            <button className="w-6 h-6 rounded flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover transition-all">
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>

          {/* Preview Area */}
          <div className="flex-1 flex items-center justify-center p-8 min-h-[200px]">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-surface border border-border shadow-sm mx-auto mb-4 flex items-center justify-center">
                <Play className="w-8 h-8 text-accent/50" />
              </div>
              <p className="text-sm font-medium text-text-secondary">Click Run to see preview</p>
              <p className="text-xs text-text-muted mt-1">Output will appear here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Console */}
      <div className={`border-t border-border bg-surface shrink-0 transition-all ${consoleOpen ? "h-48" : "h-10"}`}>
        <button
          onClick={() => setConsoleOpen(!consoleOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-text-secondary hover:text-text hover:bg-surface-hover transition-colors"
        >
          <span className="flex items-center gap-2 font-semibold tracking-wide uppercase">
            <Terminal className="w-3.5 h-3.5" />
            Console
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${consoleOpen ? "" : "rotate-180"}`} />
        </button>
        {consoleOpen && (
          <div className="px-4 pb-4 overflow-y-auto h-[calc(100%-36px)] bg-bg">
            <pre className="text-xs text-text-secondary font-mono leading-relaxed whitespace-pre-wrap pt-3">
              {consoleOutput}
              {isRunning && <span className="inline-block w-2 h-3 bg-accent animate-pulse ml-1 align-middle" />}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

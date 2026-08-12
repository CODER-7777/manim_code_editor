"use client";

import { useState, useEffect } from "react";
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
import Editor from "@monaco-editor/react";

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
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Persist code to localStorage so Render page can access it
  useEffect(() => {
    localStorage.setItem("manim-editor-code", code);
  }, [code]);

  const handleRun = async () => {
    setIsRunning(true);
    setConsoleOutput((prev) => prev + `\n$ manim render ${fileName} -ql\n`);
    setVideoUrl(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, project_id: "temp_project" }),
      });

      if (!response.ok) throw new Error("Failed to start render");
      
      const { task_id } = await response.json();
      setConsoleOutput((prev) => prev + `[INFO] Uploaded code to cloud. Task ID: ${task_id}\n`);

      const poll = setInterval(async () => {
        try {
          const statusRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/status/${task_id}`);
          const statusData = await statusRes.json();

          setConsoleOutput((prev) => prev + `[STATUS] ${statusData.status}...\n`);

          if (statusData.status === "SUCCESS") {
            clearInterval(poll);
            setIsRunning(false);
            
            if (statusData.result && statusData.result.video_url) {
                setConsoleOutput((prev) => prev + `\n✓ Render complete! Video ready.\n`);
                setVideoUrl(statusData.result.video_url);
            } else if (statusData.result && statusData.result.error) {
                setConsoleOutput((prev) => prev + `\n❌ Error: ${statusData.result.error}\n`);
                if (statusData.result.details) {
                    setConsoleOutput((prev) => prev + `${statusData.result.details}\n`);
                }
            }
          } else if (statusData.status === "FAILURE") {
            clearInterval(poll);
            setIsRunning(false);
            setConsoleOutput((prev) => prev + `\n❌ Render failed!\n`);
          }
        } catch (e) {
          clearInterval(poll);
          setIsRunning(false);
          setConsoleOutput((prev) => prev + `\n❌ Polling error: ${e}\n`);
        }
      }, 2000);
    } catch (e) {
      setIsRunning(false);
      setConsoleOutput((prev) => prev + `\n❌ Error: ${e}\n`);
    }
  };

  const handleSave = () => {
    const blob = new Blob([code], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadVideo = () => {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `${fileName.replace(".py", "")}.mp4`;
    a.target = "_blank";
    a.click();
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
          <button onClick={handleSave} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover transition-all" title="Save code as .py">
            <Save className="w-4 h-4" />
          </button>
          <button onClick={handleDownloadVideo} disabled={!videoUrl} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${videoUrl ? 'text-text-muted hover:text-text hover:bg-surface-hover' : 'text-text-muted/30 cursor-not-allowed'}`} title="Download video">
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

          {/* Code Editor */}
          <div className="flex-1 relative bg-[#1e1e1e]">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Courier New', Courier, monospace",
                wordWrap: "on",
                automaticLayout: true,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
              }}
            />
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
            {videoUrl ? (
              <video src={videoUrl} controls autoPlay className="w-full rounded-lg shadow-lg border border-border" />
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-surface border border-border shadow-sm mx-auto mb-4 flex items-center justify-center">
                  <Play className="w-8 h-8 text-accent/50" />
                </div>
                <p className="text-sm font-medium text-text-secondary">Click Run to see preview</p>
                <p className="text-xs text-text-muted mt-1">Output will appear here</p>
              </div>
            )}
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

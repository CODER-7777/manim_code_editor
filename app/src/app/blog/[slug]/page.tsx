import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";

interface PostData {
  title: string;
  date: string;
  readTime: string;
  tag: string;
  content: string;
}

const articles: Record<string, PostData> = {
  "getting-started-with-manim": {
    title: "Getting Started with Manim",
    date: "Aug 7, 2026",
    readTime: "5 min read",
    tag: "Tutorial",
    content: `
Manim (Mathematical Animation Engine) is a Python library for creating programmatic mathematical animations, originally developed by Grant Sanderson for the YouTube channel 3Blue1Brown.

### The Basic Anatomy of a Scene

Every animation in Manim begins with a class that inherits from \`Scene\`. The entry point where your animation logic runs is the \`construct\` method:

\`\`\`python
from manim import *

class IntroductionScene(Scene):
    def construct(self):
        # 1. Create mathematical objects (Mobjects)
        title = Text("Hello Manim!", font_size=60)
        title.set_color(BLUE)
        
        circle = Circle(radius=1.5, color=GOLD)
        square = Square(side_length=2.5, color=RED)
        
        # 2. Animate objects on screen
        self.play(Write(title))
        self.play(title.animate.to_edge(UP))
        self.play(Create(circle))
        self.play(Transform(circle, square))
        self.wait(1)
        self.play(FadeOut(square), FadeOut(title))
\`\`\`

### Key Concepts to Remember

1. **Mobjects (Mathematical Objects):** Everything you see on screen — shapes, equations, coordinate systems, arrows, and graphs — is a Mobject.
2. **Animations:** Operations like \`Create\`, \`Transform\`, \`FadeIn\`, and \`Rotate\` determine how Mobjects evolve across time.
3. **The \`self.play()\` loop:** Each call to \`self.play\` animates one or more actions simultaneously. You control pacing using \`self.wait(seconds)\`.
`,
  },
  "building-manim-editor": {
    title: "Building ManimEditor: The Journey",
    date: "Aug 5, 2026",
    readTime: "8 min read",
    tag: "Dev Log",
    content: `
Building an in-browser code editor and cloud rendering pipeline for Python-based mathematical animations requires balancing fast frontend interactivity with heavyweight rendering backends.

### System Architecture

1. **Frontend (Next.js 16 + React 19):**
   - Monaco Editor integration for desktop-grade Python editing, syntax tree inspection, and auto-indentation.
   - Clean minimalist interface utilizing CSS variables and modern CSS design tokens.
   - Auth and session management backed by Supabase.

2. **Render Worker Backend:**
   - Isolated container environments with Python 3.11, Manim Community v0.18, FFmpeg, and LaTeX pre-installed.
   - Job queue architecture to process rendering requests asynchronously without locking the UI.

3. **AI Copilot:**
   - Context-aware prompt engineering to generate correct Manim syntax and verify coordinate positions.
`,
  },
  "fourier-series-visualization": {
    title: "Visualizing Fourier Series",
    date: "Aug 3, 2026",
    readTime: "6 min read",
    tag: "Math",
    content: `
Fourier analysis shows that any periodic waveform can be decomposed into an infinite sum of simple sines and cosines with specific frequencies, amplitudes, and phases.

### Epicycles in Manim

In complex analysis, a sum of rotating vectors can trace any closed 2D shape:

$$f(t) = \\sum_{n=-\\infty}^{\\infty} c_n e^{i n \\omega t}$$

By computing the discrete Fourier transform of a closed polygon or path, we can create rotating vectors (epicycles) whose tip draws the target illustration in real time.

\`\`\`python
from manim import *

class FourierEpicycles(Scene):
    def construct(self):
        axes = Axes(x_range=[-4, 4], y_range=[-3, 3])
        curve = axes.plot(lambda x: np.sin(x) + 0.33 * np.sin(3*x), color=YELLOW)
        
        label = MathTex(r"f(x) = \\sin(x) + \\frac{1}{3}\\sin(3x)")
        label.to_edge(UP)
        
        self.play(Create(axes), Write(label))
        self.play(Create(curve), run_time=3)
        self.wait(1)
\`\`\`
`,
  },
  "3b1b-inspiration": {
    title: "Why 3Blue1Brown Inspires Me",
    date: "Aug 1, 2026",
    readTime: "4 min read",
    tag: "Personal",
    content: `
Mathematics is often taught as an abstract manipulation of symbols according to arbitrary rules. Grant Sanderson's work on 3Blue1Brown revolutionized how millions of people visualize and understand complex mathematical topics.

### The Philosophy of Geometric Intuition

Before writing down an algebraic proof, having an intuitive geometric mental model allows you to anticipate why a theorem must be true.

When watching an animation of linear transformations stretching and rotating space, determinants stop being a tedious formula and naturally become the signed scaling factor of area. Eigenvectors transform from abstract algebraic roots into invariant axes of directional stability.

Our mission with ManimEditor is to empower developers, educators, and students around the world to produce these mind-expanding visualizations with zero friction.
`,
  },
};

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = articles[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to all articles
      </Link>

      <header className="mb-10 pb-8 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-accent uppercase tracking-wider px-2 py-0.5 rounded bg-accent-glow">
            <Tag className="w-3 h-3" /> {post.tag}
          </span>
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Calendar className="w-3.5 h-3.5" /> {post.date}
          </span>
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Clock className="w-3.5 h-3.5" /> {post.readTime}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text leading-tight">
          {post.title}
        </h1>
      </header>

      <article className="prose prose-neutral dark:prose-invert max-w-none text-text-secondary leading-relaxed space-y-6">
        {post.content.split("\n\n").map((block, idx) => {
          const trimmed = block.trim();
          if (trimmed.startsWith("### ")) {
            return (
              <h3 key={idx} className="text-xl font-bold text-text mt-8 mb-3">
                {trimmed.replace("### ", "")}
              </h3>
            );
          }
          if (trimmed.startsWith("```python")) {
            const code = trimmed
              .replace("```python\n", "")
              .replace("\n```", "");
            return (
              <pre
                key={idx}
                className="p-4 rounded-xl bg-code-bg border border-border text-xs sm:text-sm font-mono text-code-text overflow-x-auto"
              >
                <code>{code}</code>
              </pre>
            );
          }
          if (trimmed.startsWith("```bash")) {
            const code = trimmed.replace("```bash\n", "").replace("\n```", "");
            return (
              <pre
                key={idx}
                className="p-4 rounded-xl bg-code-bg border border-border text-xs sm:text-sm font-mono text-code-text overflow-x-auto"
              >
                <code>{code}</code>
              </pre>
            );
          }
          return (
            <p key={idx} className="text-base text-text-secondary leading-relaxed">
              {trimmed}
            </p>
          );
        })}
      </article>
    </div>
  );
}

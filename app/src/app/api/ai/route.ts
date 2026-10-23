import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, provider = "gemini" } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string." },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert mathematical animation engineer using Manim (Community Edition v0.18+).
Generate clean, production-ready Python code using Manim.
Guidelines:
1. Include all necessary imports: 'from manim import *'.
2. Use standard modern Manim syntax (Circle, Square, MathTex, Create, Transform, FadeOut).
3. Keep the scene name as 'GeneratedScene(Scene)'.
4. Provide a brief 1-2 sentence explanation before or after the code block.
5. Format code inside triple backtick python code blocks.`;

    if (provider === "gemini") {
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return NextResponse.json({
          response: `### ℹ️ Gemini API Key Not Configured\n\nTo enable live AI generation with Google Gemini, set \`GEMINI_API_KEY\` in your \`.env.local\` file:\n\`\`\`bash\nGEMINI_API_KEY="your-google-ai-api-key"\n\`\`\`\n\nHere is a clean starter template for **"${prompt.trim()}"**:\n\n\`\`\`python\nfrom manim import *\n\nclass GeneratedScene(Scene):\n    def construct(self):\n        title = Text("${prompt.trim().replace(/"/g, '\\"')}", font_size=36)\n        title.to_edge(UP)\n        \n        circle = Circle(radius=1.8, color=BLUE)\n        square = Square(side_length=2.5, color=GOLD)\n        \n        self.play(Write(title))\n        self.play(Create(circle))\n        self.play(Transform(circle, square))\n        self.wait(1)\n\`\`\`\n\nYou can click **"Copy Code"** and run it in the Editor.`,
        });
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemPrompt}\n\nUser Request: ${prompt}` },
                ],
              },
            ],
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        return NextResponse.json(
          { error: `Gemini API error: ${res.statusText}`, details: errText },
          { status: res.status }
        );
      }

      const data = await res.json();
      const generatedText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response generated from Gemini.";

      return NextResponse.json({ response: generatedText });
    }

    if (provider === "ollama") {
      try {
        const ollamaRes = await fetch("http://localhost:11434/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "codellama",
            prompt: `${systemPrompt}\n\nUser Request: ${prompt}`,
            stream: false,
          }),
        });

        if (!ollamaRes.ok) {
          throw new Error("Ollama returned non-200 status");
        }

        const ollamaData = await ollamaRes.json();
        return NextResponse.json({
          response: ollamaData.response || "No response generated from Ollama.",
        });
      } catch (err: any) {
        return NextResponse.json({
          response: `### ℹ️ Local Ollama Not Reachable\n\nCould not connect to a local Ollama daemon at \`http://localhost:11434\`.\nMake sure Ollama is installed and running:\n\`\`\`bash\nollama run codellama\n\`\`\`\n\nHere is a starter template for **"${prompt.trim()}"**:\n\n\`\`\`python\nfrom manim import *\n\nclass GeneratedScene(Scene):\n    def construct(self):\n        title = Text("${prompt.trim().replace(/"/g, '\\"')}", font_size=36)\n        title.to_edge(UP)\n        \n        axes = Axes(x_range=[-3, 3, 1], y_range=[-2, 2, 1])\n        graph = axes.plot(lambda x: 0.5 * x**2, color=BLUE)\n        \n        self.play(Write(title))\n        self.play(Create(axes), Create(graph))\n        self.wait(1)\n\`\`\``,
        });
      }
    }

    return NextResponse.json({ error: "Unsupported AI provider" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", message: error?.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { translateToUrdu } from "@/lib/translate";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    console.log("✅ URL received:", url);

    // Scrape blog using cheerio
    const res = await fetch(url);
    const html = await res.text();

    const cheerio = (await import("cheerio")).load(html);
    const paragraphs = cheerio("p")
      .map((_, el) => cheerio(el).text())
      .get()
      .join(" ");
    const plainText = paragraphs.slice(0, 3000); // Limit chars

    console.log("📝 Scraped text (500 chars):", plainText.slice(0, 500));

    // HuggingFace Summarization
    const hfRes = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: plainText }),
    });

    const result = await hfRes.json();
    const summary = result[0]?.summary_text;

    if (!summary) throw new Error("Failed to generate summary");

    // Translate summary to Urdu
    const urdu = translateToUrdu(summary);

    console.log("🧠 Summary:", summary);
    console.log("🌐 Urdu Translation:", urdu);

    return NextResponse.json({ summary, urdu });
  } catch (error) {
    console.error("🔥 Error in summarise API:", error);
    return NextResponse.json({ error: "Failed to summarise" }, { status: 500 });
  }
}

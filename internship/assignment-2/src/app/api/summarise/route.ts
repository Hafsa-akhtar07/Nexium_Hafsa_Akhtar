// import { NextResponse } from "next/server";
// import { translateToUrdu } from "@/lib/translate";
// import { MongoClient } from "mongodb";
// import { createClient } from "@supabase/supabase-js";

// export async function POST(req: Request) {
//   try {
//     const { url } = await req.json();
//     if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

//     console.log("✅ URL received:", url);

//     // 1. Scrape blog content using cheerio
//     const res = await fetch(url);
//     const html = await res.text();
//     const cheerio = (await import("cheerio")).load(html);
//     const paragraphs = cheerio("p")
//       .map((_, el) => cheerio(el).text())
//       .get()
//       .join(" ");
//     const plainText = paragraphs.slice(0, 3000);

//     console.log("📝 Scraped text (500 chars):", plainText.slice(0, 500));

//     // 2. Send to HuggingFace for summary
//     const hfRes = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ inputs: plainText }),
//     });

//     const result = await hfRes.json();
//     const summary = result[0]?.summary_text;
//     if (!summary) throw new Error("Failed to generate summary");

//     // 3. Translate summary to Urdu
//     // const urdu = translateToUrdu(summary);
//     const urdu = await translateToUrdu(summary);

// const brief = summary.split(". ").slice(0, 1).join(". ") + ".";
// const bullets = summary.split(". ").map((point: string) => `• ${point.trim()}`).filter((p: string) => p.length > 5);
// const tldr = summary.slice(-150); // or pick first/last sentence

//     // 4. Save full blog in MongoDB
//     const mongoClient = new MongoClient(process.env.MONGODB_URI!);

// await mongoClient.connect();

// const mongoDb = mongoClient.db("blog_summaries");
// const mongoCollection = mongoDb.collection("blogs");

// await mongoCollection.insertOne({
//   url,
//   fullText: plainText,
//   createdAt: new Date(),
// });


//     await mongoClient.close();

//     // 5. Save summary + urdu in Supabase
//     const supabase = createClient(
//       "https://ruwaaywyobhsviwyxwfk.supabase.co", // static part of your Supabase project
//       process.env.SUPABASE_ANON_KEY!
//     );

//     const { error: supabaseError } = await supabase
//       .from("summaries")
//       .insert([{ url, summary, urdu }]);

//     if (supabaseError) throw new Error("Supabase insert failed: " + supabaseError.message);

//     return NextResponse.json({ summary, urdu ,
//   brief,
//   bullets,
//   tldr}
 
//     );
//   } catch (error) {
//     console.error("🔥 Error in summarise API:", error);
//     return NextResponse.json({ error: "Failed to summarise" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {

  const mongoUri = process.env.MONGODB_URI;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!mongoUri || !supabaseKey) {
    console.error("❌ Missing required environment variables");
    return NextResponse.json({ error: "Server misconfiguration (env vars)" }, { status: 500 });
  }

  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    // Scrape HTML
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
const res = await fetch(proxyUrl);

    const html = await res.text();
    const cheerio = (await import("cheerio")).load(html);
    const paragraphs = cheerio("p").map((_, el) => cheerio(el).text()).get().join(" ");
    const plainText = paragraphs.slice(0, 3000);

    if (!plainText || plainText.length < 50) {
      throw new Error("Blog content too short or empty.");
    }

    const summary = plainText.split(". ").slice(3, 7).join(". ") + ".";
    const urdu = "یہ خلاصہ ایک ڈیمو ترجمہ ہے۔"; // static fake translation
    const brief = summary.split(". ")[0] + ".";
    const bullets = summary.split(". ").map(s => `• ${s}`).filter(s => s.length > 5);
    const tldr = summary.slice(-150);

    const mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    await mongoClient.db("blog_summaries").collection("blogs").insertOne({
      url,
      fullText: plainText,
      createdAt: new Date(),
    });
    await mongoClient.close();

    const supabase = createClient("https://ruwaaywyobhsviwyxwfk.supabase.co", supabaseKey);
    const { error: supabaseError } = await supabase.from("summaries").insert([{ url, summary, urdu }]);
    if (supabaseError) {
      throw new Error("❌ Supabase insert failed: " + supabaseError.message);
    }

    return NextResponse.json({ summary, urdu, brief, bullets, tldr });
  } catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error("🔥 FINAL ERROR:", message);
  return NextResponse.json({ error: message }, { status: 500 });
}
}

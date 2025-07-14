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
import { translateToUrdu } from "@/lib/translate";
import { MongoClient } from "mongodb";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  console.log("🚀 API /summarise triggered");

  // Log all required envs
  console.log("🔐 ENV VARS:", {
    HUGGINGFACE_API_KEY: !!process.env.HUGGINGFACE_API_KEY,
    MONGODB_URI: !!process.env.MONGODB_URI,
    SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
  });

  try {
    const { url } = await req.json();
    if (!url) {
      console.error("❌ URL missing in request");
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // 1. Scrape blog text
    const res = await fetch(url);
    const html = await res.text();
    const cheerio = (await import("cheerio")).load(html);
    const paragraphs = cheerio("p").map((_, el) => cheerio(el).text()).get().join(" ");
    const plainText = paragraphs.slice(0, 3000);

    if (!plainText || plainText.length < 100) {
      throw new Error("Scraped content is too short or empty");
    }

    console.log("📄 Scraped blog text:", plainText.slice(0, 200));

    // 2. Summarize using HuggingFace
    const hfRes = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: plainText }),
    });

    const hfResult = await hfRes.json();
    console.log("🧠 HuggingFace raw response:", hfResult);

    const summary = hfResult[0]?.summary_text;
    if (!summary) {
      throw new Error("HuggingFace summary failed. Check model or API key.");
    }

    // 3. Translate
    const urdu = await translateToUrdu(summary);
    const brief = summary.split(". ").slice(0, 1).join(". ") + ".";
    const bullets = summary.split(". ").map((s: string) => `• ${s.trim()}`).filter((p:string) => p.length > 5);
    const tldr = summary.slice(-150);

    // 4. Save in MongoDB
    const mongoClient = new MongoClient(process.env.MONGODB_URI!);
    await mongoClient.connect();
    await mongoClient.db("blog_summaries").collection("blogs").insertOne({
      url,
      fullText: plainText,
      createdAt: new Date(),
    });
    await mongoClient.close();

    // 5. Save in Supabase
    const supabase = createClient(
      "https://ruwaaywyobhsviwyxwfk.supabase.co",
      process.env.SUPABASE_ANON_KEY!
    );

    const { error: supabaseError } = await supabase.from("summaries").insert([
      { url, summary, urdu },
    ]);

    if (supabaseError) {
      throw new Error("Supabase insert failed: " + supabaseError.message);
    }

    return NextResponse.json({ summary, urdu, brief, bullets, tldr });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    console.error("🔥 FINAL ERROR:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


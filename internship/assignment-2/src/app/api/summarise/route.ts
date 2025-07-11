import { scrapeBlogText } from "@/lib/scrape";
import { generateSummary } from "@/lib/summary";
import { translateToUrdu } from "@/lib/translate";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return Response.json({ error: "URL is required" }, { status: 400 });

    const fullText = await scrapeBlogText(url);
    const summary = generateSummary(fullText);
    const urdu = translateToUrdu(summary);

    return Response.json({ summary, urdu });
  } catch {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

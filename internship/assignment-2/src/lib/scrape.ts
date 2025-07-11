import * as cheerio from 'cheerio';

export async function scrapeBlogText(url: string): Promise<string> {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const text =
    $('article').text() ||
    $('main').text() ||
    $('body').text();

  return text.replace(/\s+/g, ' ').trim();
}

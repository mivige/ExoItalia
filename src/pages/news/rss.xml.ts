import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = async () => {
  const site = (await getEntry("site", "site"))!.data;
  const news = (await getCollection("news", (entry) => !entry.data.bozza)).sort(
    (a, b) => b.data.data.valueOf() - a.data.data.valueOf(),
  );

  const items = news
    .map((voce) => {
      const url = new URL(`/news/${voce.id}`, site.dominio).toString();
      return `    <item>
      <title>${escapeXml(voce.data.titolo)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${voce.data.data.toUTCString()}</pubDate>
      <description>${escapeXml(voce.data.sommario)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.nome)} — News</title>
    <link>${site.dominio}</link>
    <description>Novità ed eventi di ${escapeXml(site.nome)} e delle sue sedi locali.</description>
    <language>it-IT</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};

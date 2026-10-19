import { guides, SITE_URL } from "../content/guides";

export default function sitemap() {
  const latest = guides.reduce((m, g) => (g.updated > m ? g.updated : m), guides[0]?.updated || "2026-01-01");
  return [
    { url: SITE_URL, lastModified: new Date(latest), changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/guides`, lastModified: new Date(latest), changeFrequency: "weekly", priority: 0.8 },
    ...guides.map((g) => ({
      url: `${SITE_URL}/guides/${g.slug}`,
      lastModified: new Date(g.updated),
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];
}

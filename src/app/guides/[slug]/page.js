import Link from "next/link";
import { notFound } from "next/navigation";
import GuideShell from "../../../components/GuideShell";
import { guides, getGuide, SITE_URL, AUTHOR } from "../../../content/guides";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  const url = `${SITE_URL}/guides/${g.slug}`;
  return {
    title: g.title,
    description: g.description,
    keywords: g.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: g.title,
      description: g.description,
      publishedTime: g.date,
      modifiedTime: g.updated,
      authors: [AUTHOR.url],
      locale: "fr_FR",
    },
    twitter: { card: "summary_large_image", title: g.title, description: g.description },
  };
}

const dateFr = (iso) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default async function GuidePage({ params }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const url = `${SITE_URL}/guides/${g.slug}`;
  const related = (g.related || []).map(getGuide).filter(Boolean);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    inLanguage: "fr-FR",
    datePublished: g.date,
    dateModified: g.updated,
    author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    publisher: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    mainEntityOfPage: url,
    keywords: g.keywords.join(", "),
  };
  const faqLd = g.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: g.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;
  const crumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
      { "@type": "ListItem", position: 3, name: g.title, item: url },
    ],
  };

  return (
    <GuideShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }} />

      <article className="article">
        <header className="section article-head">
          <div className="container article-grid">
            <div>
              <nav className="crumbs" aria-label="Fil d'Ariane">
                <Link href="/">Accueil</Link><span aria-hidden="true">/</span><Link href="/guides">Guides</Link>
              </nav>
              <h1 className="display display-lg article-title">{g.title}</h1>
              <p className="lead">{g.description}</p>
              <p className="guide-meta">
                <span>Par {AUTHOR.name}</span>
                <span className="guide-meta-sep" aria-hidden="true" />
                <span>{g.readingMinutes} min de lecture</span>
                <span className="guide-meta-sep" aria-hidden="true" />
                <span>Mis à jour le {dateFr(g.updated)}</span>
              </p>
            </div>
          </div>
        </header>

        <div className="section section-rule">
          <div className="container article-grid">
            <div className="prose">
              <p className="prose-intro">{g.intro}</p>
              {g.sections.map((sec) => (
                <section key={sec.h2}>
                  <h2>{sec.h2}</h2>
                  {sec.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                  {sec.list && (
                    <ul>
                      {sec.list.map((li) => <li key={li}>{li}</li>)}
                    </ul>
                  )}
                  {sec.paragraphsAfter?.map((p) => <p key={p}>{p}</p>)}
                </section>
              ))}

              {g.faq?.length > 0 && (
                <section className="faq">
                  <h2>Questions fréquentes</h2>
                  {g.faq.map((f) => (
                    <div key={f.q} className="faq-item">
                      <h3>{f.q}</h3>
                      <p>{f.a}</p>
                    </div>
                  ))}
                </section>
              )}
            </div>

            <aside className="article-aside">
              <div className="cta-panel">
                <p className="section-label">Besoin d&apos;un avis sur votre projet ?</p>
                <p className="cta-text">Un premier échange de 30 minutes pour cadrer le besoin, sans engagement. Réponse sous 24 heures ouvrées.</p>
                <a href="https://calendly.com/lucas-massoni-contact" className="btn btn-primary" target="_blank" rel="noopener noreferrer">Planifier un appel</a>
                <Link href="/#services" className="aside-link">Voir les services</Link>
              </div>
              {related.length > 0 && (
                <div className="related">
                  <p className="footer-label">À lire ensuite</p>
                  {related.map((r) => (
                    <Link key={r.slug} href={`/guides/${r.slug}`} className="related-link">{r.title}</Link>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
      </article>
    </GuideShell>
  );
}

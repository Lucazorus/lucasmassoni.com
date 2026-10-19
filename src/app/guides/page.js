import Link from "next/link";
import GuideShell from "../../components/GuideShell";
import { guides, SITE_URL, AUTHOR } from "../../content/guides";

export const metadata = {
  title: "Guides Salesforce, SAP et data : réponses aux questions des équipes",
  description:
    "Migration de données, devis, CPQ et Revenue Cloud, intégration SAP, facturation électronique, doublons, automatisation Flow ou Apex, tableaux de bord : des guides pratiques rédigés par un consultant Salesforce freelance.",
  alternates: { canonical: `${SITE_URL}/guides` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/guides`,
    title: "Guides Salesforce, SAP et data",
    description: "Des réponses pratiques aux questions que se posent les équipes qui vendent dans Salesforce et facturent dans SAP.",
  },
};

const dateFr = (iso) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default function GuidesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Guides Salesforce, SAP et data",
    url: `${SITE_URL}/guides`,
    author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: guides.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/guides/${g.slug}`,
        name: g.title,
      })),
    },
  };

  return (
    <GuideShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="section guides-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Fil d'Ariane">
            <Link href="/">Accueil</Link><span aria-hidden="true">/</span><span>Guides</span>
          </nav>
          <h1 className="display display-xl">Les questions que se posent les équipes, et des réponses concrètes.</h1>
          <p className="lead">
            Migration de données, devis, Revenue Cloud, intégration SAP, facturation électronique, doublons, automatisation, tableaux de bord.
            Des guides rédigés à partir de missions réelles, pour décider avant de lancer un projet Salesforce.
          </p>
        </div>
      </section>
      <section className="section section-rule">
        <div className="container">
          <ol className="guide-list">
            {guides.map((g) => (
              <li key={g.slug} className="guide-item">
                <Link href={`/guides/${g.slug}`} className="guide-link">
                  <h2 className="guide-item-title">{g.title}</h2>
                  <p>{g.description}</p>
                  <span className="guide-meta">
                    <span>{g.readingMinutes} min de lecture</span>
                    <span className="guide-meta-sep" aria-hidden="true" />
                    <span>Mis à jour le {dateFr(g.updated)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </GuideShell>
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Lien court à partager : lucasmassoni.com/instagram
      { source: "/instagram", destination: "https://www.instagram.com/ca_compte_/", permanent: false },
      { source: "/creation", destination: "/?vue=creation", permanent: false },
      {
        source: "/guides/facturation-electronique-salesforce-sap-comment-se-preparer",
        destination: "/guides/facturation-electronique-obligatoire-salesforce-erp",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

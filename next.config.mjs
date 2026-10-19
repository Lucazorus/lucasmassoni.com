/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/guides/facturation-electronique-salesforce-sap-comment-se-preparer",
        destination: "/guides/facturation-electronique-obligatoire-salesforce-erp",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

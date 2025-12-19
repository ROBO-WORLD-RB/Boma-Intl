export default function StructuredData() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BOMA 2025",
    url: "https://bomaintl.shop",
    logo: "https://bomaintl.shop/icon.png",
    description: "Premium African streetwear collection from Accra to the world",
    sameAs: [
      "https://www.instagram.com/bomaintl",
      "https://www.twitter.com/bomaintl",
      "https://www.facebook.com/bomaintl",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: "+233-203-617-126",
      url: "https://wa.me/233203617126",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "GH",
      addressLocality: "Accra",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "TULIP GARDEN",
    description:
      "Замовте свіжі тюльпани у Вінниці, Жмеринці та Барі. Доставка на 14 лютого і 8 березня.",
    areaServed: [
      { "@type": "City", name: "Вінниця" },
      { "@type": "City", name: "Жмеринка" },
      { "@type": "City", name: "Бар" },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

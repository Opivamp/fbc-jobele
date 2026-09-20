import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/db";

export const metadata: Metadata = {
  metadataBase: new URL("https://fbcjobele.org"),
  title: "First Baptist Church Jobele | Sanctuary of Divine Power",
  description:
    "Official website of First Baptist Church Jobele (FBC Jobele) – Sanctuary of Divine Power. Affiliated with the Nigerian Baptist Convention in Jobele, Oyo State. Growing in Christ, serving with love, reaching our community.",
  keywords: [
    "First Baptist Church Jobele",
    "FBC Jobele",
    "Sanctuary of Divine Power",
    "Nigerian Baptist Convention",
    "Jobele Oyo State",
    "Baptist Church Nigeria",
    "Worship in Jobele",
    "Divine Power Vigil",
    "Christian Church Oyo",
  ],
  authors: [{ name: "First Baptist Church Jobele Media Unit" }],
  openGraph: {
    title: "First Baptist Church Jobele | Sanctuary of Divine Power",
    description:
      "A Place of Faith. A Family of Believers. A Community on Mission in Jobele, Oyo State, Nigeria.",
    url: "https://fbcjobele.org",
    siteName: "First Baptist Church Jobele",
    images: [
      {
        url: "/images/brand/logo.jpg",
        width: 800,
        height: 800,
        alt: "First Baptist Church Jobele Seal",
      },
      {
        url: "/images/brand/building.jpg",
        width: 1200,
        height: 800,
        alt: "First Baptist Church Jobele Sanctuary Facade",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "First Baptist Church Jobele",
    description:
      "Sanctuary of Divine Power &bull; Nigerian Baptist Convention &bull; Jobele, Oyo State.",
    images: ["/images/brand/logo.jpg"],
  },
  icons: {
    icon: "/images/brand/logo.jpg",
    apple: "/images/brand/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = getSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: settings.churchName || "First Baptist Church Jobele",
    alternateName: ["FBC Jobele", "Sanctuary of Divine Power"],
    description:
      "Official Christian church affiliated with the Nigerian Baptist Convention, serving the community of Jobele and Oyo State.",
    url: "https://fbcjobele.org",
    logo: "https://fbcjobele.org/images/brand/logo.jpg",
    image: "https://fbcjobele.org/images/brand/building.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "P. O. Box 184",
      addressLocality: "Jobele",
      addressRegion: "Oyo State",
      addressCountry: "Nigeria",
    },
    telephone: settings.phone,
    email: settings.email,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "08:30",
        closes: "12:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Wednesday",
        opens: "17:30",
        closes: "19:00",
      },
    ],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-ivory-100 text-obsidian-900 antialiased selection:bg-burgundy-700 selection:text-white">
        <Navigation worshipTimes={settings.worshipTimes} />
        <main className="flex-grow">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}

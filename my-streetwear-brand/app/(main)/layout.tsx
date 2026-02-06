import type { Metadata } from "next";
import SmoothScroll from "../../src/components/SmoothScroll";
import Navbar from "../../src/components/Navbar";
import Footer from "../../src/components/Footer";
import WhatsAppButton from "../../src/components/WhatsAppButton";
import StructuredData from "../../src/components/StructuredData";

export const metadata: Metadata = {
    title: "BOMA 2026 | Premium Streetwear from Accra | African Fashion",
    description: "Discover BOMA 2026 - Premium African streetwear collection. Define the culture with authentic fashion from Accra to the world. Shop exclusive tees, hoodies, jackets & more.",
    keywords: ["BOMA", "BOMA streetwear", "African streetwear", "Accra fashion", "premium clothing", "streetwear collection", "BOMA 2026"],
    authors: [{ name: "BOMA INTL" }],
    creator: "BOMA INTL",
    publisher: "BOMA INTL",
    formatDetection: {
        email: false,
        telephone: false,
        address: false,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://bomaintl.shop",
        siteName: "BOMA 2026",
        title: "BOMA 2026 | Premium Streetwear from Accra",
        description: "Define the culture. Premium streetwear from Accra to the world.",
        images: [
            {
                url: "https://bomaintl.shop/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_1.jpg",
                width: 1200,
                height: 630,
                alt: "BOMA 2026 Streetwear Collection",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "BOMA 2026 | Premium Streetwear",
        description: "Define the culture. Premium streetwear from Accra to the world.",
        images: ["https://bomaintl.shop/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_1.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
        },
    },
    alternates: {
        canonical: "https://bomaintl.shop",
    },
};

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <StructuredData />
            <Navbar />
            <SmoothScroll>{children}</SmoothScroll>
            <Footer />
            <WhatsAppButton />
        </>
    );
}

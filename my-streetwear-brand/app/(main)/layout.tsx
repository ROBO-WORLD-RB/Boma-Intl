import type { Metadata } from "next";
import SmoothScroll from "../../src/components/SmoothScroll";
import Navbar from "../../src/components/Navbar";
import Footer from "../../src/components/Footer";
import WhatsAppButton from "../../src/components/WhatsAppButton";
import StructuredData from "../../src/components/StructuredData";

export const metadata: Metadata = {
    title: {
        default: "BOMA | Premium Streetwear & Clothing Brand",
        template: "%s | BOMA Streetwear"
    },
    description: "Shop BOMA - The premier streetwear clothing brand defining African fashion culture. Exclusive hoodies, tees, and urban apparel from Accra to the world.",
    keywords: ["BOMA", "Boma Wears", "Clothing brand", "Streetwear", "BOMA streetwear", "African fashion", "urban clothing", "Accra fashion", "premium clothing", "menswear", "womenswear"],
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
        siteName: "BOMA Streetwear",
        title: "BOMA | Premium Streetwear & Clothing Brand",
        description: "Discover BOMA - The ultimate streetwear clothing brand. Authentic urban fashion, premium hoodies, and tees defining the culture.",
        images: [
            {
                url: "https://bomaintl.shop/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_1.jpg",
                width: 1200,
                height: 630,
                alt: "BOMA Streetwear Collection",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "BOMA | Premium Streetwear & Clothing Brand",
        description: "Discover BOMA - The ultimate streetwear clothing brand. Authentic urban fashion, premium hoodies, and tees.",
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
    verification: {
        google: "OFuZJ4bnFYyaYAsvLH6d01MPqhQj3sOPOBh-5ML55Fk",
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

import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import SmoothScroll from "../src/components/SmoothScroll";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import WhatsAppButton from "../src/components/WhatsAppButton";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "BOMA 2025 | Streetwear Collection",
  description: "Define the culture. Premium streetwear from Accra to the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${inter.variable} antialiased bg-black`}>
        <Navbar />
        <SmoothScroll>{children}</SmoothScroll>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}

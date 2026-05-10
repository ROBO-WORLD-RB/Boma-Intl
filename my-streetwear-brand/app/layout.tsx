import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
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
  title: "BOMA 2026 | Premium Streetwear from Accra | African Fashion",
  description: "Discover BOMA 2026 - Premium African streetwear collection. Define the culture with authentic fashion from Accra to the world. Shop exclusive tees, hoodies, jackets & more.",
  verification: {
    google: "OFuZJ4bnFYyaYAsvLH6d01MPqhQj3sOPOBh-5ML55Fk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${inter.variable} antialiased bg-black`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

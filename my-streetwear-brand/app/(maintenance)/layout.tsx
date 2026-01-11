import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "../globals.css";

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
    title: "Maintenance | BOMA INTL",
    description: "Our platform is currently under maintenance. We'll be live soon.",
    robots: {
        index: false,
        follow: false,
        noarchive: true,
        nosnippet: true,
        noimageindex: true,
        nocache: true,
    },
};

export default function MaintenanceGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <meta name="robots" content="noindex, nofollow" />
            </head>
            <body className={`${oswald.variable} ${inter.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}

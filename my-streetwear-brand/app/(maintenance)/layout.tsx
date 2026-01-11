import type { Metadata } from "next";

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
    return <>{children}</>;
}

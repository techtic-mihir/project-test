import type { Metadata } from "next";
import "./globals.css";
import { euclidCircularB } from "./fonts";

export const metadata: Metadata = {
  title: {
    default: "Projects — Dashboard",
    template: "%s — Projects",
  },
  description: "SEO and traffic analytics dashboard for your projects.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    title: "Projects Dashboard",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={euclidCircularB.variable}>
      <body className="min-h-screen bg-brand-gray-100 font-sans text-brand-navy">{children}</body>
    </html>
  );
}

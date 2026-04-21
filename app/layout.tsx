import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Joints.AI - Personalized Physiotherapy Exercises",
  description: "Get personalized exercise programs based on your injury or pain. Professional physiotherapy guidance at home.",
  applicationName: "Joints.AI",
  openGraph: {
    title: "Joints.AI - Personalized Physiotherapy Exercises",
    description: "AI-guided rehab plans reviewed by clinicians. Recover safely at home.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joints.AI",
    description: "Personalized physiotherapy, reviewed by clinicians.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F8FB"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-slate-900 focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <ToastProvider>
          <Header />
          <div id="main">{children}</div>
        </ToastProvider>
      </body>
    </html>
  );
}

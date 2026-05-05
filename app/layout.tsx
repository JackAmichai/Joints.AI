import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { ToastProvider } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export const metadata: Metadata = {
  title: {
    default: "Joints.AI - Personalized Physiotherapy Exercises",
    template: "%s | Joints.AI",
  },
  description: "Get personalized exercise programs based on your injury or pain. Professional physiotherapy guidance at home.",
  applicationName: "Joints.AI",
  keywords: ["physiotherapy", "exercise", "rehabilitation", "AI", "health", "pain management"],
  authors: [{ name: "Joints.AI" }],
  openGraph: {
    title: "Joints.AI - Personalized Physiotherapy Exercises",
    description: "AI-guided rehab plans reviewed by clinicians. Recover safely at home.",
    type: "website",
    locale: "en_US",
    siteName: "Joints.AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joints.AI",
    description: "Personalized physiotherapy, reviewed by clinicians.",
  },
  robots: { index: true, follow: true },
  verification: {
    google: "google-site-verification-code",
  },
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
      <body className="min-h-screen bg-white antialiased pt-20">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-slate-900 focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <ErrorBoundary>
          <ToastProvider>
            <Header />
            <div id="main">{children}</div>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

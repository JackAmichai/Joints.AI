import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Joints.AI - Personalized Physiotherapy Exercises",
  description: "Get personalized exercise programs based on your injury or pain. Professional physiotherapy guidance at home.",
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
        <Header />
        {children}
      </body>
    </html>
  );
}

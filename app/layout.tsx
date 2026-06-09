import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kimberley Madoya | Full-Stack Engineer",
  description:
    "Personal portfolio showcasing modern web applications, full-stack systems engineering, and custom software architectures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-[#11131c] text-[#e1e1ef] flex flex-col selection:bg-[#ff79c6]/30 selection:text-[#ff79c6]">
        {children}
      </body>
    </html>
  );
}

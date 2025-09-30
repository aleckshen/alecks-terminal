import "./globals.css";
import type { ReactNode } from "react";
import { IBM_Plex_Mono } from "next/font/google";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"], 
  variable: "--font-plex-mono",
});

export const metadata = {
  title: "My Terminal Portfolio",
  description: "A terminal-style personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plexMono.variable} p-[20px] bg-[#1C1E26] text-[#97E0A6] font-mono`}>
        {children}
      </body>
    </html>
  );
}

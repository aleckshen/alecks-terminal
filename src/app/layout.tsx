import "./globals.css";
import { IBM_Plex_Mono } from "next/font/google";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"], 
  variable: "--font-plex-mono",
});

export const metadata = {
  title: "Aleck | Terminal",
  description: "Aleck's terminal-style personal website built with next, react, typescript and tailwindcss",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      { }
      <body className={`${plexMono.variable} font-mono min-h-screen`}>
        {children}
      </body>
    </html>
  );
}

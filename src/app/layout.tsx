import "./globals.css";
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* remove hardcoded bg, text, padding */}
      <body className={`${plexMono.variable} font-mono min-h-screen`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Syne, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const syne = Syne({ 
  subsets: ["latin"],
  variable: "--font-syne",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  style: ['normal', 'italic'],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Creative Photography",
  description: "Capturando tus mejores momentos con estilo y profesionalismo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${syne.variable} ${playfair.variable}`}>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

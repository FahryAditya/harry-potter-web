import type { Metadata } from "next";
import { Cinzel, EB_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StarsBackground } from "@/components/layout/StarsBackground";
import { FavoritesPanel } from "@/components/FavoritesPanel";
import { DetailModal } from "@/components/DetailModal";
import { LangNotice } from "@/components/LangNotice";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const ebGaramond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Potter Explorer — Archives of Magic",
  description: "A scholarly compendium of wizarding lore, enchanted houses, and arcane knowledge drawn from PotterAPI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${ebGaramond.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-text-primary font-serif selection:bg-gold/30 selection:text-gold">
        <AppProvider>
          <StarsBackground />
          <LangNotice />
          <Navbar />
          <main className="flex-1 flex flex-col relative z-10">
            {children}
          </main>
          <Footer />
          <FavoritesPanel />
          <DetailModal />
        </AppProvider>
      </body>
    </html>
  );
}

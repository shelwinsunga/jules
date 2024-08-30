import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FrontendProvider } from "@/contexts/FrontendContext";
import { ThemeProvider } from "@/components/theme-provider"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yomi",
  description: "AI LaTeX Editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <FrontendProvider>
            {children}
          </FrontendProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, themeInitScript } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/components/toast/ToastProvider";
import { AppQueryProvider } from "@/lib/query-client";
import { NavigationProvider } from "@/components/navigation/NavigationProvider";
import { FirstLoadSplash } from "@/components/navigation/FirstLoadSplash";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"), // TODO: replace with real domain
  title: {
    default: "wailee. — Web Design & Development",
    template: "%s — wailee.",
  },
  description:
    "Freelance web design and development — full-stack builds, UI/UX design, and thoughtful, accessible interfaces.",
  openGraph: {
    type: "website",
    title: "wailee. — Web Design & Development",
    description:
      "Freelance web design and development — full-stack builds, UI/UX design, and thoughtful, accessible interfaces.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en" suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}  antialiased`}
    >
      <body>
        <ThemeProvider>
          <AppQueryProvider>
            <ToastProvider>
              <NavigationProvider>
                <FirstLoadSplash />
                {children}
              </NavigationProvider>
            </ToastProvider>
          </AppQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

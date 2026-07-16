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
      <head>
        {/* Blocking, dependency-free — must run before paint to avoid
            a flash of the wrong theme. See contexts/ThemeContext.tsx. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" />
      </head>
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

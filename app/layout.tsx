import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNavbar from "@/components/BottomNavbar";
import SplashScreen from "@/components/SplashScreen";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import InstallPrompt from "@/components/InstallPrompt";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Papantla | La Ciudad que Perfuma al Mundo",
  description: "Descubre la magia, cultura y sabor de Papantla de Olarte, Veracruz.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#8B2635",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} antialiased selection:bg-primary selection:text-white bg-white dark:bg-black`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
            <SplashScreen />
            <Navbar />
            <main>{children}</main>
            <BottomNavbar />
            <ServiceWorkerRegistration />
            <InstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}

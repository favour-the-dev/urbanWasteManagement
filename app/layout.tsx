import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { AuthProvider } from "./context/auth-context";
import { ConditionalNavigation } from "@/components/conditional-navigation";
import { SessionProvider } from "next-auth/react";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Urban Waste Management",
  description:
    "Route Optimization for waste management and collection with dijstara's algorithm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.className} antialiased`}>
        <SessionProvider>
          <AuthProvider>
            <ConditionalNavigation />
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

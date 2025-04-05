// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import theme from "../theme";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../createEmotionCache";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Studentious",
    description: "A platform for group learning sessions.",
};

// Create a client-side emotion cache instance
const clientSideEmotionCache = createEmotionCache();

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ClerkProvider>
                    {/* Wrap with CacheProvider to ensure consistent class names */}
                    <CacheProvider value={clientSideEmotionCache}>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            {children}
                        </ThemeProvider>
                    </CacheProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}

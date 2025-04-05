import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import theme from "../theme";
import Navbar from "@/components/layout/Navbar";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ClerkProvider>
                    <ThemeProvider theme={theme}>
                        <Navbar
                            links={[
                                { title: "Home", path: "/" },
                                { title: "Events", path: "/events" },
                                { title: "Chats", path: "/messages" },
                                { title: "Profile", path: "/profile" },
                            ]}
                        />
                        <CssBaseline />
                        {children}
                    </ThemeProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}

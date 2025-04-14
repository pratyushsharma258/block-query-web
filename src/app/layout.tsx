import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import AppSidebarMini from "@/components/app-sidebar-mini";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Block Query",
  description: "Blockchain qa help",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased main flex flex-col items-center justify-center w-screen h-screen bg-gray-600`}
        >
          <SidebarProvider defaultOpen={false}>
            <SidebarTrigger className="bg-inherit w-3 h-3 absolute left-4 top-[18px] right-auto bottom-auto z-30" />
            <AppSidebar />
            <AppSidebarMini />
            <main>{children}</main>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

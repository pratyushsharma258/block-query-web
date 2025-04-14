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
          className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen h-screen overflow-hidden`}
        >
          <SidebarProvider defaultOpen={false}>
            <div className="flex h-screen w-screen">
              <SidebarTrigger className="absolute left-4 top-[18px] z-30 w-3 h-3 bg-inherit" />
              <AppSidebar />
              <AppSidebarMini />
              <main className="flex-grow h-full overflow-auto">{children}</main>
            </div>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

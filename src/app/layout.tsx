"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const hideSidebar = pathname === "/login" || pathname === "/register";

  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}>
        {/* 🔹 Asegura que el Sidebar aparezca solo si está autenticado */}
        {isAuthenticated && !hideSidebar && <Sidebar />}
        <main className={`${isAuthenticated && !hideSidebar ? "ml-64" : ""} flex-1 p-6`}>
          {children}
        </main>
      </body>
    </html>
  );
}

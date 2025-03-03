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
    <html lang="es" className="w-full h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex w-full min-h-screen`}>
        {/* 🔹 Sidebar solo si el usuario está autenticado */}
        {isAuthenticated && !hideSidebar && (
          <div className="w-64 min-h-screen bg-gray-900 text-white fixed left-0 top-0">
            <Sidebar />
          </div>
        )}

        {/* 🔹 Contenido Principal */}
        <main
          className={`flex-1 p-6 w-full min-h-screen overflow-auto ${
            isAuthenticated && !hideSidebar ? "ml-64" : ""
          }`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}

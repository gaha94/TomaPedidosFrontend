"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = sessionStorage.getItem("rol");
    if (!role) {
      router.push("/login"); // Redirige si no está autenticado
    }
    setUserRole(role);
  }, [router]);

  if (!userRole) return null; // No renderiza nada si no hay usuario

  // 🔹 Opciones según el rol
  const menuItems = [
    { name: "Ventas", path: "/ventas" },
    { name: "Productos", path: "/productos" },
  ];

  if (userRole === "admin") {
    menuItems.unshift({ name: "Dashboard", path: "/dashboard" });
    menuItems.push(
      { name: "Roles", path: "/roles" },
      { name: "Comprobantes", path: "/comprobantes" }
    );
  }

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4 fixed">
      <h2 className="text-2xl font-bold mb-6 text-center">Panel</h2>

      <nav className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`p-3 rounded-md text-lg transition ${
              pathname === item.path ? "bg-blue-500" : "hover:bg-gray-700"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => {
          sessionStorage.clear();
          router.push("/login");
        }}
        className="mt-auto bg-red-500 hover:bg-red-600 p-3 rounded text-center"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Sidebar;

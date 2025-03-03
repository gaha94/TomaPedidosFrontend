"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ nombre: string; email: string; rol: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumen, setResumen] = useState<{ totalVentas: number; cantidadVentas: number; productosVendidos: number } | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("user");

    if (!token || !userData) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData); // ✅ Verificar JSON válido
      if (!parsedUser || !parsedUser.rol) {
        throw new Error("Usuario inválido");
      }
      setUser(parsedUser);
      fetchResumen(token);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      sessionStorage.clear(); // ✅ Limpia datos corruptos
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchResumen = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/reportes/ventas", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔹 Asegurar que se envía correctamente
        },
      });

      if (res.status === 401) {
        throw new Error("No autorizado. Vuelve a iniciar sesión.");
      }

      const data = await res.json();
      setResumen({
        totalVentas: data.totalVentas ?? 0,
        cantidadVentas: data.cantidadVentas ?? 0,
        productosVendidos: data.productosMasVendidos?.reduce(
          (acc: number, prod: { cantidadVendida?: number }) => acc + (prod.cantidadVendida ?? 0),
          0
        ) ?? 0,
      });
    } catch (error) {
      console.error("Error al obtener resumen:", error);
      setResumen({ totalVentas: 0, cantidadVentas: 0, productosVendidos: 0 });
    }
  };

  const handleLogout = () => {
    sessionStorage.clear(); // ✅ Limpia toda la sesión
    router.push("/login");
  };

  if (loading || !user) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900">Bienvenido, {user?.nombre} 👋</h1>
        <p className="text-gray-600">Tu rol: <span className="font-semibold">{user?.rol}</span></p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold">Resumen de Ventas</h2>
          {resumen ? (
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700">Total Ventas</h3>
                <p className="text-2xl font-bold text-blue-900">${resumen.totalVentas.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-700">Cantidad de Ventas</h3>
                <p className="text-2xl font-bold text-green-900">{resumen.cantidadVentas}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-700">Productos Vendidos</h3>
                <p className="text-2xl font-bold text-purple-900">{resumen.productosVendidos}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">Cargando estadísticas...</p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition cursor-pointer"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

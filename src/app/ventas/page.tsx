"use client";
import { useState, useEffect } from "react";
import NuevoVentaModal from "@/components/NuevoVentaModal";

type Venta = {
  id: number;
  fecha: string;
  total: number;
};

export default function Ventas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("No autorizado");

        const res = await fetch("http://localhost:5000/api/ventas", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error al cargar ventas");

        const data = await res.json();
        setVentas(data);
      } catch (err) {
        console.error("Error al cargar ventas", err);
        setError("No se pudieron cargar las ventas.");
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-black">📜 Lista de Ventas</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          + Nueva Venta
        </button>
      </div>

      {loading ? (
        <p>Cargando ventas...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 text-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Fecha</th>
              <th className="border p-2">Total (S/.)</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id}>
                <td className="border p-2 text-center">{venta.id}</td>
                <td className="border p-2 text-center">{venta.fecha}</td>
                <td className="border p-2 text-center">S/. {venta.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && <NuevoVentaModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

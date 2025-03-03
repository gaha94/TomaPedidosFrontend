import { useState, useEffect } from "react";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
};

type Props = {
  onSelect: (producto: Producto) => void;
  onClose: () => void;
};

export default function SeleccionarProductoModal({ onSelect, onClose }: Props) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/productos");
        if (!res.ok) throw new Error("Error al cargar productos");

        const data = await res.json();
        setProductos(data);
      } catch (err) {
        console.error("Error al cargar ventas:", err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // 🔎 Filtrar productos por nombre
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[600px] h-[500px] flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-black">Seleccionar Producto</h2>

        {/* 🔎 Barra de búsqueda */}
        <input
          type="text"
          placeholder="Buscar producto..."
          className="w-full p-2 border text-black mb-3"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        {/* 📦 Lista de productos */}
        <div className="flex-grow overflow-auto">
          {loading ? (
            <p>Cargando productos...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : productosFiltrados.length === 0 ? (
            <p className="text-gray-500">No se encontraron productos.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-black text-left">
                  <th className="p-2 border w-[300px]">Producto</th>
                  <th className="p-2 border w-[150px]">Precio</th>
                  <th className="p-2 border w-[80px]">Agregar</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((producto) => (
                  <tr key={producto.id} className="text-black">
                    <td className="p-2 border">{producto.nombre}</td>
                    <td className="p-2 border">S/. {producto.precio.toFixed(2)}</td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => onSelect(producto)}
                        className="bg-gray text-red px-2 py-1 rounded cursor-pointer"
                      >
                        ➕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 🛑 Botón para cerrar */}
        <button onClick={onClose} className="mt-4 bg-gray-400 text-white px-4 py-2 rounded w-full cursor-pointer">
          Cerrar
        </button>
      </div>
    </div>
  );
}

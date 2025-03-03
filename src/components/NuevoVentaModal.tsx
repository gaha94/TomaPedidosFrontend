import { useState } from "react";
import SeleccionarProductoModal from "@/components/SeleccionarProductoModal";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
};

type Props = {
  onClose: () => void;
};

export default function NuevoVentaModal({ onClose }: Props) {
  const [tipoComprobante, setTipoComprobante] = useState<"boleta" | "factura">("boleta");
  const [metodoPago, setMetodoPago] = useState<"contado" | "tarjeta">("contado");
  const [cliente, setCliente] = useState({ dni: "", nombre: "", direccion: "" });
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modalProductosOpen, setModalProductosOpen] = useState(false);
  const [error, setError] = useState("");

  const agregarProducto = (producto: Producto) => {
    setProductos((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const actualizarCantidad = (id: number, cantidad: number) => {
    if (cantidad <= 0) {
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } else {
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, cantidad } : p))
      );
    }
  };

  const totalVenta = productos.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);

  // 🔹 Validar datos antes de confirmar la venta
  const validarVenta = () => {
    if (!cliente.dni.trim() || !cliente.nombre.trim() || !cliente.direccion.trim()) {
      setError("Todos los datos del cliente son obligatorios.");
      return false;
    }
    if (productos.length === 0) {
      setError("Debe agregar al menos un producto.");
      return false;
    }
    setError("");
    return true;
  };

  const confirmarVenta = () => {
    if (!validarVenta()) return;
    alert(`✅ Venta confirmada correctamente como ${tipoComprobante.toUpperCase()} (${metodoPago.toUpperCase()})!`);
    setProductos([]);
    setCliente({ dni: "", nombre: "", direccion: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[750px] h-auto">
        <h2 className="text-xl font-bold mb-4 text-black">Nueva Venta</h2>

        {/* ⚠️ Mensaje de error si hay problemas */}
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        {/* 🧾 Selección de Comprobante */}
        <label className="block text-black font-semibold mb-1">Tipo de Comprobante:</label>
        <select
          className="w-full p-2 border mb-2 text-black"
          value={tipoComprobante}
          onChange={(e) => setTipoComprobante(e.target.value as "boleta" | "factura")}
        >
          <option value="boleta">Boleta</option>
          <option value="factura">Factura</option>
        </select>

        {/* 💳 Selección de Método de Pago */}
        <label className="block text-black font-semibold mb-1">Método de Pago:</label>
        <select
          className="w-full p-2 border mb-2 text-black"
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value as "contado" | "tarjeta")}
        >
          <option value="contado">Al Contado</option>
          <option value="tarjeta">Con Tarjeta</option>
        </select>

        {/* 🏷 Datos del Cliente */}
        <input
          type="text"
          placeholder={tipoComprobante === "factura" ? "RUC de la empresa" : "DNI del cliente"}
          className="w-full p-2 border mb-2 text-black"
          value={cliente.dni}
          onChange={(e) => setCliente({ ...cliente, dni: e.target.value })}
        />
        <input
          type="text"
          placeholder="Nombre del Cliente"
          className="w-full p-2 border mb-2 text-black"
          value={cliente.nombre}
          onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
        />
        <input
          type="text"
          placeholder="Dirección"
          className="w-full p-2 border mb-2 text-black"
          value={cliente.direccion}
          onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
        />

        {/* ➕ Agregar Producto */}
        <button
          onClick={() => setModalProductosOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full cursor-pointer"
        >
          + Agregar Producto
        </button>

        {/* 📦 Lista de Productos Agregados */}
        {productos.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-black text-left">
                <th className="p-2 border w-1/6">Cantidad</th>
                <th className="p-2 border w-1/3">Producto</th>
                <th className="p-2 border w-1/6">P. Unitario</th>
                <th className="p-2 border w-1/6">Total</th>
                <th className="p-2 border w-1/6">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod) => (
                <tr key={prod.id} className="text-black text-center">
                  <td className="p-2 border">
                    <button
                      onClick={() => actualizarCantidad(prod.id, prod.cantidad - 1)}
                      className="px-2 bg-gray-300 text-black rounded-l"
                    >
                      -
                    </button>
                    <span className="px-3">{prod.cantidad}</span>
                    <button
                      onClick={() => actualizarCantidad(prod.id, prod.cantidad + 1)}
                      className="px-2 bg-gray-300 text-black rounded-r"
                    >
                      +
                    </button>
                  </td>
                  <td className="p-2 border">{prod.nombre}</td>
                  <td className="p-2 border">S/. {prod.precio.toFixed(2)}</td>
                  <td className="p-2 border">S/. {(prod.precio * prod.cantidad).toFixed(2)}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => actualizarCantidad(prod.id, 0)}
                      className="text-red-500 text-xl"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">No hay productos agregados.</p>
        )}

        {/* 💲 Total de la Venta */}
        <h3 className="text-lg font-bold text-right mt-4 text-black">
          Total: S/. {totalVenta.toFixed(2)}
        </h3>

        {/* ✅ Botón Confirmar Venta */}
        <button
          onClick={confirmarVenta}
          className={`mt-4 px-4 py-2 rounded w-full ${
            productos.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 text-white cursor-pointer"
          }`}
          disabled={productos.length === 0}
        >
          Confirmar Venta ({tipoComprobante.toUpperCase()} - {metodoPago.toUpperCase()})
        </button>

        {/* ❌ Botón Cancelar */}
        <button onClick={onClose} className="mt-2 text-red-500 cursor-pointer w-full">
          Cancelar
        </button>
      </div>

      {modalProductosOpen && (
        <SeleccionarProductoModal
          onSelect={agregarProducto}
          onClose={() => setModalProductosOpen(false)}
        />
      )}
    </div>
  );
}

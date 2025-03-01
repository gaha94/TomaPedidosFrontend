"use client";
import { useEffect, useState } from "react";

// Definir la interfaz de Producto
interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

export default function Ventas() {
  const [productos, setProductos] = useState<Producto[]>([]); // 👈 Definir el tipo del estado

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/productos", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener los productos");

        const data: Producto[] = await res.json(); // 👈 Especificar el tipo de los datos
        setProductos(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Registrar Ventas</h1>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id} className="p-2 border-b">
            {producto.nombre} - {producto.precio} USD
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../services/userService";
import "../../assets/CSS/dashboard_styles.css";

export default function UserCards() {
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-600">Error: {error.message}</p>;

  return (
    <div className="dashboard-container">
      <h1 className="text-2xl font-bold mb-4">Tarjetas de usuarios</h1>
      <div className="stats-grid">
        {users.map((u) => (
          <div key={u.id_usuario} className="stat-card">
            <div className="text-4xl">👤</div>
            <h3 className="font-semibold mt-2">{u.nombre} {u.apellido}</h3>
            <p className="text-gray-600">{u.correo}</p>
            <p className="text-sm mt-1">Rol: <strong>{u.tipo_usuario}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}

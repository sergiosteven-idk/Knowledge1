import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, deleteUser } from "../../services/userService";
import { Link } from "react-router-dom";
import "../../assets/CSS/dashboard_styles.css";

export default function Manageuser() {
  const qc = useQueryClient();

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { mutate: removeUser, isPending: deleting } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  if (isLoading) return <p>Cargando usuarios...</p>;
  if (error) return <p className="text-red-600">Error: {error.message}</p>;

  return (
    <div className="dashboard-container">
      <h1 className="text-2xl font-bold mb-4">Gestión de usuarios</h1>

      <div className="section">
        <div className="stats-grid">
          {users.map((u) => (
            <div key={u.id_usuario} className="stat-card">
              <h3 className="font-semibold">{u.nombre} {u.apellido}</h3>
              <p className="text-gray-600">{u.correo}</p>
              <p className="text-sm mt-1">Rol: <strong>{u.tipo_usuario}</strong></p>

              <div className="flex gap-2 justify-center mt-3">
                <Link to={`/admin/profile`} className="bg-blue-600 text-white px-3 py-1 rounded">Ver</Link>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => confirm("¿Eliminar usuario?") && removeUser(u.id_usuario)}
                  disabled={deleting}
                >
                  {deleting ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!users.length && <p>No hay usuarios registrados.</p>}
    </div>
  );
}

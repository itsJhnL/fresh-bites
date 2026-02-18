import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

const fallbackUsers = [
  { id: 1, name: "Bruno", email: "bruno@freshbites.com", role: "admin" },
  { id: 2, name: "Juan Dela Cruz", email: "juan@email.com", role: "customer" },
  { id: 3, name: "Maria Santos", email: "maria@email.com", role: "customer" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await adminApi.getUsers();
        setUsers(response.data);
      } catch {
        setUsers(fallbackUsers);
      }
    };

    loadUsers();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1f2937]">Users</h1>
      <p className="mt-1 text-sm text-[#64748b]">Monitor user accounts and roles.</p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="border-b border-[#edf1f4] text-[#64748b]">
            <tr>
              <th className="px-3 py-3 font-semibold">Name</th>
              <th className="px-3 py-3 font-semibold">Email</th>
              <th className="px-3 py-3 font-semibold">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-[#f4f6f8]">
                <td className="px-3 py-3 font-semibold text-[#334155]">{user.name}</td>
                <td className="px-3 py-3 text-[#334155]">{user.email}</td>
                <td className="px-3 py-3 capitalize text-[#334155]">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

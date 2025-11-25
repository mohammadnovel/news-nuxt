"use client";

import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "@/actions/user";
import DataTable from "@/components/DataTable";
import Link from "next/link";
import { Plus, Edit, Trash2, Shield, User as UserIcon } from "lucide-react";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
  _count: {
    news: number;
  };
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data as User[]);
    setLoading(false);
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user "${email}"?`)) return;

    const result = await deleteUser(id);
    if (result.success) {
      loadUsers();
    } else {
      alert(result.error || "Failed to delete user");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (value: string | null) => value || "-",
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (value: string) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === "ADMIN"
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {value === "ADMIN" ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
          {value}
        </span>
      ),
    },
    {
      key: "_count.news",
      label: "Articles",
      sortable: true,
      render: (_: any, row: User) => row._count.news,
    },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_: any, row: User) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/users/${row.id}/edit`}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleDelete(row.id, row.email)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Link
          href="/dashboard/users/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add User
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Search users..."
        defaultPageSize={10}
      />
    </div>
  );
}

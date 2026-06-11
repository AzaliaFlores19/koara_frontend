"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, Shield, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layout/layout";
import { usersApi } from "@/lib/api/users";
import { User } from "@/lib/api/auth";
import { UserModal } from "@/components/users/UserModal";
import { Table } from "@/components/Table";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Employee" as User["role"],
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setFormData({ name: "", email: "", role: "Employee" });
    setSelectedUserId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setModalMode("edit");
    setFormData({ name: user.name, email: user.email, role: user.role });
    setSelectedUserId(user.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", email: "", role: "Employee" });
    setSelectedUserId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (modalMode === "add") {
        const newUser: User = {
          id: (Math.max(...users.map((u) => parseInt(u.id)), 0) + 1).toString(),
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };

        setUsers((prev) => [...prev, newUser]);
      } else if (selectedUserId) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUserId
              ? {
                  ...u,
                  name: formData.name,
                  email: formData.email,
                  role: formData.role,
                }
              : u,
          ),
        );
      }

      handleCloseModal();
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Failed to save user changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const columns = [
    {
      header: "Name",
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 flex items-center justify-center text-gray-400">
            <Shield size={16} />
          </div>
          <span className="font-bold text-slate-900 text-sm">{user.name}</span>
        </div>
      ),
    },
    {
      header: "Email",
      render: (user: User) => (
        <span className="text-sm text-gray-500">{user.email}</span>
      ),
    },
    {
      header: "Role",
      render: (user: User) => (
        <span
          className={
            user.role === "Admin" ? "k-badge-admin" : "k-badge-employee"
          }
        >
          {user.role}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (user: User, { openConfirm }: any) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenEditModal(user)}
            className="koara-icon-btn"
            aria-label="Edit user"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() =>
              openConfirm({
                message: `¿Seguro que quieres eliminar a ${user.name}? Esta acción no se puede deshacer.`,
                onConfirm: () => handleDelete(user.id),
              })
            }
            className="koara-icon-btn"
            aria-label="Delete user"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  if (loading && users.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-koara-dark" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="koara-input !pl-12"
            />
          </div>
          <button onClick={handleOpenAddModal} className="koara-btn-black">
            <Plus size={18} />
            Add User
          </button>
        </div>
        <Table data={filteredUsers} columns={columns} itemsPerPage={8} />

        <UserModal
          isOpen={isModalOpen}
          mode={modalMode}
          formData={formData}
          setFormData={setFormData}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </DashboardLayout>
  );
}

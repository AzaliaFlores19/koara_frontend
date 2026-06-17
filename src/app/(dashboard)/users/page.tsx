"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Pencil, Trash2, Shield, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layout/layout";
import { usersApi } from "@/lib/api/users";
import { User } from "@/lib/api/auth";
import { UserModal } from "@/components/users/UserModal";
import { Table } from "@/components/Table";
import { isAdmin as checkIsAdmin } from "@/lib/auth";

export default function UsersPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: User["role"];
    password?: string;
    phone?: string;
  }>({
    name: "",
    email: "",
    role: "EMPLOYEE",
    password: "",
    phone: "",
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const admin = checkIsAdmin();
    if (!admin) {
      router.replace("/dashboard");
    } else {
      setIsAuthorized(true);
      fetchUsers();
    }
  }, [router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setFormData({ name: "", email: "", role: "EMPLOYEE", password: "", phone: "" });
    setSelectedUserId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setModalMode("edit");
    setFormData({ 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      phone: user.phone || ""
    });
    setSelectedUserId(user.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", email: "", role: "EMPLOYEE", password: "", phone: "" });
    setSelectedUserId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalMode === "add") {
        await usersApi.create({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password,
          phone: formData.phone,
        });
      } else if (selectedUserId) {
        await usersApi.update(selectedUserId, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          phone: formData.phone,
        });
      }

      await fetchUsers();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Failed to save user changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await usersApi.deactivate(id);
      await fetchUsers();
    } catch (err) {
      console.error("Error deactivating user:", err);
      alert("Failed to deactivate user.");
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) 
  ) : [];

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
            user.role === "ADMIN" ? "k-badge-admin" : "k-badge-employee"
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

  if (isAuthorized === null || (loading && users.length === 0)) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-koara-dark" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthorized) return null;

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

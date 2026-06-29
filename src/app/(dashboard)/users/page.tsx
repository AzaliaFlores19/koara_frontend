"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Pencil, Trash2, Shield, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layout/layout";
import { usersApi } from "@/services/users.service";
import { User } from "@/lib/types/models";
import { UserModal } from "@/components/users/UserModal";
import { Table } from "@/components/Table";
import { isAdmin as checkIsAdmin, getAuth } from "@/lib/api/auth.api";
import { AlertModal } from "@/components/AlertModal";

export default function UsersPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

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
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const admin = checkIsAdmin();
    if (!admin) {
      router.replace("/dashboard");
      setIsAuthorized(false);
    } else {
      setCurrentUserEmail(getAuth()?.email ?? null);
      setIsAuthorized(true);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthorized) {
      fetchUsers();
    }
  }, [isAuthorized]);

  const fetchUsers = async () => {
    if (!isAuthorized) return;
    try {
      setLoading(true);
      const data = await usersApi.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Error al cargar los usuarios. Por favor, inténtelo de nuevo más tarde.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setFormData({ name: "", email: "", role: "EMPLOYEE", password: "", phone: "" });
    setSelectedUserId(null);
    setSelectedUserEmail(null);
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
    setSelectedUserEmail(user.email);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", email: "", role: "EMPLOYEE", password: "", phone: "" });
    setSelectedUserId(null);
    setSelectedUserEmail(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone?.trim() || undefined,
      };

      if (modalMode === "add") {
        // Validation for password strength if adding a new user
        const password = formData.password || "";
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
          setAlertConfig({
            isOpen: true,
            title: "Contraseña Inválida",
            message: "La contraseña debe tener al menos 8 caracteres e incluir al menos una letra mayúscula, una letra minúscula y un número.",
          });
          setIsSubmitting(false);
          return;
        }

        await usersApi.create({
          ...payload,
          password,
        });
      } else if (selectedUserId) {
        await usersApi.update(selectedUserId, payload);
      }

      await fetchUsers();
      handleCloseModal();
    } catch (err: any) {
      console.error("Error saving user:", err);
      const errorMessage = err.response?.data?.message || "Error al guardar los cambios del usuario.";
      setAlertConfig({
        isOpen: true,
        title: "Error de Guardado",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (currentUserEmail && user.email === currentUserEmail) {
      setAlertConfig({
        isOpen: true,
        title: "Acción no permitida",
        message: "No puedes eliminar tu propio usuario.",
      });
      return;
    }

    try {
      await usersApi.deactivate(user.id);
      await fetchUsers();
    } catch (err: any) {
      console.error("Error deactivating user:", err);
      setAlertConfig({
        isOpen: true,
        title: "Error de Eliminación",
        message:
          err.response?.data?.message || "Error al desactivar el usuario.",
      });
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) 
  ) : [];

  const columns = [
    {
      header: "Nombre",
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
      header: "Correo electrónico",
      render: (user: User) => (
        <span className="text-sm text-gray-500">{user.email}</span>
      ),
    },
    {
      header: "Rol",
      render: (user: User) => (
        <span
          className={
            user.role === "ADMIN" ? "k-badge-admin" : "k-badge-employee"
          }
        >
          {user.role === "ADMIN" ? "Administrador" : "Empleado"}
        </span>
      ),
    },
    {
      header: "Acciones",
      render: (user: User, { openConfirm }: any) => {
        const isSelf = !!currentUserEmail && user.email === currentUserEmail;
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleOpenEditModal(user)}
              className="koara-icon-btn"
              aria-label="Editar usuario"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() =>
                openConfirm({
                  message: `¿Seguro que quieres eliminar a ${user.name}? Esta acción no se puede deshacer.`,
                  onConfirm: () => handleDelete(user),
                })
              }
              disabled={isSelf}
              title={
                isSelf
                  ? "No puedes eliminar tu propio usuario"
                  : "Eliminar usuario"
              }
              className="koara-icon-btn disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Eliminar usuario"
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      },
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
              placeholder="Buscar usuarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="koara-input !pl-12"
            />
          </div>
          <button onClick={handleOpenAddModal} className="koara-btn-black">
            <Plus size={18} />
            Agregar Usuario
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
          disableRole={
            modalMode === "edit" &&
            !!currentUserEmail &&
            selectedUserEmail === currentUserEmail
          }
        />

        <AlertModal
          isOpen={alertConfig.isOpen}
          title={alertConfig.title}
          message={alertConfig.message}
          onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        />
      </div>
    </DashboardLayout>
  );
}
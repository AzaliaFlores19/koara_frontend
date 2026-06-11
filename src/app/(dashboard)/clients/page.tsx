"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  CheckCircle2,
  History,
  Mail,
  PackageSearch,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import DashboardLayout from "@/components/layout/layout";
import Pagination from "@/components/inventory/Pagination";

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  rtn: string | null;
};

type ClientForm = Omit<Client, "id">;

type Notice = {
  message: string;
  type: "success" | "danger";
};

const INITIAL_CLIENTS: Client[] = [
  {
    id: 1,
    name: "Mariana Lopez",
    email: "mariana.lopez@email.com",
    phone: "+504 9988-2211",
    rtn: "08011999123456",
  },
  {
    id: 2,
    name: "Sofia Ramirez",
    email: "sofia.ramirez@email.com",
    phone: "+504 9450-1188",
    rtn: null,
  },
  {
    id: 3,
    name: "Camila Torres",
    email: "camila.torres@email.com",
    phone: "+504 9722-4609",
    rtn: "08011998111222",
  },
  {
    id: 4,
    name: "Valeria Cruz",
    email: "valeria.cruz@email.com",
    phone: "+504 9123-8765",
    rtn: null,
  },
  {
    id: 5,
    name: "Lucia Herrera",
    email: "lucia.herrera@email.com",
    phone: "+504 9366-2044",
    rtn: "08011996123400",
  },
  {
    id: 6,
    name: "Andrea Mejia",
    email: "andrea.mejia@email.com",
    phone: "+504 9544-8120",
    rtn: null,
  },
  {
    id: 7,
    name: "Gabriela Flores",
    email: "gabriela.flores@email.com",
    phone: "+504 9881-3456",
    rtn: "08011995006789",
  },
  {
    id: 8,
    name: "Natalia Pineda",
    email: "natalia.pineda@email.com",
    phone: "+504 9001-7744",
    rtn: null,
  },
  {
    id: 9,
    name: "Daniela Reyes",
    email: "daniela.reyes@email.com",
    phone: "+504 9777-4510",
    rtn: "08011997001234",
  },
];

const EMPTY_FORM: ClientForm = {
  name: "",
  email: "",
  phone: "",
  rtn: "",
};

const CLIENTS_PER_PAGE = 6;

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<ClientForm>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return clients;

    return clients.filter((client) =>
      [client.name, client.email, client.phone].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [clients, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredClients.length / CLIENTS_PER_PAGE),
  );
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * CLIENTS_PER_PAGE,
    currentPage * CLIENTS_PER_PAGE,
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setFormData(EMPTY_FORM);
    setFormError("");
  };

  const showNotice = (message: string, type: Notice["type"]) => {
    setNotice({ message, type });
    window.setTimeout(() => setNotice(null), 2600);
  };

  const handleAddClient = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextClient = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      rtn: formData.rtn?.trim() || null,
    };

    if (!nextClient.name || !nextClient.email || !nextClient.phone) {
      setFormError("Completa nombre, correo y telefono para guardar.");
      return;
    }

    setClients((currentClients) => [
      {
        id: Date.now(),
        ...nextClient,
      },
      ...currentClients,
    ]);
    setCurrentPage(1);
    closeAddModal();
    showNotice("Cliente creado correctamente.", "success");
  };

  const handleDeleteClient = (clientId: number) => {
    setClients((currentClients) =>
      currentClients.filter((client) => client.id !== clientId),
    );
    showNotice("Cliente eliminado correctamente.", "danger");
  };

  const handlePendingAction = (action: string) => {
    showNotice(`${action} se completara en la Parte 2.`, "success");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#FFFFFF_0,#F6DEEB_32%,#F1C4DA_100%)] px-4 py-6 sm:px-6 lg:px-8">
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#2B1B25] active:translate-y-0 sm:order-2"
            >
              <Plus size={18} />
              Agregar cliente
            </button>

            <div className="relative w-full max-w-2xl">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8C5E78]"
                size={18}
              />
              <input
                value={search}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Buscar por nombre, correo o telefono"
                className="w-full rounded-full border-2 border-black bg-white px-14 py-3 text-sm font-medium text-black shadow-sm outline-none transition placeholder:text-black/40 focus:ring-4 focus:ring-[#F4B8D4]/50"
              />
            </div>
          </div>

          {notice && (
            <div
              className={`fixed left-1/2 top-24 z-[60] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center justify-center gap-3 rounded-2xl border-2 px-5 py-3 text-center text-sm font-black shadow-2xl ${
                notice.type === "success"
                  ? "border-[#16A34A]/25 bg-[#DCFCE7] text-[#166534]"
                  : "border-[#DC2626]/25 bg-[#FEE2E2] text-[#991B1B]"
              }`}
            >
              {notice.type === "success" ? (
                <CheckCircle2 size={20} className="shrink-0" />
              ) : (
                <XCircle size={20} className="shrink-0" />
              )}
              <span>{notice.message}</span>
            </div>
          )}

          {filteredClients.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedClients.map((client) => (
                <article
                  key={client.id}
                  className="flex min-h-40 flex-col justify-between rounded-[1.15rem] border-2 border-black bg-gradient-to-br from-white via-white to-[#FFF3FA] p-4 shadow-[0_8px_18px_rgba(112,58,97,0.10)] transition hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(112,58,97,0.16)]"
                >
                  <div className="min-w-0">
                    <h2 className="break-words text-lg font-black leading-tight text-black">
                      {client.name}
                    </h2>
                    <div className="mt-3 space-y-1 text-sm text-slate-700">
                      <p className="flex min-w-0 items-center gap-2">
                        <Mail size={16} className="shrink-0 text-[#8C5E78]" />
                        <span className="break-all">{client.email}</span>
                      </p>
                      <p className="flex min-w-0 items-center gap-2">
                        <Phone size={16} className="shrink-0 text-[#8C5E78]" />
                        <span className="break-words">{client.phone}</span>
                      </p>
                      <p className="break-words">
                        <span className="font-black text-slate-800">RTN: </span>
                        {client.rtn || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handlePendingAction("Historial de compras")}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-sm transition hover:bg-[#F4B8D4]"
                      aria-label={`Ver historial de ${client.name}`}
                      title="Historial de compras"
                    >
                      <History size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handlePendingAction("Productos mas comprados")
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-sm transition hover:bg-[#F4B8D4]"
                      aria-label={`Ver productos mas comprados por ${client.name}`}
                      title="Productos mas comprados"
                    >
                      <PackageSearch size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePendingAction("Editar cliente")}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-sm transition hover:bg-[#F4B8D4]"
                      aria-label={`Editar ${client.name}`}
                      title="Editar cliente"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClient(client.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-sm transition hover:bg-[#F4B8D4]"
                      aria-label={`Eliminar ${client.name}`}
                      title="Eliminar cliente"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-black/10 bg-white/80 px-6 py-16 text-center shadow-sm">
              <p className="text-lg font-black text-black">
                No se encontraron clientes
              </p>
              <p className="mt-1 text-sm font-medium text-black/55">
                Prueba con otro nombre, correo o telefono.
              </p>
            </div>
          )}

          {filteredClients.length > CLIENTS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </section>

        {isAddModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:pt-16">
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-koara-fade"
              onClick={closeAddModal}
            />
            <div className="koara-modal-card animate-koara-modal">
              <h2 className="mb-6 text-2xl font-bold text-black">
                Add Client
              </h2>

              <form onSubmit={handleAddClient} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-black">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="koara-input-field"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-black">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    className="koara-input-field"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-black">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    className="koara-input-field"
                    placeholder="+504 0000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-black">
                    RTN
                  </label>
                  <input
                    value={formData.rtn ?? ""}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        rtn: event.target.value,
                      }))
                    }
                    className="koara-input-field"
                    placeholder="RTN opcional"
                  />
                </div>

                {formError && (
                  <p className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-bold text-[#9F1239]">
                    {formError}
                  </p>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="koara-btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="koara-btn-pink"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

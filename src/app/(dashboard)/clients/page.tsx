"use client";

import { FormEvent, useMemo, useState, useEffect, useCallback } from "react";
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
import { ConfirmModal } from "@/components/ConfirmModal";
import Pagination from "@/components/inventory/Pagination";
import { clientsApi, Client } from "@/services/clients.service";

type ClientForm = {
  name: string;
  email: string;
  phone: string;
  rtn: string;
};

type Notice = {
  message: string;
  type: "success" | "danger";
};

type PurchaseHistoryItem = {
  id: string;
  invoice_number: string;
  created_at: string;
  total: number;
};

type MostPurchasedProduct = {
  product: {
    id: string;
    name: string;
  };
  total_quantity: number;
};

const EMPTY_FORM: ClientForm = {
  name: "",
  email: "",
  phone: "",
  rtn: "",
};

const CLIENTS_PER_PAGE = 6;
const RTN_REGEX = /^\d{14}$/;

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [totalClients, setTotalClients] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [clientModalMode, setClientModalMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<ClientForm>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [historyClientId, setHistoryClientId] = useState<string | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  
  const [mostPurchasedClientId, setMostPurchasedClientId] = useState<string | null>(null);
  const [topProducts, setTopProducts] = useState<MostPurchasedProduct[]>([]);
  const [isTopProductsLoading, setIsTopProductsLoading] = useState(false);
  
  const [clientToDeleteId, setClientToDeleteId] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      // Backend doesn't support search yet, so we fetch all or just use pagination
      // For now, let's fetch with pagination. 
      const response = await clientsApi.getAll(currentPage, CLIENTS_PER_PAGE);
      setClients(response.data);
      setTotalClients(response.total);
    } catch (error) {
      console.error("Error fetching clients:", error);
      showNotice("Error al cargar clientes", "danger");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    if (historyClientId) {
      const fetchHistory = async () => {
        setIsHistoryLoading(true);
        try {
          const data = await clientsApi.getHistory(historyClientId);
          setPurchaseHistory(data);
        } catch (error) {
          console.error("Error fetching history:", error);
        } finally {
          setIsHistoryLoading(false);
        }
      };
      fetchHistory();
    } else {
      setPurchaseHistory([]);
    }
  }, [historyClientId]);

  useEffect(() => {
    if (mostPurchasedClientId) {
      const fetchTopProducts = async () => {
        setIsTopProductsLoading(true);
        try {
          const data = await clientsApi.getTopProducts(mostPurchasedClientId);
          setTopProducts(data);
        } catch (error) {
          console.error("Error fetching top products:", error);
        } finally {
          setIsTopProductsLoading(false);
        }
      };
      fetchTopProducts();
    } else {
      setTopProducts([]);
    }
  }, [mostPurchasedClientId]);

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return clients;

    return clients.filter((client) =>
      [client.name, client.email || "", client.phone || ""].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [clients, search]);

  const totalPages = Math.max(1, Math.ceil(totalClients / CLIENTS_PER_PAGE));

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setFormData(EMPTY_FORM);
    setFormError("");
    setSelectedClientId(null);
    setClientModalMode("add");
  };

  const showNotice = (message: string, type: Notice["type"]) => {
    setNotice({ message, type });
    window.setTimeout(() => setNotice(null), 2600);
  };

  const openAddModal = () => {
    setClientModalMode("add");
    setFormData(EMPTY_FORM);
    setSelectedClientId(null);
    setFormError("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setClientModalMode("edit");
    setSelectedClientId(client.id);
    setFormData({
      name: client.name,
      email: client.email || "",
      phone: client.phone || "",
      rtn: client.rtn ?? "",
    });
    setFormError("");
    setIsAddModalOpen(true);
  };

  const handleSaveClient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextClient = {
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      rtn: formData.rtn?.trim() || undefined,
    };

    if (!nextClient.name) {
      setFormError("El nombre es obligatorio.");
      return;
    }

    if (nextClient.rtn && !RTN_REGEX.test(nextClient.rtn)) {
      setFormError("El RTN debe tener exactamente 14 digitos numericos.");
      return;
    }

    try {
      if (clientModalMode === "edit" && selectedClientId) {
        await clientsApi.update(selectedClientId, nextClient);
        showNotice("Cliente actualizado correctamente.", "success");
      } else {
        await clientsApi.create(nextClient as any);
        showNotice("Cliente creado correctamente.", "success");
      }
      fetchClients();
      closeAddModal();
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al guardar el cliente";
      setFormError(Array.isArray(message) ? message[0] : message);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      await clientsApi.deactivate(clientId);
      setClientToDeleteId(null);
      showNotice("Cliente eliminado correctamente.", "danger");
      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
      showNotice("Error al eliminar el cliente", "danger");
    }
  };

  const clientToDelete = clients.find((client) => client.id === clientToDeleteId);
  const selectedHistoryClient = clients.find((client) => client.id === historyClientId);
  const selectedMostPurchasedClient = clients.find((client) => client.id === mostPurchasedClientId);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-HN", {
      style: "currency",
      currency: "HNL",
      minimumFractionDigits: 2,
    }).format(value);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-HN");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#FFFFFF_0,#F6DEEB_32%,#F1C4DA_100%)] px-4 py-6 sm:px-6 lg:px-8">
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={openAddModal}
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

          {isLoading ? (
             <div className="flex h-64 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#8C5E78] border-t-transparent"></div>
             </div>
          ) : filteredClients.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredClients.map((client) => (
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
                        <span className="break-all">{client.email || "-"}</span>
                      </p>
                      <p className="flex min-w-0 items-center gap-2">
                        <Phone size={16} className="shrink-0 text-[#8C5E78]" />
                        <span className="break-words">{client.phone || "-"}</span>
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
                      onClick={() => setHistoryClientId(client.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-sm transition hover:bg-[#F4B8D4]"
                      aria-label={`Ver historial de ${client.name}`}
                      title="Historial de compras"
                    >
                      <History size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMostPurchasedClientId(client.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-sm transition hover:bg-[#F4B8D4]"
                      aria-label={`Ver productos mas comprados por ${client.name}`}
                      title="Productos mas comprados"
                    >
                      <PackageSearch size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(client)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-sm transition hover:bg-[#F4B8D4]"
                      aria-label={`Editar ${client.name}`}
                      title="Editar cliente"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setClientToDeleteId(client.id)}
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

          {totalClients > CLIENTS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </section>

        {isAddModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-koara-fade"
              onClick={closeAddModal}
            />
            <div className="koara-modal-card no-scrollbar max-h-[calc(100vh-2rem)] overflow-y-auto animate-koara-modal">
              <h2 className="mb-6 text-2xl font-bold text-black">
                {clientModalMode === "add" ? "Add Client" : "Edit Client"}
              </h2>

              <form onSubmit={handleSaveClient} className="space-y-5">
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
                        rtn: event.target.value.replace(/\D/g, ""),
                      }))
                    }
                    className="koara-input-field"
                    inputMode="numeric"
                    maxLength={14}
                    placeholder="00000000000000"
                  />
                  <p className="text-right text-xs font-bold text-black/50">
                    {formData.rtn?.length || 0} / 14
                  </p>
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

        <ConfirmModal
          isOpen={!!clientToDelete}
          message={
            clientToDelete
              ? `Seguro que quieres eliminar a ${clientToDelete.name}? Esta accion no se puede deshacer.`
              : ""
          }
          onConfirm={() => {
            if (clientToDelete) handleDeleteClient(clientToDelete.id);
          }}
          onCancel={() => setClientToDeleteId(null)}
        />

        {selectedHistoryClient && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-koara-fade"
              onClick={() => setHistoryClientId(null)}
            />
            <div className="relative w-full max-w-2xl rounded-[1.75rem] border-2 border-black bg-[#F6DEEB] p-6 shadow-2xl no-scrollbar max-h-[calc(100vh-2rem)] overflow-y-auto animate-koara-modal">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8C5E78]">
                  Historial de compras
                </p>
                <h2 className="mt-1 text-2xl font-black text-black">
                  {selectedHistoryClient.name}
                </h2>
              </div>

              <div className="no-scrollbar max-h-[55vh] overflow-y-auto rounded-3xl border-2 border-black bg-white">
                {isHistoryLoading ? (
                  <div className="flex py-10 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8C5E78] border-t-transparent"></div>
                  </div>
                ) : purchaseHistory.length > 0 ? (
                  <div className="divide-y divide-black/10">
                    {purchaseHistory.map(
                      (invoice) => (
                        <div
                          key={invoice.id}
                          className="grid gap-3 px-5 py-4 text-sm text-slate-700 sm:grid-cols-[1.1fr_1fr_1fr_0.9fr]"
                        >
                          <p>
                            <span className="font-black text-slate-900">
                              Factura:{" "}
                            </span>
                            {invoice.invoice_number}
                          </p>
                          <p>
                            <span className="font-black text-slate-900">
                              Fecha:{" "}
                            </span>
                            {formatDate(invoice.created_at)}
                          </p>
                          <p>
                            <span className="font-black text-slate-900">
                              Total:{" "}
                            </span>
                            {formatCurrency(Number(invoice.total))}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="px-5 py-10 text-center text-sm font-bold text-slate-500">
                    Este cliente aun no tiene facturas registradas.
                  </p>
                )}
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setHistoryClientId(null)}
                  className="rounded-full bg-[#F4B8D4] px-7 py-3 text-sm font-black text-[#703A61] shadow-sm transition hover:bg-[#E8A7C9] active:translate-y-0.5"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedMostPurchasedClient && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-koara-fade"
              onClick={() => setMostPurchasedClientId(null)}
            />
            <div className="relative w-full max-w-xl rounded-[1.75rem] border-2 border-black bg-[#F6DEEB] p-6 shadow-2xl no-scrollbar max-h-[calc(100vh-2rem)] overflow-y-auto animate-koara-modal">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8C5E78]">
                  Productos mas comprados
                </p>
                <h2 className="mt-1 text-2xl font-black text-black">
                  {selectedMostPurchasedClient.name}
                </h2>
              </div>

              <div className="no-scrollbar max-h-[58vh] space-y-3 overflow-y-auto">
                {isTopProductsLoading ? (
                  <div className="flex py-10 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8C5E78] border-t-transparent"></div>
                  </div>
                ) : topProducts.length > 0 ? (
                  topProducts.map(
                    (item, index) => (
                      <div
                        key={item.product.id}
                        className="grid grid-cols-[auto_1fr] gap-4 rounded-3xl border-2 border-black bg-white px-5 py-4 sm:grid-cols-[auto_1fr_auto]"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4B8D4] text-sm font-black text-black">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-black text-black">{item.product.name}</p>
                          <p className="text-sm font-medium text-slate-600">
                            {item.total_quantity} unidades compradas
                          </p>
                        </div>
                      </div>
                    ),
                  )
                ) : (
                  <p className="rounded-3xl border-2 border-black bg-white px-5 py-10 text-center text-sm font-bold text-slate-500">
                    Este cliente aun no tiene productos comprados.
                  </p>
                )}
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setMostPurchasedClientId(null)}
                  className="rounded-full bg-[#F4B8D4] px-7 py-3 text-sm font-black text-[#703A61] shadow-sm transition hover:bg-[#E8A7C9] active:translate-y-0.5"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

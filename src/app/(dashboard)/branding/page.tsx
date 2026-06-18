"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Upload,
  X,
} from "lucide-react";
import DashboardLayout from "@/components/layout/layout";
import defaultLogo from "@/imports/logo_insta_2.jpg";
import { Company, companyApi } from "@/services/company.service";

type BrandingForm = {
  companyName: string;
  phone: string;
  rtn: string;
  address: string;
  email: string;
};

type Notice = {
  type: "success" | "error";
  message: string;
};

const INITIAL_FORM: BrandingForm = {
  companyName: "",
  phone: "",
  rtn: "",
  address: "",
  email: "",
};

const formatCompanyForm = (company: Company): BrandingForm => ({
  companyName: company.name,
  phone: company.phone || "",
  rtn: company.rtn,
  address: company.address || "",
  email: company.email || "",
});

export default function BrandingPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [form, setForm] = useState<BrandingForm>(INITIAL_FORM);
  const [logoPreview, setLogoPreview] = useState(defaultLogo.src);
  const [logoName, setLogoName] = useState("logo_koara.jpg");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      setIsLoading(true);
      try {
        const company = await companyApi.get();
        setCompanyId(company.id);
        setForm(formatCompanyForm(company));
        setCurrentLogoUrl(company.logo);
        setLogoPreview(company.logo || defaultLogo.src);
        setLogoName(company.logo ? "logo-empresa" : "logo_koara.jpg");
      } catch (error: any) {
        if (error?.response?.status !== 404) {
          showNotice({
            type: "error",
            message: "No se pudieron cargar los datos de la empresa.",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const showNotice = (nextNotice: Notice) => {
    setNotice(nextNotice);
    window.setTimeout(() => setNotice(null), 3200);
  };

  const updateField = (field: keyof BrandingForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const clearValidationMessage = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    event.currentTarget.setCustomValidity("");
  };

  const setEmailValidationMessage = (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;

    input.setCustomValidity(
      input.validity.valueMissing
        ? "Por favor, ingresa el correo electronico de la empresa."
        : "Por favor, ingresa un correo valido.",
    );
  };

  const validateForm = () => {
    const emptyField = Object.entries(form).find(([, value]) => !value.trim());

    if (emptyField) {
      showNotice({
        type: "error",
        message: "Todos los campos son obligatorios.",
      });
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      showNotice({
        type: "error",
        message: "Ingresa un correo válido.",
      });
      return false;
    }

    if (!/^\d{14}$/.test(form.rtn.trim())) {
      showNotice({
        type: "error",
        message: "El RTN debe tener exactamente 14 dígitos.",
      });
      return false;
    }

    return true;
  };

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedFormats = ["image/png", "image/jpeg"];

    if (!allowedFormats.includes(file.type)) {
      event.target.value = "";
      showNotice({
        type: "error",
        message: "El logo debe estar en formato PNG o JPG.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      setLogoPreview(reader.result);
      setLogoName(file.name);
      setLogoFile(file);
      showNotice({
        type: "success",
        message: "Logo cargado correctamente.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    setLogoPreview(currentLogoUrl || defaultLogo.src);
    setLogoName(currentLogoUrl ? "logo-empresa" : "logo_koara.jpg");
    setLogoFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const logoUrl = logoFile
        ? await companyApi.uploadLogo(logoFile)
        : currentLogoUrl || undefined;

      const payload = {
        name: form.companyName.trim(),
        rtn: form.rtn.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        ...(logoUrl ? { logo: logoUrl } : {}),
      };

      const savedCompany = companyId
        ? await companyApi.update(companyId, payload)
        : await companyApi.create(payload);

      setCompanyId(savedCompany.id);
      setForm(formatCompanyForm(savedCompany));
      setCurrentLogoUrl(savedCompany.logo);
      setLogoPreview(savedCompany.logo || defaultLogo.src);
      setLogoName(savedCompany.logo ? "logo-empresa" : "logo_koara.jpg");
      setLogoFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      showNotice({
        type: "success",
        message: "Cambios guardados correctamente.",
      });
    } catch (error: any) {
      const message = error?.response?.data?.message;
      showNotice({
        type: "error",
        message: Array.isArray(message)
          ? message[0]
          : message || "No se pudieron guardar los datos de la empresa.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#FFFFFF_0,#F6DEEB_34%,#F1C4DA_100%)] px-4 py-7 sm:px-6 lg:px-8">
        <section className="mx-auto w-full max-w-5xl">
          <form
            onSubmit={handleSubmit}
            className="rounded-[1.4rem] border-2 border-black bg-white/88 p-5 shadow-[0_18px_45px_rgba(99,45,78,0.16)] sm:p-7"
          >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#8C5E78]">
                  Marca
                </p>
                <h1 className="mt-1 text-2xl font-black text-black sm:text-3xl">
                  Datos de la empresa
                </h1>
              </div>

              {notice && (
                <div
                  className={`flex max-w-sm items-center gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-black shadow-sm ${
                    notice.type === "success"
                      ? "border-[#16A34A]/25 bg-[#DCFCE7] text-[#166534]"
                      : "border-[#DC2626]/25 bg-[#FEE2E2] text-[#991B1B]"
                  }`}
                >
                  {notice.type === "success" ? (
                    <CheckCircle2 size={19} className="shrink-0" />
                  ) : (
                    <AlertTriangle size={19} className="shrink-0" />
                  )}
                  <span>{notice.message}</span>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="flex min-h-80 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#8C5E78]" />
              </div>
            ) : (
              <>
                <div className="grid gap-5 lg:grid-cols-[minmax(240px,0.72fr)_minmax(0,1fr)]">
                  <div className="rounded-[1.15rem] border-2 border-black bg-[#F6DEEB] p-5">
                    <label className="text-sm font-black uppercase tracking-[0.18em] text-black">
                      Logotipo
                    </label>

                    <div className="mt-5 flex flex-col items-center text-center">
                      <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-white shadow-[0_8px_0_rgba(0,0,0,0.12)]">
                        <img
                          src={logoPreview}
                          alt="Logo de la empresa"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <p className="mt-4 max-w-full truncate text-sm font-bold text-slate-700">
                        {logoName}
                      </p>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={handleLogoChange}
                        className="hidden"
                      />

                      <div className="mt-5 flex w-full gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-black bg-black px-4 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 active:translate-y-0"
                          disabled={isSaving}
                        >
                          <ImagePlus size={17} />
                          Subir
                        </button>
                        <button
                          type="button"
                          onClick={handleResetLogo}
                          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-white text-black transition hover:bg-[#F4B8D4]"
                          aria-label="Restablecer logo"
                          title="Restablecer logo"
                          disabled={isSaving}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <label className="grid gap-2">
                      <span className="text-sm font-black uppercase tracking-[0.16em] text-black">
                        Nombre
                      </span>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C5E78]" size={18} />
                        <input
                          value={form.companyName}
                          onChange={(event) => updateField("companyName", event.target.value)}
                          onInvalid={(event) =>
                            event.currentTarget.setCustomValidity(
                              "Por favor, ingresa el nombre de la empresa.",
                            )
                          }
                          onInput={clearValidationMessage}
                          className="w-full rounded-2xl border-2 border-black bg-white px-12 py-3 text-sm font-bold text-black outline-none transition placeholder:text-black/35 focus:ring-4 focus:ring-[#F4B8D4]/45"
                          placeholder="Nombre de la empresa"
                          required
                        />
                      </div>
                    </label>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-sm font-black uppercase tracking-[0.16em] text-black">
                          Teléfono
                        </span>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C5E78]" size={18} />
                          <input
                            value={form.phone}
                            onChange={(event) => updateField("phone", event.target.value)}
                            onInvalid={(event) =>
                              event.currentTarget.setCustomValidity(
                                "Por favor, ingresa el telefono de la empresa.",
                              )
                            }
                            onInput={clearValidationMessage}
                            className="w-full rounded-2xl border-2 border-black bg-white px-12 py-3 text-sm font-bold text-black outline-none transition placeholder:text-black/35 focus:ring-4 focus:ring-[#F4B8D4]/45"
                            placeholder="+504 0000-0000"
                            required
                          />
                        </div>
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-black uppercase tracking-[0.16em] text-black">
                          RTN
                        </span>
                        <div className="relative">
                          <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C5E78]" size={18} />
                          <input
                            value={form.rtn}
                            onChange={(event) =>
                              updateField("rtn", event.target.value.replace(/\D/g, "").slice(0, 14))
                            }
                            onInvalid={(event) =>
                              event.currentTarget.setCustomValidity(
                                "Por favor, ingresa el RTN de la empresa.",
                              )
                            }
                            onInput={clearValidationMessage}
                            className="w-full rounded-2xl border-2 border-black bg-white px-12 py-3 text-sm font-bold text-black outline-none transition placeholder:text-black/35 focus:ring-4 focus:ring-[#F4B8D4]/45"
                            inputMode="numeric"
                            placeholder="00000000000000"
                            required
                          />
                        </div>
                      </label>
                    </div>

                    <label className="grid gap-2">
                      <span className="text-sm font-black uppercase tracking-[0.16em] text-black">
                        Dirección
                      </span>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 text-[#8C5E78]" size={18} />
                        <textarea
                          value={form.address}
                          onChange={(event) => updateField("address", event.target.value)}
                          onInvalid={(event) =>
                            event.currentTarget.setCustomValidity(
                              "Por favor, ingresa la direccion de la empresa.",
                            )
                          }
                          onInput={clearValidationMessage}
                          className="min-h-28 w-full resize-none rounded-2xl border-2 border-black bg-white px-12 py-3 text-sm font-bold text-black outline-none transition placeholder:text-black/35 focus:ring-4 focus:ring-[#F4B8D4]/45"
                          placeholder="Dirección de la empresa"
                          required
                        />
                      </div>
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-black uppercase tracking-[0.16em] text-black">
                        Correo electrónico
                      </span>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C5E78]" size={18} />
                        <input
                          value={form.email}
                          onChange={(event) => updateField("email", event.target.value)}
                          onInvalid={setEmailValidationMessage}
                          onInput={clearValidationMessage}
                          className="w-full rounded-2xl border-2 border-black bg-white px-12 py-3 text-sm font-bold text-black outline-none transition placeholder:text-black/35 focus:ring-4 focus:ring-[#F4B8D4]/45"
                          placeholder="correo@empresa.com"
                          type="email"
                          required
                        />
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mt-7 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-7 py-3 text-sm font-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-0"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                    {isSaving ? "Guardando..." : "Aplicar cambios"}
                  </button>
                </div>
              </>
            )}
          </form>
        </section>
      </main>
    </DashboardLayout>
  );
}

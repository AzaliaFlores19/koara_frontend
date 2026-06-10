import axios from "axios";
import img9 from "@/imports/image-9.png";
import img10 from "@/imports/image-10.png";
import img1 from "@/imports/image-1.png";
import img12 from "@/imports/image-12.png";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const url = config.url || "";

    // 1. Simular Login
    if (url.includes("auth/login")) {
      config.adapter = async () => ({
        data: {
          token: "fake-jwt-token-koara-2026",
          user: { id: "1", name: "Admin User", email: "admin@koara.com", role: "Admin" }
        },
        status: 200,
        statusText: "OK",
        headers: config.headers,
        config,
      });
    }

    // 2. Simular Perfil
    if (url.includes("auth/profile")) {
      config.adapter = async () => ({
        data: { id: "1", name: "Admin User", email: "admin@koara.com", role: "Admin" },
        status: 200,
        statusText: "OK",
        headers: config.headers,
        config,
      });
    }

  

// ... inside the dashboard/metrics interceptor conditional ...
if (url.includes("dashboard/metrics")) {
  config.adapter = async () => ({
    data: {
      totalProducts: 128,
      totalClients: 342,
      totalCategories: 16,
      lowStockProducts: [
        { name: "TOCOBO Vita Glaze Lip Mask", stock: 3 },
        { name: "Beauty of Joseon Sunscreen", stock: 2 },
        { name: "Anua Heartleaf Toner", stock: 5 }
      ],
      bestSellingProducts: [
        { name: "Watermelon Glow Serum", sales: 142, price: "$24.00", image: img9.src, code: "KO-WAT-01" },
        { name: "Centella Ampoule", sales: 98, price: "$18.50", image: img12.src, code: "KO-CEN-05" },
        { name: "Collagen Cream", sales: 75, price: "$30.00", image: img1.src, code: "KO-COL-03" },
        { name: "Green Tea Cleanser", sales: 60, price: "$22.00", image: img10.src, code: "KO-GRE-02" },
        { name: "Vita Glaze Mask Pack", sales: 45, price: "$15.00", image: img9.src, code: "KO-WAT-02" },
        { name: "Hyaluronic Acid Sun Gel", sales: 39, price: "$19.00", image: img12.src, code: "KO-CEN-05" }
      ],
      todaySales: { current: "$1,240.00", yesterday: "$980.00", thisMonth: "$24,500.00" },
      invoices: { emitted: 48, paid: 42 }
    },
    status: 200,
    statusText: "OK",
    headers: config.headers,
    config,
  });
}

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("koara_token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export async function apiGet<T>(path: string): Promise<T> {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const response = await apiClient.get<T>(cleanPath);
  return response.data;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const response = await apiClient.post<T>(cleanPath, body);
  return response.data;
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const response = await apiClient.put<T>(cleanPath, body);
  return response.data;
}

export async function apiDelete(path: string): Promise<void> {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  await apiClient.delete(cleanPath);
}
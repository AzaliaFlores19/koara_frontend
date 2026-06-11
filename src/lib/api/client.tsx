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

// Lista de usuarios centralizada para usar tanto en login como en la consulta de usuarios
const MOCK_USERS = [
  { id: "1", name: "Admin User", email: "admin@koara.com", role: "Admin", password: "Password123" },
  { id: "2", name: "Store Manager", email: "manager@koara.com", role: "Admin", password: "Password123" },
  { id: "3", name: "Sales Rep", email: "sales@koara.com", role: "Employee", password: "Password123" },
  { id: "4", name: "Support Staff", email: "support@koara.com", role: "Employee", password: "Password123" },
  { id: "5", name: "Sales Rep", email: "sales2@koara.com", role: "Employee", password: "Password123" },
  { id: "6", name: "Admin User", email: "admin2@koara.com", role: "Admin", password: "Password123" },
  { id: "7", name: "Admin User", email: "admin3@koara.com", role: "Admin", password: "Password123" },
  { id: "8", name: "Admin User", email: "admin4@koara.com", role: "Admin", password: "Password123" },
];

apiClient.interceptors.request.use(
  (config) => {
    const url = config.url || "";

    // 1. Simular Login con Validación Real de Credenciales
    if (url.includes("auth/login")) {
      config.adapter = async () => {
        // Parsear los datos enviados en el cuerpo del POST
        let requestBody = { email: "", password: "" };
        try {
          if (typeof config.data === "string") {
            requestBody = JSON.parse(config.data);
          } else if (config.data) {
            requestBody = config.data;
          }
        } catch (e) {
          console.error("Error parsing login request body:", e);
        }

        const { email, password } = requestBody;

        // Buscar si el email existe
        const matchedUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email?.toLowerCase());

        if (!matchedUser) {
          // Error: Email no encontrado
          throw {
            response: {
              data: { message: "The email address entered does not match any register." },
              status: 404,
              statusText: "Not Found",
              headers: config.headers,
              config,
            },
          };
        }

        if (matchedUser.password !== password) {
          // Error: Contraseña incorrecta
          throw {
            response: {
              data: { message: "Incorrect password. Please verify your authentication security input." },
              status: 401,
              statusText: "Unauthorized",
              headers: config.headers,
              config,
            },
          };
        }

        // Éxito: Retorna el token y la información estructural del usuario
        return {
          data: {
            token: "fake-jwt-token-koara-2026",
            user: {
              id: matchedUser.id,
              name: matchedUser.name,
              email: matchedUser.email,
              role: matchedUser.role,
            },
          },
          status: 200,
          statusText: "OK",
          headers: config.headers,
          config,
        };
      };
    }

    // 2. Simular Perfil
if (url.includes("auth/profile")) {
  config.adapter = async () => {
    let currentUser = { id: "1", name: "Admin User", email: "admin@koara.com", role: "Admin" }; // Fallback por si acaso

    if (typeof window !== "undefined") {
      const savedAuth = localStorage.getItem("koara_auth");
      if (savedAuth) {
        try {
          // Si guardaste el objeto completo en koara_auth, lo extraemos
          currentUser = JSON.parse(savedAuth);
        } catch (e) {
          console.error("Error parsing koara_auth in profile mock", e);
        }
      }
    }

    return {
      data: currentUser, // <-- Ahora devuelve dinámicamente el usuario que inició sesión
      status: 200,
      statusText: "OK",
      headers: config.headers,
      config,
    };
  };
}

    // 3. Simular Endpoint de Usuarios (Mapeado sin contraseñas por seguridad)
    if (url === "users" || url.includes("users")) {
      config.adapter = async () => ({
        data: MOCK_USERS.map(({ password, ...userWithoutPass }) => userWithoutPass),
        status: 200,
        statusText: "OK",
        headers: config.headers,
        config,
      });
    }

    // 4. Simular Dashboard Metrics
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
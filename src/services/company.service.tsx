import { apiClient } from "@/lib/api/axios";

export interface Company {
  id: string;
  name: string;
  rtn: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo: string | null;
  created_at: string;
}

export interface SaveCompanyDto {
  name: string;
  rtn: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
}

export const companyApi = {
  async get() {
    const { data } = await apiClient.get<Company>("/company");
    return data;
  },

  async create(dto: SaveCompanyDto) {
    const { data } = await apiClient.post<Company>("/company", dto);
    return data;
  },

  async update(id: string, dto: SaveCompanyDto) {
    const { data } = await apiClient.patch<Company>(`/company/${id}`, dto);
    return data;
  },

  async uploadLogo(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post<{ url: string }>("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data.url;
  },
};

import { apiClient } from "@/lib/api/axios";
import { CAICode, CAIRange } from "@/lib/types/models"; 

interface CreateCaiDto {
  cai_code: string;
}

interface CreateCaiRangeDto {
  cai_id: string;
  base_code: string;
  range_start: number;
  range_end: number;
  expiration_date: string;
}

interface UpdateCaiRangeDto {
  cai_id?: string;
  base_code?: string;
  range_start?: number;
  range_end?: number;
  expiration_date?: string;
  is_active?: boolean;
}

export const caiApi = {
  
  async getCodes(): Promise<CAICode[]> {
    const { data } = await apiClient.get<CAICode[]>("/cai");
    return data;
  },

  async createCode(dto: CreateCaiDto): Promise<CAICode[]> {
    await apiClient.post("/cai", dto);
    return this.getCodes();
  },

  async updateCode(id: string, dto: CreateCaiDto): Promise<CAICode[]> {
    await apiClient.patch(`/cai/${id}`, dto);
    return this.getCodes();
  },

  async toggleCodeStatus(id: string): Promise<CAICode[]> {
    await apiClient.patch(`/cai/${id}/deactivate`);
    return this.getCodes();
  },

 
  async getRanges(): Promise<CAIRange[]> {
    const { data } = await apiClient.get<CAIRange[]>("/cai-ranges");
    return data;
  },

  async createRange(dto: CreateCaiRangeDto): Promise<CAIRange[]> {
    await apiClient.post("/cai-ranges", dto);
    return this.getRanges();
  },

  async updateRange(id: string, dto: UpdateCaiRangeDto): Promise<CAIRange[]> {
    await apiClient.patch(`/cai-ranges/${id}`, dto);
    return this.getRanges();
  },

  async toggleRangeStatus(id: string): Promise<CAIRange[]> {
    await apiClient.patch(`/cai-ranges/${id}/deactivate`);
    return this.getRanges();
  },
};
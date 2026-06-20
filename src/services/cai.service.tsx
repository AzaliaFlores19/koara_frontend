import { apiClient } from "@/lib/api/axios";
import { CAICode, CAIRange } from "@/lib/types/models"; 

interface CreateCaiDto {
  cai_code: string;
}

interface CreateCaiWithRangeDto {
  cai_code: string;
  range_start: number;
  range_end: number;
  expiration_date: string;
}

interface UpdateCaiWithRangeDto {
  cai_code?: string;
  range_start?: number;
  range_end?: number;
  expiration_date?: string;
}

export const caiApi = {
  
  async getCodes(): Promise<CAICode[]> {
    const { data } = await apiClient.get<CAICode[]>("/cai");
    return data;
  },

  // async createCode(dto: CreateCaiDto): Promise<CAICode[]> {
  //   await apiClient.post("/cai", dto);
  //   return this.getCodes();
  // },

  // async updateCode(id: string, dto: CreateCaiDto): Promise<CAICode[]> {
  //   await apiClient.patch(`/cai/${id}`, dto);
  //   return this.getCodes();
  // },

  // async toggleCodeStatus(id: string): Promise<CAICode[]> {
  //   await apiClient.patch(`/cai/${id}/deactivate`);
  //   return this.getCodes();
  // },

 
  async getRanges(): Promise<CAIRange[]> {
    const { data } = await apiClient.get<CAIRange[]>("/cai-ranges");
    return data;
  },

  // async toggleRangeStatus(id: string): Promise<CAIRange[]> {
  //   await apiClient.patch(`/cai-ranges/${id}/deactivate`);
  //   return this.getRanges();
  // },

  async getActiveRange(): Promise<CAIRange | null> {
    const { data } = await apiClient.get<CAIRange | null>("/cai-ranges/active");
    return data;
  },

  async createUnified(dto: CreateCaiWithRangeDto): Promise<{ cai: CAICode, range: CAIRange }> {
    const { data } = await apiClient.post("/cai/with-range", dto);
    return data;
  },
  
  async updateUnified(caiId: string, rangeId: string, dto: UpdateCaiWithRangeDto): Promise<{ cai: CAICode, range: CAIRange }> {
    const { data } = await apiClient.patch(`/cai/with-range/${caiId}/${rangeId}`, dto);
    return data;
  },
};

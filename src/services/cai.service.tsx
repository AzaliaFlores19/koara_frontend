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
  
  /** Obtiene la lista de todos los códigos CAI registrados */
  async getCodes(): Promise<CAICode[]> {
    const { data } = await apiClient.get<CAICode[]>("/cai");
    return data;
  },

  /** Registrar un nuevo código CAI autorizado por la SAR */
  async createCode(dto: CreateCaiDto): Promise<CAICode[]> {
    await apiClient.post("/cai", dto);
    // Retorna la lista fresca para actualizar el estado global/local de un solo golpe
    return this.getCodes();
  },

  /** Modificar la información de un código CAI existente */
  async updateCode(id: string, dto: CreateCaiDto): Promise<CAICode[]> {
    await apiClient.patch(`/cai/${id}`, dto);
    return this.getCodes();
  },

  /** Desactivar o vencer un código CAI de forma lógica */
  async toggleCodeStatus(id: string): Promise<CAICode[]> {
    await apiClient.patch(`/cai/${id}/deactivate`);
    return this.getCodes();
  },

 
  /** Obtiene el historial de todos los rangos registrados */
  async getRanges(): Promise<CAIRange[]> {
    const { data } = await apiClient.get<CAIRange[]>("/cai-ranges");
    return data;
  },

  /** Crear un nuevo rango de facturación (CAI) */
  async createRange(dto: CreateCaiRangeDto): Promise<CAIRange[]> {
    await apiClient.post("/cai-ranges", dto);
    return this.getRanges();
  },

  /** Modificar los datos de un rango de CAI existente */
  async updateRange(id: string, dto: UpdateCaiRangeDto): Promise<CAIRange[]> {
    await apiClient.patch(`/cai-ranges/${id}`, dto);
    return this.getRanges();
  },

  async toggleRangeStatus(id: string): Promise<CAIRange[]> {
    await apiClient.patch(`/cai-ranges/${id}/deactivate`);
    return this.getRanges();
  },
};
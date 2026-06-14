import { apiGet, apiPost, apiPut, apiPatch } from "./client";
import { CAICode, CAIRange } from "@/../../src/lib/types/models";

export const caiApi = {
  
  
  getCodes: () => 
    apiGet<CAICode[]>("cai"),
    
  createCode: (data: { cai_code: string }) => 
    apiPost<CAICode[]>("cai", data),
    
  updateCode: (id: string, data: { cai_code: string }) => 
    apiPatch<CAICode[]>(`cai/${id}`, data),
    
  toggleCodeStatus: (id: string) => 
    apiPatch<CAICode[]>(`cai/${id}/deactivate`, {}),
  

  getRanges: () => 
    apiGet<CAIRange[]>("cai-ranges"),
    
  createRange: (data: Omit<CAIRange, "id" | "is_active" | "current_invoice_number">) => 
    apiPost<CAIRange[]>("cai-ranges", data),
    
  updateRange: (id: string, data: Omit<CAIRange, "id" | "current_invoice_number">) => 
    apiPut<CAIRange[]>(`cai-ranges/${id}`, data),
    
  toggleRangeStatus: (id: string) => 
    apiPatch<CAIRange[]>(`cai-ranges/${id}/deactivate`, {}),
};
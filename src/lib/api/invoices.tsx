import { Invoice } from "../types/models";
import { api } from "./axios";

export const invoicesApi = {
  getAll: async (): Promise<Invoice[]> => {
    // In a real scenario, this would call the API
    // const response = await api.get<Invoice[]>("/invoices");
    // return response.data;

    // Mocking data for now based on the image
    return [
      {
        id: "1",
        invoice_number: "6",
        client_name: "Daniel David",
        vendor_name: "Francisco Deras",
        subtotal: 0,
        taxes: 0,
        total: 0,
        status: "ISSUED",
        created_at: new Date().toISOString(),
      } as Invoice,
      {
        id: "2",
        invoice_number: "5",
        client_name: "Daniel David",
        vendor_name: "Francisco Deras",
        subtotal: 0,
        taxes: 0,
        total: 0,
        status: "CANCELLED",
        created_at: new Date().toISOString(),
      } as Invoice,
      {
        id: "3",
        invoice_number: "4",
        client_name: "Daniel David",
        vendor_name: "Francisco Deras",
        subtotal: 0,
        taxes: 0,
        total: 0,
        status: "ISSUED",
        created_at: new Date().toISOString(),
      } as Invoice,
      {
        id: "4",
        invoice_number: "3",
        client_name: "Daniel David",
        vendor_name: "Francisco Deras",
        subtotal: 0,
        taxes: 0,
        total: 0,
        status: "CANCELLED",
        created_at: new Date().toISOString(),
      } as Invoice,
      {
        id: "5",
        invoice_number: "2",
        client_name: "Daniel David",
        vendor_name: "Francisco Deras",
        subtotal: 0,
        taxes: 0,
        total: 0,
        status: "CANCELLED",
        created_at: new Date().toISOString(),
      } as Invoice,
      {
        id: "6",
        invoice_number: "1",
        client_name: "Daniel David",
        vendor_name: "Francisco Deras",
        subtotal: 0,
        taxes: 0,
        total: 0,
        status: "ISSUED",
        created_at: new Date().toISOString(),
      } as Invoice,
    ];
  },
};

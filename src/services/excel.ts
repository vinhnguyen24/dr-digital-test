// services/excel.ts
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Abe } from "../types/abe";

const statusTextMap: { [key: string]: string } = {
  active: "Đang hoạt động",
  pending: "Chưa kích hoạt",
  banned: "Đã khóa tài khoản",
};

const roleTextMap: { [key: string]: string } = {
  staff: "Nhân viên",
  supervisor: "Giám sát",
};

const statusTextToValue: { [key: string]: Abe["status"] } = {
  "Đang hoạt động": "active",
  "Chưa kích hoạt": "pending",
  "Đã khóa tài khoản": "banned",
};

const roleTextToValue: { [key: string]: Abe["role"] } = {
  "Nhân viên": "staff",
  "Giám sát": "supervisor",
};

function mapExcelRowToAbe(row: Record<string, any>): Abe {
  return {
    id: Number(row["ID"]) || 0,
    fullName: row["Họ và tên"] || "",
    userId: row["Mã nhân viên"] || "",
    phoneNumber: row["Số điện thoại"] || "",
    region: row["Vùng"] || "",
    role: roleTextToValue[row["Chức vụ"]] || row["Chức vụ"] || "",
    email: row["Email"] || "",
    status: statusTextToValue[row["Trạng thái"]] || row["Trạng thái"] || "",
  };
}

export function exportAbesToExcel(abes: Abe[], fileName = "Abes.xlsx"): void {
  const mappedData = abes.map((abe) => ({
    "Họ và tên": abe.fullName,
    "Mã nhân viên": abe.userId,
    "Số điện thoại": abe.phoneNumber,
    Vùng: abe.region,
    "Chức vụ": roleTextMap[abe.role] || abe.role,
    Email: abe.email,
    "Trạng thái": statusTextMap[abe.status] || abe.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(mappedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Abes");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, fileName);
}

export function importAbesFromExcel(file: File): Promise<Abe[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(
          worksheet,
          { defval: "" }
        );

        // Map dữ liệu từng dòng về kiểu Abe
        const abes: Abe[] = rawData.map(mapExcelRowToAbe);

        resolve(abes);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);

    reader.readAsArrayBuffer(file);
  });
}

// services/api.ts
import axios from "axios";
import { Abe } from "../types/abe";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";

export const fetchAbes = async (
  search = "",
  page = 1,
  limit = 10,
  region?: string,
  status?: string
): Promise<{ data: Abe[]; total: number }> => {
  const params: Record<string, string | number> = search
    ? { _limit: 10000 }
    : { _page: page, _limit: limit };

  const res = await axios.get<Abe[]>(`${API_URL}/abes`, { params });

  let filtered = res.data;

  if (search) {
    const keyword = search.toLowerCase();
    filtered = filtered.filter(
      (abe) =>
        abe.fullName.toLowerCase().includes(keyword) ||
        abe.userId.toLowerCase().includes(keyword)
    );
  }

  if (region) {
    filtered = filtered.filter((abe) => abe.region === region);
  }

  if (status) {
    filtered = filtered.filter((abe) => abe.status === status);
  }

  const total = filtered.length;
  const paged = filtered.slice((page - 1) * limit, page * limit);

  return { data: paged, total };
};

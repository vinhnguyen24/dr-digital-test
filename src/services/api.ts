// services/api.ts
import axios from "axios";
import { Abe } from "../types/abe";
import { v4 as uuidv4 } from "uuid";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";

export const fetchAbes = async (
  search = "",
  page = 1,
  limit = 10,
  region?: string,
  status?: string
): Promise<{ data: Abe[]; total: number }> => {
  const params: Record<string, string | number> = { _limit: 10000 };

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

export const addAbes = async (newAbes: Abe[]): Promise<Abe[]> => {
  const added: Abe[] = [];
  for (const abe of newAbes) {
    const abeWithId = {
      ...abe,
      id: uuidv4(),
    };
    const res = await axios.post<Abe>(`${API_URL}/abes`, abeWithId);
    added.push(res.data);
  }
  return added;
};

export const fetchRegions = async (): Promise<string[]> => {
  const res = await axios.get<Abe[]>(`${API_URL}/abes`, {
    params: { _limit: 10000 },
  });

  const regions = Array.from(
    new Set(res.data.map((abe) => abe.region).filter(Boolean))
  );

  return regions;
};

import axios from "axios";
import { Abe } from "../types/abe";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3002";

export const fetchAbes = async (): Promise<Abe[]> => {
  const res = await axios.get<Abe[]>(`${API_URL}/abes`);
  return res.data;
};

import React, { useEffect, useState } from "react";
import { fetchAbes } from "../services/api";
import { Abe } from "../types/abe";
import AbeTable from "../components/AbeTable/AbeTable";

const AbeListPage: React.FC = () => {
  const [abes, setAbes] = useState<Abe[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchAbes(search, page, pageSize, region, status);
        setAbes(res.data);
        setTotal(res.total);
      } catch (e) {
        console.error("Lỗi khi load dữ liệu:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [search, page, region, status]);

  const uniqueRegions = ["Bình Tân", "Tân Bình", "Quận 1"];
  const statusOptions = ["active", "pending", "banned"];

  return (
    <div style={{ padding: 24 }}>
      <h1>Danh sách ABE</h1>

      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Tìm theo tên hoặc mã"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
            setPage(1);
          }}
        >
          <option value="">-- Chọn vùng --</option>
          {uniqueRegions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">-- Chọn trạng thái --</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <AbeTable data={abes} loading={loading} />
    </div>
  );
};

export default AbeListPage;

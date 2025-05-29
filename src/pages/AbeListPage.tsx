import React, { useEffect, useState } from "react";
import { fetchAbes } from "../services/api";
import { Abe } from "../types/abe";
import AbeTable from "../components/AbeTable/AbeTable";

const AbeListPage: React.FC = () => {
  const [abes, setAbes] = useState<Abe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchAbes();
        console.log(data);
        setAbes(data);
      } catch (e) {
        console.error("Lỗi khi load dữ liệu:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Quản lý danh sách ABE</h1>
      <AbeTable data={abes} loading={loading} />
    </div>
  );
};

export default AbeListPage;

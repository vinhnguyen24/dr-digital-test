import React, { useEffect, useState } from "react";
import { fetchAbes, addAbes } from "../services/api";
import { Abe } from "../types/abe";
import AbeTable from "../components/AbeTable/AbeTable";
import {
  Button,
  Input,
  Select,
  Space,
  Row,
  Col,
  Typography,
  message,
  Upload,
} from "antd";
import {
  UploadOutlined,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { exportAbesToExcel, importAbesFromExcel } from "../services/excel";
import { SearchOutlined } from "@ant-design/icons";
import "../styles/main.scss";
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
  const handleExport = () => {
    exportAbesToExcel(abes);
  };

  const handleImport = async (file: File) => {
    try {
      const importedAbes = await importAbesFromExcel(file);

      // Gọi API thêm mới
      const addedAbes = await addAbes(importedAbes);

      // Cập nhật state (có thể fetch lại hoặc gộp data)
      setAbes((prev) => [...prev, ...addedAbes]);

      message.success("Import và thêm mới thành công!");
    } catch (error) {
      message.error("Import thất bại!");
    }
  };

  return (
    <div className="abe-list-page">
      <div className="__header">
        <h1>Quản lý danh sách ABE</h1>
      </div>
      <div className="__content">
        <div className="__content-header">
          <Row
            gutter={[16, 16]}
            style={{
              padding: "16px 0",
              background: "#fff",
              borderRadius: 8,
            }}
          >
            <Col flex="auto" style={{ minWidth: 200 }}>
              <Input
                placeholder="Tìm kiếm"
                prefix={<SearchOutlined />}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                style={{ width: abes.length ? "100%" : 231, marginRight: 16 }}
                allowClear
              />
            </Col>
            {abes.length ? (
              <div
                style={{
                  width: 1,
                  height: 24,
                  backgroundColor: "#d9d9d9",
                  margin: "0 16px",
                }}
              />
            ) : null}
            {abes.length ? (
              <Col>
                <Space>
                  <Upload
                    beforeUpload={(file) => {
                      handleImport(file);
                      return false; // chặn upload tự động của antd
                    }}
                    showUploadList={false}
                  >
                    <Button
                      type="default"
                      icon={<UploadOutlined />}
                      style={{
                        borderColor: "#FF7A00",
                        color: "#FF7A00",
                        borderRadius: 6,
                        fontWeight: 500,
                        height: 32,
                      }}
                    >
                      Tải lên nhân viên
                    </Button>
                  </Upload>

                  <Button
                    type="default"
                    icon={<ExportOutlined />}
                    style={{
                      borderColor: "#FF7A00",
                      color: "#FF7A00",
                      borderRadius: 6,
                      fontWeight: 500,
                      height: 32,
                    }}
                    onClick={handleExport}
                  >
                    Xuất danh sách tài khoản
                  </Button>

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{
                      backgroundColor: "#FF7A00",
                      borderColor: "#FF7A00",
                      borderRadius: 6,
                      fontWeight: 500,
                      height: 32,
                    }}
                  >
                    Tạo mới
                  </Button>
                </Space>
              </Col>
            ) : null}
          </Row>
          {abes.length ? (
            <Row>
              <Col>
                <Space>
                  <Typography>Bộ lọc:</Typography>
                  <Select
                    placeholder="Trạng thái"
                    style={{ width: 140 }}
                    options={[
                      { label: "Tất cả", value: "" },
                      { label: "Hoạt động", value: "active" },
                      { label: "Không hoạt động", value: "inactive" },
                    ]}
                    allowClear
                  />
                  <Select
                    placeholder="Vùng"
                    style={{ width: 140 }}
                    options={[
                      { label: "Tất cả", value: "" },
                      { label: "Miền Bắc", value: "north" },
                      { label: "Miền Nam", value: "south" },
                    ]}
                    allowClear
                  />
                </Space>
              </Col>
            </Row>
          ) : null}
        </div>
        <AbeTable data={abes} loading={loading} />
      </div>
    </div>
  );
};

export default AbeListPage;

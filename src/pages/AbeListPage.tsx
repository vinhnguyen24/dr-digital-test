import React, { useEffect, useState } from "react";
import { fetchAbes, addAbes, fetchRegions } from "../services/api";
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
  Upload,
  Modal,
  Form,
  Descriptions,
  Table,
} from "antd";
import {
  UploadOutlined,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { exportAbesToExcel, importAbesFromExcel } from "../services/excel";
import { SearchOutlined } from "@ant-design/icons";
import { statusColorMap, roleMap } from "../utils/constant";
import { v4 as uuidv4 } from "uuid";
import "../styles/main.scss";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

const { Option } = Select;
const AbeListPage: React.FC = () => {
  const [abes, setAbes] = useState<Abe[]>([]);
  const [regionOptions, setRegionOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  // header state
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [resetFlag, setResetFlag] = useState(1);
  // view user state
  const [selectedUser, setSelectedUser] = useState<Abe | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  // excel state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [importedUsers, setImportedUsers] = useState<Abe[]>([]);
  const [importing, setImporting] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchRegions().then(setRegionOptions);
  }, []);
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchAbes(search, page, pageSize, region, status);
        setAbes(res.data);
        setTotal(res.total);
        console.log(res.total);
      } catch (e) {
        console.error("Lỗi khi load dữ liệu:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [search, page, region, status, resetFlag]);

  const handleExport = () => {
    const now = new Date();
    const formatLocalDate = (d: Date) =>
      `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
        .getDate()
        .toString()
        .padStart(2, "0")}_${d.getHours().toString().padStart(2, "0")}-${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}-${d.getSeconds().toString().padStart(2, "0")}`;
    const fileName = `AbesUser_${formatLocalDate(now)}.xlsx`;
    exportAbesToExcel(abes, fileName);
  };
  const handleImport = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[];

      // Chuyển đổi sang đúng schema
      const parsedUsers: Abe[] = raw.map((item) => ({
        id: uuidv4(),
        fullName: item["Họ và tên"],
        userId: item["Mã nhân viên"]?.toString() || "",
        phoneNumber: item["Số điện thoại"]?.toString() || "",
        region: item["Vùng"],
        role: item["Vai trò"] === "Giám sát" ? "supervisor" : "staff",
        email: item["Email"],
        status:
          item["Trạng thái"] === "Đang hoạt động"
            ? "active"
            : item["Trạng thái"] === "Đã khóa tài khoản"
            ? "banned"
            : "pending",
      }));
      setImportedUsers(parsedUsers);
      setReviewModalOpen(true);
    };

    reader.readAsArrayBuffer(file);
  };

  const showModal = () => setIsModalOpen(true);

  const handleCreate = () => {
    form.validateFields().then(async (values) => {
      try {
        const added = await addAbes([values]);
        toast.success("Tạo user thành công!");
        form.resetFields();
        setResetFlag(resetFlag + 1);
        setIsModalOpen(false);
      } catch (error) {
        console.error(error);
        toast.error("Tạo user thất bại!");
      }
    });
  };

  const handleCancel = () => setIsModalOpen(false);

  const handleView = (user: Abe) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
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
            <div
              style={{
                width: 1,
                height: 24,
                backgroundColor: "#d9d9d9",
                margin: "0 16px",
              }}
            />
            <Col>
              <Space>
                <Upload
                  beforeUpload={(file) => {
                    handleImport(file);
                    return false;
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
                  onClick={showModal}
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
          </Row>
          {abes.length ? (
            <Row>
              <Col>
                <Space>
                  <Typography>Bộ lọc:</Typography>
                  <Select
                    placeholder="Trạng thái"
                    style={{ width: 140 }}
                    allowClear
                    onChange={(value) => setStatus(value || null)}
                    options={[
                      { label: "Tất cả", value: "" },
                      { label: "Đang hoạt động", value: "active" },
                      { label: "Chưa kích hoạt", value: "pending" },
                      { label: "Đã khóa tài khoản", value: "banned" },
                    ]}
                  />
                  <Select
                    placeholder="Vùng"
                    style={{ width: 140 }}
                    allowClear
                    onChange={(value) => setRegion(value || null)}
                  >
                    <Option key={"All"} value={""}>
                      Tất cả
                    </Option>
                    {regionOptions.map((region) => (
                      <Option key={region} value={region}>
                        {region}
                      </Option>
                    ))}
                  </Select>
                </Space>
              </Col>
            </Row>
          ) : null}
        </div>
        <AbeTable
          data={abes}
          loading={loading}
          handleView={handleView}
          total={total}
          page={page}
          setPage={setPage}
        />
      </div>
      <Modal
        title="Tạo nhân viên mới"
        open={isModalOpen}
        onOk={handleCreate}
        onCancel={handleCancel}
        okText="Tạo mới"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="userId"
            label="Mã nhân viên"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="region" label="Vùng" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Chức vụ" rules={[{ required: true }]}>
            <Select>
              <Option value="staff">Nhân viên</Option>
              <Option value="supervisor">Giám sát</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái hợp lệ"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="active">Đang hoạt động</Option>
              <Option value="pending">Chưa kích hoạt</Option>
              <Option value="banned">Đã khóa tài khoản</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Thông tin nhân viên"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedUser && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Họ và tên">
              {selectedUser.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Mã nhân viên">
              {selectedUser.userId}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedUser.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Vùng">
              {selectedUser.region}
            </Descriptions.Item>
            <Descriptions.Item label="Chức vụ">
              {roleMap[selectedUser.role]}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái hoạt động">
              {statusColorMap[selectedUser.status]}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
      <Modal
        title="Xác nhận import nhân viên"
        open={reviewModalOpen}
        onCancel={() => setReviewModalOpen(false)}
        onOk={async () => {
          setImporting(true);
          try {
            await addAbes(importedUsers);
            toast.success("Import thành công");
            setResetFlag(resetFlag + 1);
            setReviewModalOpen(false);
            setImportedUsers([]);
          } catch (err) {
            toast.error("Import thất bại");
          } finally {
            setImporting(false);
          }
        }}
        confirmLoading={importing}
        okText="Xác nhận import"
        cancelText="Hủy"
        width={800}
      >
        <Table
          dataSource={importedUsers}
          rowKey="id"
          columns={[
            { title: "Họ và tên", dataIndex: "fullName" },
            { title: "Mã NV", dataIndex: "userId" },
            { title: "SĐT", dataIndex: "phoneNumber" },
            { title: "Vùng", dataIndex: "region" },
            { title: "Email", dataIndex: "email" },
            {
              title: "Vai trò",
              dataIndex: "role",
              render: (role: string) => {
                return roleMap[role];
              },
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              render: (status: string) => {
                return statusColorMap[status];
              },
            },
          ]}
          pagination={{ pageSize: 5 }}
          size="small"
        />
      </Modal>
    </div>
  );
};

export default AbeListPage;

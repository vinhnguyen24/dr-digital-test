// components/AbeTable.tsx
import React, { JSX } from "react";
import { Table, Empty, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Abe } from "../../types/abe";
import { EyeOutlined } from "@ant-design/icons";
import EmptyImage from "../../assets/images/empty-image.png";
import "./AbeTable.scss";
import { statusColorMap, roleMap } from "../../utils/constant";
interface Props {
  data: Abe[];
  loading: boolean;
  handleView: (user: Abe) => void;
  total: number;
  page: number;
  setPage: (user: number) => void;
}

const AbeTable: React.FC<Props> = ({
  data,
  loading,
  handleView,
  total,
  page,
  setPage,
}) => {
  const customEmpty = (
    <Empty image={EmptyImage} description="Danh sách trống" />
  );
  const columns: ColumnsType<Abe> = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Mã nhân viên",
      dataIndex: "userId",
      key: "userId",
      render: (userId: string) => {
        return `#${userId}`;
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Vùng",
      dataIndex: "region",
      key: "region",
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        return roleMap[role];
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Trạng thái hợp lệ",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        return statusColorMap[status];
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: "#FF7A00", fontSize: 18 }} />}
            style={{ padding: 0, height: 24, width: 24 }}
            onClick={() => handleView(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{
        current: page,
        pageSize: 10,
        total: total,
        onChange: (page) => setPage(page),
        showTotal: (total, range) => (
          <span>
            Hiện thị{" "}
            <span style={{ color: "#F26D21", fontWeight: "bold" }}>
              {range[1] - range[0] + 1}
            </span>{" "}
            nhân viên
          </span>
        ),
      }}
      locale={{ emptyText: customEmpty }}
      scroll={{ x: "max-content" }}
    />
  );
};

export default AbeTable;

// components/AbeTable.tsx
import React, { JSX } from "react";
import { Table, Empty, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Abe } from "../../types/abe";
import { EyeOutlined } from "@ant-design/icons";
import EmptyImage from "../../assets/images/empty-image.png";
import "./AbeTable.scss";
interface Props {
  data: Abe[];
  loading: boolean;
}

const AbeTable: React.FC<Props> = ({ data, loading }) => {
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
          />
        </div>
      ),
    },
  ];

  const statusColorMap: { [key: string]: JSX.Element } = {
    active: <div className="status active">• Đang hoạt động</div>,
    pending: <span className="status pending">• Chưa kích hoạt</span>,
    banned: <span className="status banned">• Đã khóa tài khoản</span>,
  };

  const roleMap: { [key: string]: JSX.Element } = {
    staff: <span>Nhân viên</span>,
    supervisor: <span>Giám sát</span>,
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
      locale={{ emptyText: customEmpty }}
    />
  );
};

export default AbeTable;

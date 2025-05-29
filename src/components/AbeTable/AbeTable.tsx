// components/AbeTable.tsx
import React, { JSX } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Abe } from "../../types/abe";
import { EyeOutlined } from "@ant-design/icons";
import "./AbeTable.scss";
interface Props {
  data: Abe[];
  loading: boolean;
}

const AbeTable: React.FC<Props> = ({ data, loading }) => {
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
      render: (_, record) => (
        <div className="action">
          <button onClick={() => {}}>
            <EyeOutlined />
          </button>
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
    />
  );
};

export default AbeTable;

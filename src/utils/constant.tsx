import React, { JSX } from "react";

export const statusColorMap: { [key: string]: JSX.Element } = {
  active: <div className="status active">• Đang hoạt động</div>,
  pending: <span className="status pending">• Chưa kích hoạt</span>,
  banned: <span className="status banned">• Đã khóa tài khoản</span>,
};

export const roleMap: { [key: string]: JSX.Element } = {
  staff: <span>Nhân viên</span>,
  supervisor: <span>Giám sát</span>,
};
